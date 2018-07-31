import * as _ from 'lodash';
import { Lambda } from 'aws-sdk';
import * as log from 'winston';

export const createLambdaExecutor = (options: { lambdaRegion: string; lambdaName: string; }) => {
  if (!options || !options.lambdaName || !options.lambdaRegion) {
    log.error('Error: must provide a name and region to for lambda to execute against: %j', options);
    return <any>_.noop;
  }

  const lambda = new Lambda({ region: options.lambdaRegion });

  return (requestType: string, payload: any): Promise<any> => {
    const request = { ...payload, requestType };
    let scrubbedRequest;

    // just being extra careful as not so well versed in lodash
    try {
      scrubbedRequest = {...request};
      scrubbedRequest = _.omit(scrubbedRequest, ['accessToken', 'access_token', 'refreshToken', 'refresh_token', 'password', 'newPassword', 'jwtToken', 'oldPassword']);
    } catch (error) {
      log.error(error);
    }

    return new Promise((resolve, reject) => {
      log.info(`Calling lambda "${options.lambdaName}" in region "${options.lambdaRegion}" with payload: %j`, scrubbedRequest);

      const params = {
        FunctionName: options.lambdaName,
        Payload: JSON.stringify(request)
      };

      lambda.invoke(params, (err, data) => {
        if (err) {
          log.error(`lambda "${options.lambdaName}" unexpected error: %j`, err);
          reject(err);
          return;
        }

        if (data && data.FunctionError) {
          log.error(`lambda "${options.lambdaName}" error: %j`, data);

          if (data.Payload) {
            let payloadData = JSON.parse(<any>data.Payload);
            if (payloadData.errorMessage) {
              let error;
              try  {
                error = JSON.parse(payloadData.errorMessage);
              } catch (ex) {
                error = payloadData.errorMessage;
              }
              reject(error);
            }
          } else {
            reject(data);
          }

          return;
        }

        // need to scrub the access token and refresh token from the login request
        // just being extra careful as not block application flow in case of any error.
        try {
          // Checking if the response has access tokens and masking it completely.
          if (data && data.Payload) {
            let parsedPayload = JSON.parse(<any>data.Payload);
            if (parsedPayload && parsedPayload.access_token) {
              log.debug('lambda success: Auth successful.');
            } else {
              log.debug('lambda success: %j', data);
            }
          }
        }catch (error) {
          log.error(error);
        }
        resolve(JSON.parse(<any>data.Payload));
      });
    });
  };
};