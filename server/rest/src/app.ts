'use strict';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
// import * as helmet from 'helmet';
import * as serverlessMiddleware from 'aws-serverless-express/middleware';
import sms from './sms';

export const createApp = (lambdaExecutorFactory: (options: { lambdaRegion: string; lambdaName: string }) => any): express.Express => {
  const app: express.Express = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(helmet); // TODO get this to work with aws middleware
  app.use(serverlessMiddleware.eventContext());


  sms(
    app,
    lambdaExecutorFactory({
      lambdaRegion: 'us-west-2',
      lambdaName: 'sree-sms-debug-sms'
    })
  );

  return app;
};