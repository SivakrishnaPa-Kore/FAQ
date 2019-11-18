// clientId: cs-70d11dc2-1dbb-5e6d-8bb3-a9c831e70f07
// clientSecret: 0jBWhUgLhZSvraemHaHttcCfHiMMmGWtaE1CIqFx8wg=

const MongoClientConnction = require('../MongoInstance/MongoClient.js').getInstance();
var jwt = require('jsonwebtoken');
var uuidv5 = require('./uuidv5.js');
var uuidv4 = require('node-uuid').v4;
var crypto = require('crypto');

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'koredbm001';


var schemaDetails = {
  "pns" : {
      "enable" : false,
      "webhookUrl" : ""
  },
  "bots" : [],
  "scope" : [ 
      {
          "scopes" : [ 
              "bot_definition:bot_import", 
              "bot_definition:bot_export", 
              "bot_publish:publish_request", 
              "test_and_train:ml", 
              "test_and_train:faq", 
              "test_and_train:ml_import", 
              "test_and_train:ml_export", 
              "logs:change_logs", 
              "role_management:role_management", 
              "delete:delete_user_data", 
              "chat_history:read", 
              "bot_sessions:read", 
              "user_management:user_management", 
              "custom_dashboards:custom_dashboards"
          ]
      }
  ],
  "state" : 0,
  "name" : "CHECK",
  "alg" : "HS256",
  "isAdminApp" : true,
  "__v" : 0
}
 
async function getDBConnection(url){
    return await MongoClientConnction.getDBConnection()
}

function generateClientSecret() {
    return new Promise(function(resolve, reject) {
        crypto.randomBytes(32, function(err, buffer) {
            if (err) {
                return reject(err);
            }
            resolve(buffer.toString('base64'));
        });
    });
}

function createID(idprefix, namespace) {
    if ((!namespace) || (typeof namespace !== 'string'))
        namespace = uuidv5.NIL_UUID.toString();
        namespace = namespace.replace(/^.-/, '');

    return idprefix + '-' + uuidv5.v5(namespace, uuidv4());
}


var getToken = async (accId) => {
  let client = await getDBConnection(url);
  let db = client.db(dbName);
  try {
     const appDetails = await db.collection("clientsdks").findOne({"accountId" : accId});
     if (appDetails !== null && Object.keys(appDetails).length > 0 &&  appDetails.isAdminApp === true) {
        if(appDetails && appDetails._id && appDetails.cS){
            var token = jwt.sign({appId: appDetails._id}, appDetails.cS);

            return token;
        }
     } else {
        const accDetails = await db.collection("idtoaccounts").findOne({"acctId" : accId});
        if (Object.keys(accDetails).length > 0) {
         schemaDetails.createdOn = new Date();
         schemaDetails.lastModified = new Date();
         schemaDetails.nId = accDetails.koreId;
         schemaDetails.createdBy = accDetails.koreId;
         schemaDetails.lModBy = accDetails.koreId;
         schemaDetails.accountId = accId;
   
        }
        schemaDetails._id = createID('cs',accDetails.nId)
        schemaDetails.cS = await generateClientSecret();
        const insertDocument = await db.collection("clientsdks").insertOne(schemaDetails);
        const appDetails = await db.collection("clientsdks").findOne({"accountId" : accId, "isAdminApp":true});
        if(appDetails && appDetails._id && appDetails.cS){
           var token = jwt.sign({appId: appDetails._id}, appDetails.cS);
           return token;
        }
     }

  }
  catch(err) {
      return err;
  }
}

getToken("5dca79b4ce99df41421c5f8c").then(function(res){
    console.log(res)
})

module.exports = getToken;
// console.log(result);
// var token = jwt.sign({appId:'cs-70d11dc2-1dbb-5e6d-8bb3-a9c831e70f07'}, '0jBWhUgLhZSvraemHaHttcCfHiMMmGWtaE1CIqFx8wg=');
