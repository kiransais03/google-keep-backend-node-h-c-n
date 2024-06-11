const {isAuth} = require('../middlewares/Authmiddleware');
const Joi = require('joi');
const Note = require('../models/NotesSchema');
const {addMainnotesobjtodb,addSubnotesobjinarrdb,deleteUsernotesobjInarrindb,editUsernotesarrobjdb} = require('./dbfunctions/notesdbfunctions');
const {TRUE,FALSE,ERR} = require('../constants');

//POST Add Notes
const addNewnotes = async (req,res)=>{

    const isValid = Joi.object({
        id : Joi.number().required(),
        title : Joi.string().required(),
        text : Joi.string().required(),
        pinselected : Joi.boolean().required(),
        archived : Joi.boolean().required(),
        trashed : Joi.boolean().required(),
        notebgcolour : Joi.string(),
        labels :Joi.array().required()
    }).validate(req.body.noteobj)

    if(isValid.error) {
      return res.status(400).send({
        status : 400,
        message : "Invalid notes data format",
        data : isValid.error
      })
    }

    const {email,noteobj} = req.body;
    // console.log("Email",email,"Noteobj",noteobj)
  const isNotesadded = await addSubnotesobjinarrdb(email,noteobj);

  if(isNotesadded == ERR) {
    return res.status(400).send({
        status : 400,
        message : "Error occurred while saving notes to db.Pls retry"
    })
  }
  else {
    return res.status(201).send({
        status : 201,
        message : "Notes successfully saved to db"
    })
  }

}


//DELETE Deletenotes from array
const deleteNotes = async (req,res)=>{
   const {email,deletingobjid} = req.body
   const isNotesdeleted = await deleteUsernotesobjInarrindb(email,deletingobjid);

   if(isNotesdeleted == ERR) {
    return res.status(400).send({
        status : 400,
        message : "Error occurred while deleting notes in db.Pls retry"
    }) 
   }
  else {
    return res.status(200).send({
        status : 200,
        message : "Notes successfully deleted from db"
      })
   }
}


//PATCH Edit notesobj
const editNotes = async (req,res)=>{

    const {email,id,editingkey,editingvalue} = req.body;

    const isNotesedited = await editUsernotesarrobjdb(email,id,editingkey,editingvalue);

   if(isNotesedited == ERR) {
    return res.status(400).send({
        status : 400,
        message : "Error occurred while editing notes in db.Pls retry"
    }) 
   }
  else {
    return res.status(200).send({
        status : 200,
        message : "Notes successfully edited in db"
      })
   }
} 


module.exports = {addNewnotes,deleteNotes,editNotes}