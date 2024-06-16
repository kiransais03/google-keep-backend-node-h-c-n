const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const useractions = require('./routes/useractions');
const notesactions = require('./routes/notesactions');
const {editUsernotesarrobj} = require('./implementers/dbfunctions/notesdbfunctions')

const app = express();
app.use(express.json());
app.use(cors({origin:'*'}));

let PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI)
.then((res)=>{console.log("MongoDB Connected")})
.catch((err)=>{console.log(err)});


app.get('/',async (req,res)=>{
    res.send("This is the backend of google keep using node and html,css,js in frontend")
})

app.use('/user',useractions);

app.use('/notes',notesactions);


app.listen(PORT,()=>{
    console.log("Server is running in PORT",PORT);
})