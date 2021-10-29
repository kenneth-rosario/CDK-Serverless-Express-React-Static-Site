import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as s3 from '@aws-cdk/aws-s3'
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as path from 'path'
import { SecretValue } from '@aws-cdk/core';
import { CdkProject, ReactProject } from '../lib/projects';
import { CodePipeline } from '@aws-cdk/pipelines';
import { pipeline } from 'stream';

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backendCode = path.join(process.cwd(), 'backend/bundle')

    const expressBackend = new lambda.Function(this, 'express-backend', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_14_X,
      code: new lambda.AssetCode(backendCode),
      handler: 'serverless.handler',
    });
    
    const api = new apigateway.LambdaRestApi(this, 'backend', {
      handler: expressBackend
    })

    // Static site
    const staticS3 = new s3.Bucket(this, 'test-bucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html'
    })

    // Pipeline
    const sourceArtifact = new codepipeline.Artifact();
    const reactStaticSite = new codepipeline.Artifact();

    const project = new ReactProject(this);
    const cdkBuildProject = new CdkProject(this);
    
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'FirstPipeline',
      crossAccountKeys: false,
      stages: [
        {
          stageName: "Source",
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              owner: "kenneth-rosario",
              repo: "Notaso2.0",
              oauthToken: SecretValue.secretsManager('github-token'),
              actionName: "GithubRepo",
              branch: 'main',
              output: sourceArtifact
            })
          ]
        },
        {
          stageName: "InfraUpdate",
          actions: [
            new codepipeline_actions.CodeBuildAction({
              input: sourceArtifact,
              project: cdkBuildProject,
              actionName: "CDKBuild"
            })
          ],
        },
        {
          stageName: "CodeBuild",
          actions: [
            new codepipeline_actions.CodeBuildAction({
              input: sourceArtifact,
              project: project,
              actionName: "ReactBuild",
              outputs: [reactStaticSite]
            })
          ]
        },
        {
          stageName: "Deploy",
          actions: [
            new codepipeline_actions.S3DeployAction({
              actionName: "ReactDeploy",
              input: reactStaticSite,
              bucket: staticS3
            })
          ]
        }
      ]
    })

  }
}
