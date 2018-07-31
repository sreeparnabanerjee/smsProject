import * as express from 'express';
import {addInboundSms, addOutboundSms, send405} from "./smsCtrl";

export default (app: express.Express, executeSms: (requestType: string, payload: any) => Promise<any>) => {

    // Post inbound Message
    app.post('/inbound/sms', addInboundSms.bind(this, executeSms.bind(this, 'ADD_INBOUND_SMS')));
    // Post outbound Message
    app.post('/outbound/sms', addOutboundSms.bind(this, executeSms.bind(this, 'ADD_OUTBOUND_SMS')));

    app.all('/outbound/sms', send405.bind(this,executeSms.bind(this, '')));
    app.all('/inbound/sms', send405.bind(this, executeSms.bind(this, '')));
};