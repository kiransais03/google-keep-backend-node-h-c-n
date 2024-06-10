const {TRUE,FALSE,ERR} = require('../../constants');
const Notes = require('../../models/NotesSchema');

const addMainnotesobjtodb = async (email)=>{
    try {
        let mainnotesobj = new Notes({
            "email":email,
            "usernotes" : []
         })

        await mainnotesobj.save();
        return TRUE;
    }
    catch(err) {
        console.log("Error in adding main notes",err)
        return ERR;
    }
}

const addSubnotesobjinarrdb = async (email,subnotesobj)=>{
    try {
        const addSubnotesresponse = await Notes.updateOne({"email": email},{$push:{"usernotes":subnotesobj}});
        console.log("Notes added to db",addSubnotesresponse)
    }
    catch (error) {
        console.log("Error in adding sub notes to db",error);
        return ERR;
    }
}

const deleteUsernotesobjInarrindb = async (email,deltingobjid)=>{
    try {
        const response =await Notes.updateOne({"email" : email},{$pull :{"usernotes":{"id":deltingobjid}}});
        console.log("Object from the array delted",response)
        return TRUE;
    }
    catch (err) {
        console.log("Error in deletion of obj from usernotes",err);
        return ERR;
    }
}


const editUsernotesarrobjdb = async (email,index,editingkey,editingvalue)=>{
    try {
        const editSubnotesresponse = await Notes.updateOne({"email": email},{$set:{[`usernotes.${index}.${editingkey}`]:editingvalue}});
        console.log("Notes edited in db",editSubnotesresponse)
    }
    catch (error) {
        console.log("Error in editing sub notes in db",error);
        return ERR;
    }
}


module.exports = {addMainnotesobjtodb,deleteUsernotesobjInarrindb,editUsernotesarrobjdb,addSubnotesobjinarrdb}