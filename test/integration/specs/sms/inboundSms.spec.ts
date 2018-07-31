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

describe('==> POST ::: API --> inbound API Test Cases <==', function () {

    it('TestCase 1. should POST incoming ', async () => {

        let payload = {
            "to": "123456",
            "from": "345678",
            "text": "HI TESTING"
        };
        const incomingSmsBody = got.post(inboundSmsUrl, {headers: authHeader, body: payload, json: true});
        await expect(incomingSmsBody).to.eventually.to.have.property('statusCode', 200);
    });

    it('TestCase 2. should FAIL incoming ', async () => {

        let payload = {
            "to": "123456",
            "text": "HI TESTING"
        };
        const incomingSmsBody = got.post(inboundSmsUrl, {headers: authHeader, body: payload, json: true});
        await expect(incomingSmsBody).to.eventually.be.rejected.with.property('statusCode', 400);
    });
});