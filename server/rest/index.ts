import * as awsServerlessExpress from 'aws-serverless-express';
import * as log from 'winston';
import { createApp } from './src/app';
import {createLambdaExecutor} from './src/common/lambdaExecutorProvider';

(<any>log).level = process.env.REST_LOG_LEVEL || 'debug';

const server = awsServerlessExpress.createServer(createApp(createLambdaExecutor));

export const handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
