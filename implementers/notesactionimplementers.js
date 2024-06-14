const {isAuth} = require('../middlewares/Authmiddleware');
const Joi = require('joi');
const Note = require('../models/NotesSchema');
const {addMainnotesobjtodb,addSubnotesobjinarrdb,deleteUsernotesobjInarrindb,editUsernotesarrobjdb,getnotesarrfromdb,getlabelsarrfromdb,addlabelnametodb,deleteLabelnameInarrindb,editLabelssarrdb} = require('./dbfunctions/notesdbfunctions');
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

//GET Notesarr Data

const getNotes = async (req,res)=>{
  // const {email} = req.body
  const isNotesgetdata= await getnotesarrfromdb("kiransais03@gmail.com");

  if(isNotesgetdata == ERR) {
   return res.status(400).send({
       status : 400,
       message : "Error occurred while acquiring notes in db.Pls retry"
   }) 
  }
 else { 
   return res.status(200).send({
       status : 200,
       message : "Notes successfully retrieved from db",
       notesarr : isNotesgetdata
     })
  }
}


//GET Labels List Array
const getLabelslist =async (req,res)=>{
  // const {email} = req.body
  const isNotesgetdata= await getlabelsarrfromdb("kiransais03@gmail.com");

  if(isNotesgetdata == ERR) {
   return res.status(400).send({
       status : 400,
       message : "Error occurred while acquiring labels list from db.Pls retry"
   }) 
  }
 else { 
   return res.status(200).send({
       status : 200,
       message : "Labels lits successfully retrieved from db",
       notesarr : isNotesgetdata
     })
  }
}


//POST Add Label name to labellistarr
const addLabelname = async (req,res)=>{

  const {email,labelname} = req.body;
const isLabeladded = await addlabelnametodb(email,labelname);

if(isLabeladded == ERR) {
  return res.status(400).send({
      status : 400,
      message : "Error occurred while saving labels to db.Pls retry"
  })
}
else {
  return res.status(201).send({
      status : 201,
      message : "Label successfully saved to db"
  })
}

}



//DELETE Delete labelname from array
const deleteLabel = async (req,res)=>{
  const {email,labelname} = req.body
  const isLabeldeleted = await deleteLabelnameInarrindb(email,labelname);

  if(isLabeldeleted == ERR) {
   return res.status(400).send({
       status : 400,
       message : "Error occurred while deleting label in db.Pls retry"
   }) 
  }
 else {
   return res.status(200).send({
       status : 200,
       message : "Label successfully deleted from db"
     })
  }
}


//PATCH Edit Label name
const editLabelname = async (req,res)=>{

  const {email,oldlabel,editedlabel} = req.body;

  const isLabeledited = await editLabelssarrdb(email,oldlabel,editedlabel);

 if(isLabeledited == ERR) {
  return res.status(400).send({
      status : 400,
      message : "Error occurred while editing labelname in db.Pls retry"
  }) 
 }
else {
  return res.status(200).send({
      status : 200,
      message : "Label successfully edited in db"
    })
 }
} 


module.exports = {addNewnotes,deleteNotes,editNotes,getNotes,getLabelslist,addLabelname,deleteLabel,editLabelname}