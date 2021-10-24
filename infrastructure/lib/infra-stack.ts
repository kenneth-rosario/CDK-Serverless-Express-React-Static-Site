import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as s3 from '@aws-cdk/aws-s3'
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path'

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const parentPath = path.join(process.cwd(), 'backend/src/serverless.ts')

    const expressBackend = new NodejsFunction(this, 'express-backend', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(parentPath),
    });
    
    const api = new apigateway.LambdaRestApi(this, 'backend', {
      handler: expressBackend
    })

    // Static site
    const staticS3 = new s3.Bucket(this, 'test-bucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html'
    })
  }
}
