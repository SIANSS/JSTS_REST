const child_process = require('child_process');
const config =  require('./config/default.js');
let jwt = require('jsonwebtoken');
let getDate = Math.floor(Date.now() / 1000);
// const beautify = require("json-beautify");


jwt.sign(
    {
      iat: getDate,
      exp: getDate + 30,
    },
    config.apiKey.secret,
    function(err, token) {
      // console.log(token);
      // console.log(beautify(child_process.execSync(`curl --location --request GET '${config.api.agent.endpoint}wallet-limits' --header 'apikey: ${config.apiKey.keyId}' --header 'Authorization: Bearer ${token}'`).toString('UTF8'), null, 2, 100));
      console.dir(JSON.parse(child_process.execSync(`curl --location --request GET '${config.api.agent.endpoint}wallet-limits' --header 'apikey: ${config.apiKey.keyId}' --header 'Authorization: Bearer ${token}'`).toString('UTF8')));
    }
  );
