var crypto = require('crypto');
var uuidv5 = require('./uuidv5.js');
var uuidv4 = require('node-uuid').v4;

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

console.log(createID('cs','u-cc1977d6-ca31-5c91-b2fc-a5da212dde58'));

  
  generateClientSecret().then(function(res){
      console.log("secret",res);
  })