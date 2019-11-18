const request = require('request-promise');
const jwtToken = require('../getAccessToken/getAccessToken.js');
const MongoClientConnction = require('../MongoInstance/MongoClient.js').getInstance();
const url = 'mongodb://localhost:27017';
const dbName = 'koredbt001';

let payload = {
    accId: "5dca79b4ce99df41421c5f8c",
    userId : "u-cc1977d6-ca31-5c91-b2fc-a5da212dde58",
    emails: ["leotolstoy@gmail.com"],
    fname: "LeoTolstoy",
    botId: "st-88fd16e7-0a33-5d8d-97eb-3d1adc7debf1"
}
// const token = jwtToken(payload.accId);

async function getDBConnection(url){
    return await MongoClientConnction.getDBConnection()
}


async function getJWTtoken(accId){
    try{
        const token = await jwtToken(accId);
        return token;
    } catch(err){
        throw(err);
    }
}

async function createUser(payload, roleId, token){
    let headers = {
        auth: token
    }
    let requestConfig = {
        url: "http://localhost/api/public/users",
        method: "POST",
        headers: headers,
        body: {
            "users": [
                {
                    "userInfo": {
                        "emailId": payload.email,
                        "firstName": payload.fname
                    },
                    "groups": [
                    ],
                    "roles": [
                        {
                            "roleId": roleId,
                            "botId": payload.botId
                        }       
                    ],
                    "canCreateBot": true,
                    "isDeveloper": true
                }
            ],
            "sendEmail": false
        },
        json:true
    };                    
    return request(requestConfig)
    .then(function (body) {
        return body;
    })
    .catch(function (err) {
        return err;;
    });
}

async function userAccess(payload, token){
    let headers = {
        auth: token
    };
    let requestConfig = {
        url: "http://localhost/api/public/useraccess",
        method: "POST",
        headers: headers, 
        body: {
            "emailIds": payload.emails,
            "canCreateBot": true,
            "isDeveloper": true
        },
       json: true
    };
    return request(requestConfig)
    .then(function (body) {
        return body;
    })
    .catch(function (err) {
        console.log(err)
        return err;;
    });
}

async function assignDevRoleToUser(payload) {
    let client = await getDBConnection(url);
    let db = client.db(dbName);
    let userId = payload.userId;
    let token = await getJWTtoken(payload.accId);
    try{
        const userDetails = await db.collection("users").findOne({"_id" : userId});
        const orgId = userDetails.accountInfo.orgID;
        
        if(orgId && payload.botId){
            const roleDetails = await db.collection("rolesmappings").findOne({"orgId":orgId,"botId":payload.botId});
            const roleId = roleDetails.roleId;
            console.log("TCL: changeRolesofUser -> roleId", roleId)
            createUser = await createUser(payload, roleId, token);
            assignRole = await userAccess(payload, token);
            console.log("TCL: changeRolesofUser -> assignRole", assignRole)
        }

    } catch(err){

    }
    // const accDetails = await db.collection("rolesmappings").findOne({"acctId" : accId});
    // db.getCollection('users').find({"_id":"u-cc1977d6-ca31-5c91-b2fc-a5da212dde58"})
}




assignDevRoleToUser(payload).then(async function(res){
    console.log(res);
}).catch(function(err){
    console.log(err);
})