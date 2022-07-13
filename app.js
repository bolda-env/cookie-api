const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sessions = require("express-session");
const cors = require('cors')

// Environment Set-up
const port = process.env.PORT || 4000;

// Middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());

const { createAccount, accessAccount } = require('./utils').route;
// @desc    POST /register
app.post('/register', (req, res)=>{
  createAccount(req, res);
})

app.post('/login', (req, res)=>{
  accessAccount(req, res);
})

app.listen(port, () => console.log(`Server running on ${port}`));
