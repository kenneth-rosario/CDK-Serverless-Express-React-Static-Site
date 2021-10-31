import * as cdk from '@aws-cdk/core';
import ServerlessStack from '../stacks/serverless-stack'

export default class ServerlessBackendStage extends cdk.Stage {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
      super(scope, id, props);
      new ServerlessStack(this, 'ServerlessStack')      
    }
}