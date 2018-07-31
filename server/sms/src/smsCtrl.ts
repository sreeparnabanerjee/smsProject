import {Sms} from './entity/sms';
import * as log from 'winston';
import {DBConnection} from "./common/dBConnection";
import {Connection} from "typeorm";
import {handleStopKeyword, isSmsAllowed, isSmsLimitReached, setFromForOutbound} from "./stopKeywordHandler";
import {ResponseType} from "./common/responseType";

const dbConnection = new DBConnection();

export const inboundSms = async (sms: Sms): Promise<ResponseType> => {
  log.info('sender is : ' + sms.from);
   log.info('receiver is : ' + sms.to);

    let response = new ResponseType();
    response.message = '';
    response.error = '';
    response.status = 200;

    let smsConnection: Connection = await dbConnection.createConnection();
   log.info('smsConnection ' + smsConnection.isConnected);

    if(sms.text.trim() === 'STOP') {
        await handleStopKeyword(sms.from, sms.to, sms.text);
    }

    try {
        let smsOrm = new Sms();
        smsOrm = Object.assign(smsOrm, sms);
        smsOrm.timeStampGmt = new Date().toUTCString();
        await smsConnection.manager.insert(Sms, smsOrm);
       log.info('sms inserted : ' + sms.text);
    } catch (ex) {
       log.error('error in inserting sms');
       response.error = 'error in inserting sms';
       response.status = 500;
        return Promise.reject(response);
    }
    response.message = 'inbound sms is ok';
    return response;
}

export const outboundSms = async (sms: Sms): Promise<ResponseType> => {
    log.info('sender is : ' + sms.from);
    log.info('receiver is : ' + sms.to);

    let response = new ResponseType();
    response.message = '';
    response.error = '';
    response.status = 200;

    let smsConnection: Connection = await dbConnection.createConnection();
    log.info('smsConnection ' + smsConnection.isConnected);
    let savedSms;

    let isAllowed = await isSmsAllowed(sms.from, sms.to, sms.text);
    if(!isAllowed) {
        response.error = 'sms from ' + sms.from + ' and to ' + sms.to + ' blocked by STOP request';
        response.status = 403;
      return Promise.reject(response)
    }

    let isLimitReached = await isSmsLimitReached(sms.from);
    if(!isLimitReached) {
        response.error = 'limit reached for from ' + sms.from;
        response.status = 429;
        return Promise.reject(response);
    }

    try {
        let smsOrm = new Sms();
        smsOrm = Object.assign(smsOrm, sms);
        smsOrm.timeStampGmt = new Date().toUTCString();
        savedSms = await smsConnection.manager.insert(Sms, smsOrm);
        await setFromForOutbound(sms.from);
        log.info('sms inserted : ' + sms.text);
    } catch (ex) {
        log.error('error in inserting sms');
        response.error = 'error in inserting sms';
        response.status = 500;
        return Promise.reject(response);
    }
    response.message = 'outbound sms is ok';
    return response;
}