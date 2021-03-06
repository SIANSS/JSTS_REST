import jwt from 'jsonwebtoken';
import chp from 'child_process';
import config from 'config';
import * as readline from 'readline';

let getDate = Math.floor(Date.now() / 1000);
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let apiKeyVal: string;
let secretKeyVal: string;

rl.question('Access Key: ', apiKey => {
  if(apiKey != "" && !(apiKey == null && apiKey == undefined)){
    apiKeyVal = apiKey;
    rl.question('Secret Key: ', secretKey => {
      if(secretKey != "" && !(secretKey == null && secretKey == undefined)){
        secretKeyVal = secretKey;
        rl.close();
        dumpTruck();
      }
    });
  }
});

function dumpTruck(){
  var token = jwt.sign({iat: getDate, exp: getDate + 30},secretKeyVal);
  token ? console.log(token): console.log("token not avaialble");
    // console.log(`curl --location --request GET '${config.get('api.agent.endpoint')}wallet-limits'
    // --header 'apikey: ${apiKeyVal}'
    // --header 'Authorization: Bearer ${token}'`);
    // console.dir(
    //   JSON.parse(
    //     chp.execSync(
    //       `curl --location --request GET '${config.get('api.agent.endpoint')}wallet-limits' --header 'apikey: ${apiKeyVal}' --header 'Authorization: Bearer ${token}'`).toString()
    //   )
    // );
}
