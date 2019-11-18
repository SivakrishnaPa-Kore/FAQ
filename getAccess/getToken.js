var config = require('../config');
var bootstrap = require('../bootmodules/bootstrap');
bootstrap.init(config);
var _ = require('lodash');

var authorizationModel = require('../../kore/KoreServer/models/AuthorizationModel').getInst();
var res = authorizationModel.getUserAcessTokensByAccId("53bd279fc71813d35ba2b434");
console.log("============>",res)
