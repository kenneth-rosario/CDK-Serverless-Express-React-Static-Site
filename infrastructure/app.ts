#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as stacks from './stacks'

const app = new cdk.App();

// Complete infrastructure stack 
new stacks.PipelineStack(app, 'InfraStack');

// Complete serverless backend stack
new stacks.ServerlessStack(app, 'ServerlessBackend')

// Complete static frontend stack
new stacks.StaticS3ReactStack(app, 'StaticReactFrontEnd')