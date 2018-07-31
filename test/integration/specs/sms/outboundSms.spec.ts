import * as chaiAsPromised from 'chai-as-promised';
import {expect, use as chaiUse} from 'chai';
import 'mocha';
import * as got from 'got';
import * as yaml from "node-yaml";

chaiUse(chaiAsPromised);

const envData = yaml.readSync('../../../env.yml');

const outboundSmsUrl = envData.OUTBOUND;
const inboundSmsUrl = envData.INBOUND;

let authHeader = {
    'Content-type': 'application/json',
    'x-api-key': envData.APIKEY
};

describe('==> POST ::: API --> outbound API Test Cases <==', function () {

    it('TestCase 1. should POST outbound ', async () => {

        let payload = {
            "to": "1234567",
            "from": "3456787",
            "text": "HI TESTING OUTBOUND"
        };
        const outboundSmsBody = got.post(outboundSmsUrl, {headers: authHeader, body: payload, json: true});
        await expect(outboundSmsBody).to.eventually.to.have.property('statusCode', 200);
    });

    it('TestCase 2. should FAIL OUTBOUND with STOP ', async () => {

        let inboundPayload = {
            "to": "123456",
            "from": "234567",
            "text": "STOP"
        };

        let outboundPayload = {
            "to": "123456",
            "from": "234567",
            "text": "Hi testing outbound"
        };
        const incomingSmsBody = got.post(inboundSmsUrl, {headers: authHeader, body: inboundPayload, json: true});
        await expect(incomingSmsBody).to.eventually.to.have.property('statusCode', 200);

        const outboundSmsBody = got.post(outboundSmsUrl, {headers: authHeader, body: outboundPayload, json: true});
        await expect(outboundSmsBody).to.eventually.to.be.rejected.with.property('statusCode', 403);

    });
});