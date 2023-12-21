require('dotenv').config();
const express = require('express');
const app = express();


app.set('view-engine', 'ejs');


app.use(express.static('public'));
app.use(express.json());


app.get('/', (req, res) => {
  console.log(`Request:  ${req.method} from ${req.ip}`);
  res.render('remote.ejs', { server });
});


