const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env'), override: true})

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./routes')

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use('/api', router)

app.listen(process.env.PORT); // start Node + Express server on port 5000
console.log("listening on " + process.env.PORT)
