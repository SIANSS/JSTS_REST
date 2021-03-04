import jwt from 'jsonwebtoken';
import chp from 'child_process';
import config from 'config';

let getDate = Math.floor(Date.now() / 1000);

jwt.sign({
  iat: getDate,
  exp: getDate + 30,
},
config.get('apiKey.secret'),
(err : Error | null, token : string | undefined) => {
  console.log(`curl --location --request GET '${config.get('api.agent.endpoint')}wallet-limits'
  --header 'apikey: ${config.get('apiKey.keyId')}'
  --header 'Authorization: Bearer ${token}'`);
  console.dir(
    JSON.parse(
      chp.execSync(
        `curl --location --request GET '${config.get('api.agent.endpoint')}wallet-limits' --header 'apikey: ${config.get('apiKey.keyId')}' --header 'Authorization: Bearer ${token}'`).toString()
      )
    );
});
