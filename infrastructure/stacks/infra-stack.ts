import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as s3 from '@aws-cdk/aws-s3'
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as path from 'path'
import * as pipelines from '@aws-cdk/pipelines';
import { ReactProject } from '../lib/projects';

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
      websiteIndexDocument: 'index.html',
    })

    const input = pipelines.CodePipelineSource
      .gitHub('kenneth-rosario/CDK-Serverless-Express-React-Static-Site', 'main')
    
    const codePipeline = new pipelines.CodePipeline(this, 'CDKPipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: input,
        commands: [
          'npm run prep-install',
          'npm run build-backend',
          'npx cdk synth'
        ]
      }),
      selfMutation: true,
    })

    codePipeline.buildPipeline()

    const regularPipeline = codePipeline.pipeline

    // Continue Pipeline
    const sourceArtifact = regularPipeline.stages[0].actions[0].actionProperties.outputs![0]
    const reactStaticSite = new codepipeline.Artifact();
    const project = new ReactProject(this);

    regularPipeline.addStage({
        stageName: 'CodeBuild',
        actions: [
          new codepipeline_actions.CodeBuildAction({
            input: sourceArtifact,
            project: project,
            actionName: "ReactBuild",
            outputs: [reactStaticSite]
          })
        ]
    })

    regularPipeline.addStage({
        stageName: "Deploy",
        actions: [
          new codepipeline_actions.S3DeployAction({
            actionName: "ReactDeploy",
            input: reactStaticSite,
            bucket: staticS3,
            extract: true,
          })
        ]
    })

  }
}
