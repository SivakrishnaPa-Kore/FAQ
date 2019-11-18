var jwt = require('jsonwebtoken');
var token = jwt.sign({appId: "cs-ae3ee900-6834-5662-88d9-fdfdb3219fea"}, "s/OUXVpnJz2w2NlB6Hr6k7GRZ58jVv/EiIj7Ihf9rak=");
console.log(token);