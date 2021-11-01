# Welcome to the CDK Serveless Fullstack Typescript Project Template!

## Preparing template
* Modify constants in infrastructure/lib

## Prepare Template
* Configure aws
* npm i -g cdk
* npm run prep-install

## Deploy Serverless Backend
* npm run build-backend
* cdk deploy ServerlessBackend

## Deploy Static React
* npm run build-frontend
* cdk deploy StaticReactFrontEnd

## Deploy CI/CD Pipeline
* npm run build-backend
* npm run build-frontend
* cdk synth
* cdk deploy PipelineStack
* New changes have to be pushed to repo 
