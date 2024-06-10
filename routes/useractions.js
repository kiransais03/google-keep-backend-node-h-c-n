const express = require('express');
const {registerUser,loginUser} = require('../implementers/useractionimplementers')

const app = express();

app.post('/register',registerUser);

app.post('/loginuser',loginUser);

module.exports = app
