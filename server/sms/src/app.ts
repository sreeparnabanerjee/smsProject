import "reflect-metadata";
import * as log from 'winston';
import {Sms} from "./entity/sms";
import {inboundSms, outboundSms} from "./smsCtrl";

type EventRequest =
    { requestType: 'ADD_INBOUND_SMS'; inboundSms: Sms }
    | { requestType: 'ADD_OUTBOUND_SMS'; outboundSms: Sms };

export class smsEvent {

    constructor() {
        // constructor
    }

    public async processSmsEvent(event: EventRequest) {
        //log.debug('Received event: %j', event);

        if (event.requestType === null) {
            throw Error("");
        }
        try {
            switch (event.requestType) {
                case 'ADD_INBOUND_SMS': {
                    return Promise.resolve(await inboundSms(event.inboundSms));
                }
                case 'ADD_OUTBOUND_SMS': {
                    return Promise.resolve(await outboundSms(event.outboundSms));
                }
            }
        } catch (error) {
            log.error(JSON.stringify(error));
            return Promise.reject(error);
        }
    }
}