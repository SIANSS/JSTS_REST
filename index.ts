import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import chp from 'child_process';
import config from 'config';
import * as readline from 'readline';
import * as fs from "fs";

// let getDate = Math.floor(Date.now() / 1000);
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let option: number;
let logAll: boolean = false;

main();

function main(){
  rl.question('Log CURL ?: [Y/N] ', useOpt => {
    if(useOpt == "Y" || useOpt == "y"){
      logAll = true;
    } else {
      if(useOpt != "N"){
        logAll = false;
        console.log("Log Disabled");
      }
    }
    rl.question('WLM-1/ WLM-2/ ACC-2/ payment Token/ ob Token/ activationCode [1/2/3/4/5/6]: ', useOpt => {
      option = Number.parseInt(useOpt);
      if(option != null){
          if(option == 1){
            ob_wallet_limits();
          }
          if(option == 2){
            ob_updateWallet();
          }
          if(option == 3){
            ob_CardlessAccount();
          }
          if(option == 4){
            payment();
          }
          if(option == 5){
            console.log(taken());
            askQuit();
          }
          if(option == 6){
            activateCode();
          }
      }
    });
  });
}

function taken(): String{
  return jwt.sign({iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 30},`${config.get('env.onboard.secret')}`);
}

function sign(requestPayload: any): string{
  const signer = crypto.createSign('SHA256');
  signer.update(JSON.stringify(requestPayload));
  signer.end();
  return signer.sign(fs.readFileSync("../../../../private.key").toString(), 'base64');
}

function decrypt(message: string, privateKey: string) {
  const buffer = Buffer.from(message, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer,
  );
  return decrypted.toString('utf8');
}

function ob_updateWallet() {
  let token = taken();

  rl.question('Wallet Limit ID Please ', useOpt => {
    if(useOpt != null && useOpt != ""){
      // let requestPayload = {"walletLimitId": '"' + useOpt + '"'};

      if(logAll === true){
        console.log(`curl --location --request PUT '${config.get('api.agent.endpoint')}wallet-limits/3e95d6a3-59b4-49ad-9403-3cf7908e6b8a'
        --header 'apikey: ${config.get('env.onboard.access')}'
        --header 'Authorization: Bearer ${token}'
        --header 'Content-Type: application/json'
        --data-raw '{"walletLimitId": "${useOpt}"}'`);
      }
      console.dir(
        JSON.parse(
          chp.execSync(
            `curl --location --request PUT '${config.get('api.agent.endpoint')}wallet-limits/3e95d6a3-59b4-49ad-9403-3cf7908e6b8a' --header 'apikey: ${config.get('env.onboard.access')}' --header 'Authorization: Bearer ${token}' --header 'Content-Type: application/json' --data-raw '{"walletLimitId": "${useOpt}"}'`).toString()
        )
      );
      askQuit();
    } else {
      ob_updateWallet();
    }
  });
};

function ob_wallet_limits(){
  var token = taken();
  if(logAll === true){
    console.log(`curl --location --request GET '${config.get('api.agent.endpoint')}wallet-limits/' --header 'apikey: ${config.get('env.onboard.access')}' --header 'Authorization: Bearer ${token}'`);
  }
  console.dir(
    JSON.parse(
      chp.execSync(
        `curl --location --request GET '${config.get('api.agent.endpoint')}wallet-limits/' --header 'apikey: ${config.get('env.onboard.access')}' --header 'Authorization: Bearer ${token}'`).toString()
    )
  );
  askQuit();
}


function ob_CardlessAccount(){
  var token = taken();
  var requestPayload = {
    "accountNo": "ob-2-10-o-b",
    "metadata": {
      "district": "Exuma"
    },
    "industry": "FNB",
    "category": "PERSONAL",
    "walletLimitId": "652d1e3d-42fa-4944-8e48-1c487e476b7f"
  };
  var signature = sign(requestPayload);

  if(logAll === true){
    console.log(`curl --location --request POST '${config.get('api.agent.endpoint')}accounts/user'
    --header 'Content-Type: application/json'
    --header 'apikeyid: ${config.get('env.onboard.access')}'
    --header 'Authorization: Bearer ${token}'
    --header 'sign: ${signature}'
    --data-raw '${JSON.stringify(requestPayload)}'`);
  }

  console.dir(
    JSON.parse(
      chp.execSync(
        `curl --location --request POST '${config.get('api.agent.endpoint')}accounts/user' --header 'Content-Type: application/json' --header 'apikeyid: ${config.get('env.onboard.access')}' --header 'Authorization: Bearer ${token}' --header 'sign: ${signature}' --data-raw '${JSON.stringify(requestPayload)}'`).toString()
    )
  );
  askQuit();
}

function activateCode(){
  // curl --location --request POST '{{agent_api}}/activation-code/{a valid wallet id} ' --header 'Content-Type: application/json ' --header '{{api-key-id-name}}: {{agent_api_key}} ' --header 'Authorization: {{jwt_token}} ' --header 'sign: {{signature}}'--data-raw '{"walletId": "<uuid of a wallet>"}'
  rl.question('Wallet ID Please ', useOpt => {
    if(useOpt != null){
      var token = taken();
      var requestPayload = {
        "walletId" : useOpt
      };
      var signature = sign(requestPayload);

      if(logAll === true){
        console.log(`curl --location --request POST '${config.get('api.agent.endpoint')}activation-code/${useOpt}'
        --header 'Content-Type: application/json'
        --header 'apikey: ${config.get('env.onboard.access')}'
        --header 'Authorization: Bearer ${token}'
        --header 'sign: ${signature}'
        --data-raw '${JSON.stringify(requestPayload)}'`);
      }

      console.dir(
        JSON.parse(
          chp.execSync(
            `curl --location --request POST '${config.get('api.agent.endpoint')}activation-code/${useOpt}' --header 'Content-Type: application/json' --header 'apikey: ${config.get('env.onboard.access')}' --header 'Authorization: Bearer ${token}' --header 'sign: ${signature}' --data-raw '${JSON.stringify(requestPayload)}'`).toString()
        )
      );
      askQuit();
    } else {
      activateCode();
    }
  })
}

function payment(){
  let authSecretDecrypted = decrypt(config.get('env.payment.authSecretEnc'),
  fs.readFileSync("../../../../private.key").toString()
  ).toString();

  let deviceIdDecrypted = decrypt(config.get('env.payment.deviceIdEnc'),
  fs.readFileSync("../../../../private.key").toString()
  ).toString();

  console.log("Device ID: " + deviceIdDecrypted);

  var token = jwt.sign({iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 30},
  authSecretDecrypted
  );
  token ? console.log("token: " + token): console.log("token not avaialble");
  askQuit();
}

function askQuit(){
  rl.question('Main Menu(1)/ Exit(0) ', useOpt => {
    if(useOpt == "1"){
      main();
    } else {
      process.exit();
    }
  });
}
