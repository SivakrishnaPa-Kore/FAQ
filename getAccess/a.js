// 5d0ca44040ded60fb0854e1b
// Retrieve
// var kmsUtils = require('../../kore/KoreServer/bootmodules/KeyServer/lib/utils/kms');
// var db = db.getSiblingDB("koredbm001");
// cursor = db.accesstokens.findOne({"acctId" : "5d0ca44040ded60fb0854e1b"});
// printjson(cursor._id)

// kmsUtils.decryptKey("5d0ca44040ded60fb0854e1b").tap(function(data){
//   console.log("data",data);
// })

// return kmsUtils.generateDataKey(cmk)
//     .tap(console.log)
//     .tap(function(data) {
//         console.log(data.KeyId == cmk)
//     }) ;
// while ( cursor.hasNext() ) {
//    printjson( cursor.next() );
// }


const mongoose = require('mongoose');
// var schema = new mongoose.Schema({});
var accessTokenSchema = new mongoose.Schema({}, { collection : 'accesstokens' });
// configDB = {};
// configDB.url = "mongodb://localhost:27017/koredbm001"
// // mongoose.connect(configDB.url, {
// //   useMongoClient: true,
// //   /* other options */
// // });
async function run() {
  mongoose.connect('mongodb://localhost:27017/koredbm001',{useNewUrlParser: true}).
  catch(error => handleError(error));

  // await mongoose.connection.dropDatabase();
  var MyModel = mongoose.model('accesstokens', accessTokenSchema);
  res = MyModel.find({"acctId" : "5d0ca44040ded60fb0854e1b"});
  console.log(await res.exec())
}

run().catch(error => console.error(error.stack));