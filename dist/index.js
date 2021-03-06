"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import chp from 'child_process';
// import config from 'config';
var readline = __importStar(require("readline"));
var getDate = Math.floor(Date.now() / 1000);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var apiKeyVal;
var secretKeyVal;
rl.question('Access Key: ', function (apiKey) {
    if (apiKey != "" && !(apiKey == null && apiKey == undefined)) {
        apiKeyVal = apiKey;
        rl.question('Secret Key: ', function (secretKey) {
            if (secretKey != "" && !(secretKey == null && secretKey == undefined)) {
                secretKeyVal = secretKey;
                rl.close();
                dumpTruck();
            }
        });
    }
});
function dumpTruck() {
    var token = jsonwebtoken_1.default.sign({ iat: getDate, exp: getDate + 30 }, secretKeyVal);
    token ? console.log(token) : console.log("token not avaialble");
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
