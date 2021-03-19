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
var crypto_1 = __importDefault(require("crypto"));
var child_process_1 = __importDefault(require("child_process"));
var config_1 = __importDefault(require("config"));
var readline = __importStar(require("readline"));
var fs = __importStar(require("fs"));
// let getDate = Math.floor(Date.now() / 1000);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var option;
var logAll = false;
main();
function main() {
    rl.question('Log CURL ?: [Y/N] ', function (useOpt) {
        if (useOpt == "Y" || useOpt == "y") {
            logAll = true;
        }
        else {
            if (useOpt != "N") {
                logAll = false;
                console.log("Log Disabled");
            }
        }
        rl.question('WLM-1/ WLM-2/ ACC-2/ payment Token/ ob Token/ activationCode [1/2/3/4/5/6]: ', function (useOpt) {
            option = Number.parseInt(useOpt);
            if (option != null) {
                if (option == 1) {
                    ob_wallet_limits();
                }
                if (option == 2) {
                    ob_updateWallet();
                }
                if (option == 3) {
                    ob_CardlessAccount();
                }
                if (option == 4) {
                    payment();
                }
                if (option == 5) {
                    console.log(taken());
                    askQuit();
                }
                if (option == 6) {
                    activateCode();
                }
            }
        });
    });
}
function taken() {
    return jsonwebtoken_1.default.sign({ iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 30 }, "" + config_1.default.get('env.onboard.secret'));
}
function sign(requestPayload) {
    var signer = crypto_1.default.createSign('SHA256');
    signer.update(JSON.stringify(requestPayload));
    signer.end();
    return signer.sign(fs.readFileSync("../../../../private.key").toString(), 'base64');
}
function decrypt(message, privateKey) {
    var buffer = Buffer.from(message, 'base64');
    var decrypted = crypto_1.default.privateDecrypt({
        key: privateKey,
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
    }, buffer);
    return decrypted.toString('utf8');
}
function ob_updateWallet() {
    var token = taken();
    rl.question('Wallet Limit ID Please ', function (useOpt) {
        if (useOpt != null && useOpt != "") {
            // let requestPayload = {"walletLimitId": '"' + useOpt + '"'};
            if (logAll === true) {
                console.log("curl --location --request PUT '" + config_1.default.get('api.agent.endpoint') + "wallet-limits/3e95d6a3-59b4-49ad-9403-3cf7908e6b8a'\n        --header 'apikey: " + config_1.default.get('env.onboard.access') + "'\n        --header 'Authorization: Bearer " + token + "'\n        --header 'Content-Type: application/json'\n        --data-raw '{\"walletLimitId\": \"" + useOpt + "\"}'");
            }
            console.dir(JSON.parse(child_process_1.default.execSync("curl --location --request PUT '" + config_1.default.get('api.agent.endpoint') + "wallet-limits/3e95d6a3-59b4-49ad-9403-3cf7908e6b8a' --header 'apikey: " + config_1.default.get('env.onboard.access') + "' --header 'Authorization: Bearer " + token + "' --header 'Content-Type: application/json' --data-raw '{\"walletLimitId\": \"" + useOpt + "\"}'").toString()));
            askQuit();
        }
        else {
            ob_updateWallet();
        }
    });
}
;
function ob_wallet_limits() {
    var token = taken();
    if (logAll === true) {
        console.log("curl --location --request GET '" + config_1.default.get('api.agent.endpoint') + "wallet-limits/' --header 'apikey: " + config_1.default.get('env.onboard.access') + "' --header 'Authorization: Bearer " + token + "'");
    }
    console.dir(JSON.parse(child_process_1.default.execSync("curl --location --request GET '" + config_1.default.get('api.agent.endpoint') + "wallet-limits/' --header 'apikey: " + config_1.default.get('env.onboard.access') + "' --header 'Authorization: Bearer " + token + "'").toString()));
    askQuit();
}
function ob_CardlessAccount() {
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
    if (logAll === true) {
        console.log("curl --location --request POST '" + config_1.default.get('api.agent.endpoint') + "accounts/user'\n    --header 'Content-Type: application/json'\n    --header 'apikeyid: " + config_1.default.get('env.onboard.access') + "'\n    --header 'Authorization: Bearer " + token + "'\n    --header 'sign: " + signature + "'\n    --data-raw '" + JSON.stringify(requestPayload) + "'");
    }
    console.dir(JSON.parse(child_process_1.default.execSync("curl --location --request POST '" + config_1.default.get('api.agent.endpoint') + "accounts/user' --header 'Content-Type: application/json' --header 'apikeyid: " + config_1.default.get('env.onboard.access') + "' --header 'Authorization: Bearer " + token + "' --header 'sign: " + signature + "' --data-raw '" + JSON.stringify(requestPayload) + "'").toString()));
    askQuit();
}
function activateCode() {
    // curl --location --request POST '{{agent_api}}/activation-code/{a valid wallet id} ' --header 'Content-Type: application/json ' --header '{{api-key-id-name}}: {{agent_api_key}} ' --header 'Authorization: {{jwt_token}} ' --header 'sign: {{signature}}'--data-raw '{"walletId": "<uuid of a wallet>"}'
    rl.question('Wallet ID Please ', function (useOpt) {
        if (useOpt != null) {
            var token = taken();
            var requestPayload = {
                "walletId": useOpt
            };
            var signature = sign(requestPayload);
            if (logAll === true) {
                console.log("curl --location --request POST '" + config_1.default.get('api.agent.endpoint') + "activation-code/" + useOpt + "'\n        --header 'Content-Type: application/json'\n        --header 'apikey: " + config_1.default.get('env.onboard.access') + "'\n        --header 'Authorization: Bearer " + token + "'\n        --header 'sign: " + signature + "'\n        --data-raw '" + JSON.stringify(requestPayload) + "'");
            }
            console.dir(JSON.parse(child_process_1.default.execSync("curl --location --request POST '" + config_1.default.get('api.agent.endpoint') + "activation-code/" + useOpt + "' --header 'Content-Type: application/json' --header 'apikey: " + config_1.default.get('env.onboard.access') + "' --header 'Authorization: Bearer " + token + "' --header 'sign: " + signature + "' --data-raw '" + JSON.stringify(requestPayload) + "'").toString()));
            askQuit();
        }
        else {
            activateCode();
        }
    });
}
function payment() {
    var authSecretDecrypted = decrypt(config_1.default.get('env.payment.authSecretEnc'), fs.readFileSync("../../../../private.key").toString()).toString();
    var deviceIdDecrypted = decrypt(config_1.default.get('env.payment.deviceIdEnc'), fs.readFileSync("../../../../private.key").toString()).toString();
    console.log("Device ID: " + deviceIdDecrypted);
    var token = jsonwebtoken_1.default.sign({ iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 30 }, authSecretDecrypted);
    token ? console.log("token: " + token) : console.log("token not avaialble");
    askQuit();
}
function askQuit() {
    rl.question('Main Menu(1)/ Exit(0) ', function (useOpt) {
        if (useOpt == "1") {
            main();
        }
        else {
            process.exit();
        }
    });
}
