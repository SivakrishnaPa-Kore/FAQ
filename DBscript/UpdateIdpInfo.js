var db = db.getSiblingDB("koredbm001");

// mongo --eval 'var expireAfterConfig = {"accesstokens":3600,"transitionrecords":3600}' db/version/v101/patches/createTtlIndexes.js
// mongo --eval 'var data = {"method":"adfs_wsfed","accountId":"5dc975a94071f2652853c75f","accountName":"forhacku@gmail.com","providername":"windows","config":{"identityProviderUrl":"https://login.microsoftonline.com/f8250d44-a7af-4d49-85bc-589e0e15d852/saml2/wsfed","identityMetadata":"https://login.microsoftonline.com/f8250d44-a7af-4d49-85bc-589e0e15d852/federationmetadata/2007-06/federationmetadata.xml?appid=c67abe1e-b469-4538-93ea-26f2def1d9ba"},"allusers":false,"idpInfo":{}}' UpdateIdpInfo.js
// "entryPoint" : "https://kore1.onelogin.com/trust/saml2/http-post/sso/959876",
//                     "issuer" : "https://app.onelogin.com/saml/metadata/b2074a43-c83d-4107-bb61-499727df9b3a",
//                     "cert" : "MIIC0DCCAjmgAwIBAgIUT+oB7G5n94mHgdjP0NarHU37d4cwDQYJKoZIhvcNAQEF\nBQAwQzEOMAwGA1UECgwFa29yZTExFTATBgNVBAsMDE9uZUxvZ2luIElkUDEaMBgG\nA1UEAwwRT25lTG9naW4gQWNjb3VudCAwHhcNMTkwNzE1MDQzNzU3WhcNMjQwNzE1\nMDQzNzU3WjBDMQ4wDAYDVQQKDAVrb3JlMTEVMBMGA1UECwwMT25lTG9naW4gSWRQ\nMRowGAYDVQQDDBFPbmVMb2dpbiBBY2NvdW50IDCBnzANBgkqhkiG9w0BAQEFAAOB\njQAwgYkCgYEAtEVXxoUMUSxTFollFJ3ouY5uvrCWJu0RyP3VsBIHW6fc26He23Xz\nrthA5G6YEKt+vexnaNm6b6Cbl6KA+fwNJoCBNhbqqU/lXeo498wvTyP6YwyRV+nC\nzLcbXIewC3VatpnnF8deITxZtYRE9kt8qlga/VHy6JEEhUWJQ2b29i0CAwEAAaOB\nwDCBvTAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBQHaDE7scQ580/2BHuBmRKuQ699\nBzB+BgNVHSMEdzB1gBQHaDE7scQ580/2BHuBmRKuQ699B6FHpEUwQzEOMAwGA1UE\nCgwFa29yZTExFTATBgNVBAsMDE9uZUxvZ2luIElkUDEaMBgGA1UEAwwRT25lTG9n\naW4gQWNjb3VudCCCFE/qAexuZ/eJh4HYz9DWqx1N+3eHMA4GA1UdDwEB/wQEAwIH\ngDANBgkqhkiG9w0BAQUFAAOBgQAZ2Z448NCjSaKAJAt8cDRsICUGpUXGXQ2gFxhW\n739n/3zStG/hI9VIR/1EyqKcOEwHXulh85IHZY3cRSTZdsYd7GssZ0R8R9hvmtjc\nFHxj2wc6N6Las1/JStOQAHevHGnlz3mch91ri6PaIMc+75bw30i0TKEsEbQKvXP5\njQ3yIg=="
// {"_id":"o-caa3001a-519b-5ac1-a8c0-7577904e3a3b"}

// data = {"method":"adfs_wsfed","accountId":""5dc975a94071f2652853c75f"","accountName":"forhacku@gmail.com","providername":"windows","config":{"identityProviderUrl":"https://login.microsoftonline.com/f8250d44-a7af-4d49-85bc-589e0e15d852/saml2/wsfed","identityMetadata":"https://login.microsoftonline.com/f8250d44-a7af-4d49-85bc-589e0e15d852/federationmetadata/2007-06/federationmetadata.xml?appid=c67abe1e-b469-4538-93ea-26f2def1d9ba"},"allusers":false,"idpInfo":{}}
tempIdpinfo = {}
var updateAccountWithKora = function(data) {
    var doc = db.accounts.findOne({"orgId":"o-caa3001a-519b-5ac1-a8c0-7577904e3a3b"})
    var botDomainInfo = doc && doc.botDomainInfo && doc.botDomainInfo[0];
    if (!botDomainInfo) {
        botDomainInfo = {};
        botDomainInfo.dName = data.accountName;
        doc.botDomainInfo[0] = botDomainInfo;
    }
    botDomainInfo = botDomainInfo.toJSON && botDomainInfo.toJSON() || botDomainInfo;
    var idpInfo = botDomainInfo.idpInfo || {};

    //for openidconnect, set idpInfo.name as providername
    if(data.method === "openidconnect")
    tempIdpinfo.name = data.providername;
    else
        //otherwise combination of domainName and method is used
        tempIdpinfo.name = botDomainInfo.dName + '_' + data.method;

        tempIdpinfo.ssoProvider = data.providername;
    Object.keys(tempIdpinfo).forEach(function(key) {
        idpInfo[key] = tempIdpinfo[key];
    });
    idpInfo.config =idpInfo.config || {};
    Object.keys(data.config).forEach(function(key){
        idpInfo.config[key] = data.config[key]
    })
    var idpInfoUpdateObj = {
        method: idpInfo.method,
        name: idpInfo.name,
        allusers: idpInfo.allusers,
        ssoProvider : idpInfo.ssoProvider,

        //include modifieddate and modifiedby info
        modifiedDate: new Date(),
        modifiedBy: idpInfo.modifiedBy
    };

    if(idpInfo.method==="adfs_wsfed" || idpInfo.method === "saml")
        idpInfoUpdateObj.config = idpInfo.config;

    //set the idpInfo object in the document
    doc.botDomainInfo[0].idpInfo = idpInfoUpdateObj;
    doc.botDomainInfo[0].dName = data.accountName;

    //set the ssoEnabled flag as true
    doc.ssoEnabled = true;
    res = db.accounts.update({"orgId":"o-caa3001a-519b-5ac1-a8c0-7577904e3a3b"}, doc, {upsert:true})
    print(res)
}

updateAccountWithKora(data)