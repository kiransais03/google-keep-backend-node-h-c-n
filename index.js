const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({origin:'*'}));

let PORT = process.env.PORT;

console.log(PORT,"This is port");


app.get('/',(req,res)=>{
    res.send("This is the backend of google keep using node and html,css,js in frontend")
})

app.listen(PORT,()=>{
    console.log("Server is running in PORT",PORT);
})