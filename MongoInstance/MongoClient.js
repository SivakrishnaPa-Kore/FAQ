const MongoClient = require('mongodb').MongoClient; 
require('dotenv').config();
let instance;

function MongoClientConnection() {

}

MongoClientConnection.prototype.getDBConnection = async function(){
    let url = "mongodb://localhost:27017";
    return await MongoClient.connect(url,{ useUnifiedTopology: true });
}

module.exports = {
    getInstance: function(){
        if(!instance) {
            instance = new MongoClientConnection();
        }
        return instance;
    }
}