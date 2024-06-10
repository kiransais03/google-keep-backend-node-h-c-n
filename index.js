const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const useractions = require('./routes/useractions');
const {editUsernotesarrobj} = require('./implementers/dbfunctions/notesdbfunctions')

const app = express();
app.use(express.json());
app.use(cors({origin:'*'}));

let PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI)
.then((res)=>{console.log("MongoDB Connected")})
.catch((err)=>{console.log(err)});


app.get('/',async (req,res)=>{
    // await deleteNotesindb();
    // await addMainnotesobjtodb("kir779@gmail.com")
    // await addSubnotesobjinarr("kir9@gmail.com",{
    //     "id": 0,
    //     "title": "Notes 1",
    //     "text": "This is sample notes 1",
    //     "pinselected": true,
    //     "archived": false,
    //     "trashed": false,
    //     "notebgcolour": "#000000",
    //     "labels": [
    //       "work",
    //       "home"
    //     ]
    //   })
    //  await editUsernotesarrobj("kir9@gmail.com",0,"text","This is edited sample notes")
    res.send("This is the backend of google keep using node and html,css,js in frontend")
})

app.use('/user',useractions);


app.listen(PORT,()=>{
    console.log("Server is running in PORT",PORT);
})