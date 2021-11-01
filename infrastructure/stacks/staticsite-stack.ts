import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as s3deploy from '@aws-cdk/aws-s3-deployment'
import { STATIC_SITE_OUT } from '../lib/constants'

export default class StaticS3ReactStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)
        // Static s3 for react
        const staticS3 = new s3.Bucket(this, 'test-bucket', {
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
        })
        // code deployment
        new s3deploy.BucketDeployment(this, 'ReactDeploy', {
            sources: [s3deploy.Source.asset(STATIC_SITE_OUT)],
            destinationBucket: staticS3,
        })
    }
}