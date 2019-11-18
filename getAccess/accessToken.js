var request = require('request-promise');

var headers = {
    'Requester-Type': 'admin',
    'Content-Type': 'application/json;charset=UTF-8',
};

var dataString = '{"password":"Kore@123","client_id":"1","client_secret":"1","scope":"friends","grant_type":"password","username":"gsk@gmail.com","isadmin":true}';

var options = {
    url: 'http://localhost/api/1.1/oAuth/token?rnd=zgq32q',
    method: 'POST',
    headers: headers,
    body: dataString,
};

request(options).then(function(data){
    console.log(data);
}).catch(function(err){
    console.log("Error",err);
})


// clientId: cs-70d11dc2-1dbb-5e6d-8bb3-a9c831e70f07
// clientSecret: 0jBWhUgLhZSvraemHaHttcCfHiMMmGWtaE1CIqFx8wg=

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImNzLTcwZDExZGMyLTFkYmItNWU2ZC04YmIzLWE5YzgzMWU3MGYwNyJ9.who9mOhV4tQbmM8kpgPlKLZPomhHoQsSzLtAS1nZPMw