const express = require('express');
const {addNewnotes,deleteNotes,editNotes,editandreplaceNotes,getNotes,getLabelslist,addLabelname,deleteLabel,editLabelname} = require('../implementers/notesactionimplementers');
const app = express();
const {isAuth} = require('../middlewares/Authmiddleware')

//notes
app.post('/addnewnotes',isAuth,addNewnotes);

app.delete('/deletenotes',isAuth,deleteNotes);

app.patch('/editnotes',isAuth,editNotes);

app.put('/editandreplacenotes',isAuth,editandreplaceNotes)

app.get('/getnotes',isAuth,getNotes);


//labels
app.post('/addlabel',isAuth,addLabelname);

app.delete('/deletelabel',isAuth,deleteLabel);

app.patch('/editlabel',isAuth,editLabelname);

app.get('/getlabelslist',isAuth,getLabelslist);


module.exports = app;