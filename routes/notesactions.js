const express = require('express');
const {addNewnotes,deleteNotes,editNotes} = require('../implementers/notesactionimplementers');
const app = express();
const {isAuth} = require('../middlewares/Authmiddleware')

app.post('/addnewnotes',isAuth,addNewnotes);

app.delete('/deletenotes',isAuth,deleteNotes);

app.patch('/editnotes',isAuth,editNotes);

module.exports = app;