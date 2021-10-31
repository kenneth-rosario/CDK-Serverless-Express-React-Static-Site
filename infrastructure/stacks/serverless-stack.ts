import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as path from 'path';

export class ServerlessStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)
        // backend code
        const backendCode = path.join(process.cwd(), 'backend/bundle')
        // expressBackend
        const expressBackend = new lambda.Function(this, 'express-backend', {
            memorySize: 1024,
            timeout: cdk.Duration.seconds(5),
            runtime: lambda.Runtime.NODEJS_14_X,
            code: new lambda.AssetCode(backendCode),
            handler: 'serverless.handler',
        });
        // lambda rest api
        new apigateway.LambdaRestApi(this, 'backend', {
            handler: expressBackend,
            proxy: true
        })
    }
}