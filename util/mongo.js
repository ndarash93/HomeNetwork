const MongoClient = require('mongodb').MongoClient;

const { MONGOPROTO, MONGOUSER, MONGOPWD, MONGOURL, MONGOPORT, MONGODB } = process.env
const client = new MongoClient(`${MONGOPROTO}://${MONGOUSER}:${MONGOPWD}@${MONGOURL}:${MONGOPORT}/${MONGODB}`);
let db;
console.log(`${MONGOPROTO}://${MONGOUSER}:${MONGOPWD}@${MONGOURL}:${MONGOPORT}/${MONGODB}`);

async function mongoConnectioMiddleware(req, res, next){
  try{
    if (!db){// || !db.serverConfig.isConnected){
      db = await client.db()
      console.log('Connected to DB');
    }
    req.db = db;
    next();
  } 
  catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

process.on('SIGINT', async () => {
  try {
    if (db) {
      await db.client.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});


module.exports = { mongoConnectioMiddleware };
