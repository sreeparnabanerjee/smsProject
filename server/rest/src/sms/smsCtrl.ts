import * as exp from 'express';
import * as joi from 'joi';
import * as log from 'winston';
import { InvalidSchemaResponse} from "../errors/errorResponses";
import {getResponse, getStatus} from "../common/responseType";

export const send405 = (sms: any, req: exp.Request, response: exp.Response): void => {
     response.status(405).json();
     return;
};

const inboundSms: joi.ObjectSchema = joi.object().keys({
    to: joi.string().min(6).max(16).required(),
    from: joi.string().min(6).max(16).required(),
    text: joi.string().min(1).max(120).required()
});

type InboundSmsAdder = (payload: { inboundSms: any }) => Promise<any>
let okSms = {message: 'inbound sms is ok', error: ''};

export const addInboundSms = (inboundSmsAdder: InboundSmsAdder, request: exp.Request, response: exp.Response): void => {
    const message = request.body;
    log.info(`addInboundSms:  request ${message}`);
    let result: joi.ValidationResult<any>;
    result = joi.validate(message, inboundSms, {abortEarly: false});
    if(result && result.error) {
        response.status(400).json(InvalidSchemaResponse.fromJoiErrors(result.error.details));
        return;
    }
    inboundSmsAdder({inboundSms: message})
        .then((data: any) => {
            response.status(data.status).json({message: data.message, error: data.error})
        })
        .catch((err: any) => {
            response.status(err.status).json({message: err.message, error: err.error});
        });
};

type OutboundSmsAdder = (payload: { outboundSms: any }) => Promise<any>
let okOutboundSms = {message: 'outbound sms is ok', error: ''};
export const addOutboundSms = (outboundSmsAdder: OutboundSmsAdder, request: exp.Request, response: exp.Response): void => {
    const message = request.body;
    log.info(`addOutboundSms:  request ${message}`);
    let result: joi.ValidationResult<any>;
    result = joi.validate(message, inboundSms, {abortEarly: false});
    if(result && result.error) {
        response.status(400).json(InvalidSchemaResponse.fromJoiErrors(result.error.details));
        return;
    }
    outboundSmsAdder({outboundSms: message})
        .then((data: any) => {
            response.status(data.status).json({message: data.message, error: data.error})
        })
        .catch((err: any) => {
            response.status(err.status).json({message: err.message, error: err.error});
        });
};

