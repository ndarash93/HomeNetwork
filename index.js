require('dotenv').config();
const bcrypt = require('bcrypt');
const { mongoConnectioMiddleware } = require('./util/mongo');
const { validateUsername, validatePassword } = require('./util/validate');
const { verifyToken, signToken } = require('./util/jwt');
const express = require('express');
const app = express();
//const MongoClient = require('mongodb').MongoClient;

const { MONGOPROTO, MONGOUSER, MONGOPWD, MONGOURL, MONGOPORT, MONGODB  } = process.env
//const client = new MongoClient(`${MONGOPROTO}://${MONGOUSER}:${MONGOPWD}@${MONGOURL}:${MONGOPORT}/${MONGODB}`);
//let db = client.db()
console.log(`${MONGOPROTO}://${MONGOUSER}:${MONGOPWD}@${MONGOURL}:${MONGOPORT}/${MONGODB}`);

app.set('view-engine', 'ejs');


app.use(express.static('public'));
app.use(express.json());
app.use(mongoConnectioMiddleware);

app.get('/', (req, res) => {
  console.log(`Request:  ${req.method} from ${req.ip}`);
  res.render('index.ejs');
});

app.get('remote', verifyToken, (req, res) => {
  res.send('Success');
});

app.get('/test', verifyToken, (req, res) => {
  res.json({message: 'success'});
})

app.post('/login', async (req, res) => {
  try{
    const { username, password } = req.body;
    console.log({username: username, passworrd: password});
    if(!validateUsername(username)){
      res.status(401).json({ message: 'Username Invalid!' });
      return;
    }
    /*
    if(!validatePassword(password)){
      res.status(401).json({ message: 'Password Invalid!' });
      return;
    }
    */

    const users = req.db.collection('users');
    const user = await users.findOne({username});

    if (!user) {
      res.status(401).json({ message: 'Invalid Username or password' });
      return;
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match){
      res.status(401).json({ message:  'Invalid username or Password' });
      return
    }
    
    res.json({ message: 'Login successful', token: signToken(user) });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})


app.post('/register', async function(req, res){
  try{
    const { username, password } = req.body;
    const role = 'user';
    if(!validateUsername(username)){
      res.status(401).json({ message: 'Username Invalid!' });
      return;
    }
    if(!validatePassword(password)){
      res.status(401).json({ message: 'Password Invalid!' });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const users = req.db.collection('users');
    const insertResult = await users.insertOne({ username: username, password: hash, role: role});
    res.json({message: `Inserted ${insertResult.insertedCount} documents`});
  }catch(error){
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.listen(process.env.PORT, function(){
  console.log(`Listening on: ${process.env.PORT}`);
})
