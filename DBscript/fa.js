var model = this.getModel();
var accountId = params.accountId;
var ssoEnabled = params.ssoEnabled;

model.update({
    "_id": accountId
}, {
    $set: {
        "ssoEnabled": ssoEnabled
    }
}, function(err, result) {
    if(!result){
        return callback(null);
    }
    else
        callback(null, result);
});



AccountModel.prototype.updateIdpInfo = function(params, callback) {
    var model = this.getModel();
    model.findOne({
        "_id": params.accountId
    }, function(err, doc) {
        if (err || !doc) {
            return callback(null);
        }
        var botDomainInfo = doc && doc.botDomainInfo && doc.botDomainInfo[0];
        if (!botDomainInfo) {
            //return callback(null);
            botDomainInfo = {};
            botDomainInfo.dName = params.accountName;
            doc.botDomainInfo[0] = botDomainInfo;
        }
        botDomainInfo = botDomainInfo.toJSON && botDomainInfo.toJSON() || botDomainInfo;
        var idpInfo = botDomainInfo.idpInfo || {};

        //for openidconnect, set idpInfo.name as providername
        if(params.idpInfo.method === "openidconnect")
            params.idpInfo.name = params.idpInfo.providername;
        else
            //otherwise combination of domainName and method is used
            params.idpInfo.name = botDomainInfo.dName + '_' + params.idpInfo.method;

        params.idpInfo.ssoProvider = params.idpInfo.providername;

        _.merge(idpInfo, params.idpInfo);

        //create a fresh idpInfo object containing only desired elements
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
        doc.botDomainInfo[0].dName = params.accountName;

        //set the ssoEnabled flag as true
        doc.ssoEnabled = true;
        model.update({"_id": params.accountId}, doc, function(err) {
            if (err) {
                callback(null);
                return;
            }
            callback(null,idpInfo);
        });
    });
};