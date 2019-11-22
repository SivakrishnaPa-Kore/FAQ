var db = db.getSiblingDB("koredbm001");

var updateAccountWithKora = function(data) {
    var res = db.accounts.update({"orgId":orgId,"botDomainInfo.isPrimary" : true},
        {"ssoEnabled": true ,
        "botDomainInfo.$.idpInfo": data
        },
        {upsert:true}
    
)
    printjson(res)
}

updateAccountWithKora(data)