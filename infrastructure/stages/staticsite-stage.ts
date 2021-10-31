import * as cdk from '@aws-cdk/core'
import StaticS3ReactStack from '../stacks/staticsite-stack';

export default class StaticSiteStage extends cdk.Stage {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);
        new StaticS3ReactStack(this, 'ReactStack', props)
    }
}
