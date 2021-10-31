# Welcome to the CDK Serveless Fullstack Typescript Project Template!

## Preparing template
* Modify github source input point to your new repo
* Add a secret to your secret manager in aws cnsole called github-token which allows access to github web:hooks
* run 
    - `npm run prep-install`
    - `npm run cdk synth`
    - `npm run cdk deploy InfraStack`
* After deploying stack push your first commit to propagate new changes to AWS
* Destroying:
    * `aws cloudformation delete-stack --stack-name InfraStack --region us-east-1`
    * `npm run cdk destroy`

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template