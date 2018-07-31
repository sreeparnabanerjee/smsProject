# smsProject
The given apis are deployed on AWS Api Gateway.

Api endpoint: 
1. https://utkhdvh681.execute-api.us-west-2.amazonaws.com/debug/outbound/sms
2. https://utkhdvh681.execute-api.us-west-2.amazonaws.com/debug/inbound/sms

Header:
Content-Type: application/json  

x-api-key: (api-key) shared in mail

TESTS:

To run tests node version 8.9.1 and npm version 5.5.1 (could have been dockerized :-(

Run 'npm run test' from path 'smsProject/test/integration'
