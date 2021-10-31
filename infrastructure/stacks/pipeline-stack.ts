import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import ServerlessBackendStage from '../stages/backend-stage';
import StaticSiteStage from '../stages/staticsite-stage';

export default class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    // Get input from github web hook
    const input = pipelines.CodePipelineSource
      .gitHub('kenneth-rosario/CDK-Serverless-Express-React-Static-Site', 'main')
    
    // Define initial code pipeline
    const codePipeline = new pipelines.CodePipeline(this, 'CDKPipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: input,
        commands: [
          'npm run prep-install',
          'npm run build-backend',
          'npm run build-frontend',
          'npm run cdk synth PipelineStack'
        ]
      }),
      selfMutation: true,
    })

    // backend services deployment
    codePipeline.addStage(new ServerlessBackendStage(this, 'ServerlessBackendStage'))
    // frontend static deployment
    codePipeline.addStage(new StaticSiteStage(this, 'StaticSiteDeploy'))
  }
}
