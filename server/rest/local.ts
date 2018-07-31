import * as log from 'winston';
import { createApp } from './src/app';
import {createLambdaExecutor} from './src/common/lambdaExecutorProvider';

(<any>log).level = 'debug';

//process.env.SMS_LAMBDA_NAME = 'sms';

const app = createApp(createLambdaExecutor);

app.listen(5000);