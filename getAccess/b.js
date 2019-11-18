const MongoClient = require('mongodb').MongoClient; 
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'practicedb';
 
async function getDBConnection(url){
  return await MongoClient.connect(url,{ useUnifiedTopology: true });
}


(async () => {
  let client = await getDBConnection(url);
  let db = client.db(dbName);
  try {
     const qq = await db.collection("movie").insertOne({"name":"KING"});
     console.log(qq);
    //  const res = await db.collection("movie").find({}).toArray();
    //  console.log(`res => ${JSON.stringify(res)}`);
  }
  finally {
      client.close();
  }
})()
  .catch(err => console.error(err));

// Use connect method to connect to the server
// MongoClient.connect(url,{ useUnifiedTopology: true },function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
 
//   const db = client.db(dbName);
//   const collection = db.collection('movie');
//   collection.find({}).toArray(function(err, docs) {
//     assert.equal(err, null);
//     console.log(docs)
//     // callback(docs);
//   });
//   client.close();
// });


// const db = await MONGO.connect(url);
// const MyCollection = db.collection('MyCollection');
// const result = await MyCollection.find(query).toArray();