const app = require('./index');

const addSmsToRds = {
    "requestType": "ADD_INBOUND_SMS",
    "inboundSms": {
        "to": "91123456789",
        "from": "9112345678910",
        "text": "STOP"
    }
};

const addOutSmsToRds = {
    "requestType": "ADD_OUTBOUND_SMS",
    "outboundSms": {
        "to": "91123456789",
        "from": "9112345678910",
        "text": "STOP"
    }
};

app.handler(addOutSmsToRds, null, (err, output) => {
    console.log(JSON.stringify(output));
    process.exit();
});
