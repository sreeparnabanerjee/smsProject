const log = require('winston');
const process = require('./.compiled/app');

async function processRequests(event, callback) {
  try {
   log.info('INSIDE INDEX.TS processRequests');
    return await new process.smsEvent().processSmsEvent(event);
  } catch (error) {
   log.error("inside error block "+ JSON.stringify(error));
    return Promise.reject(JSON.stringify(error));
  }
};

module.exports.handler = (event, context,callback) => {
   // context.callbackWaitsForEmptyEventLoop = false;
 log.info('INSIDE INDEX.TS HANDLER');
  return processRequests(event, callback);
};
