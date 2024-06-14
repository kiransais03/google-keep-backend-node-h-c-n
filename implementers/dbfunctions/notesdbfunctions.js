const {TRUE,FALSE,ERR} = require('../../constants');
const Notes = require('../../models/NotesSchema');

const addMainnotesobjtodb = async (email)=>{
    try {
        let mainnotesobj = new Notes({
            "email":email,
            "labelslist":[],
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
        // console.log("Recheck print",email,subnotesobj)
        const addSubnotesresponse = await Notes.updateOne({"email": email},{$push:{"usernotes":subnotesobj}});
        console.log("Notes added to db",addSubnotesresponse)
    }
    catch (error) {
        console.log("Error in adding sub notes to db",error);
        return ERR;
    }
}

const editandreplaceSubnotesobjinarrdb = async (email,subnotesobj)=>{
    try {
        const editreplaceSubnotesresponse = await Notes.updateOne({"email": email,"usernotes.id":subnotesobj.id},{$set:{"usernotes.$":subnotesobj}});
        console.log("Notes replaced to db",editreplaceSubnotesresponse)
    }
    catch (error) {
        console.log("Error in replacing sub notes to db",error);
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


const editUsernotesarrobjdb = async (email,id,editingkey,editingvalue)=>{
    try {
        //Here we are using arrayFilters to specifically target the element object using "id" because we 
        //dont know the index of that obj.Here "elem" is a variable name to represent the arrayFilters condition
        const editSubnotesresponse = await Notes.updateOne({"email": email},
            {
                $set:{[`usernotes.$[elem].${editingkey}`]:editingvalue}
            },
            {
                arrayFilters: [{ "elem.id": id }]
            });
            
        console.log("Notes edited in db",editSubnotesresponse)
    }
    catch (error) {
        console.log("Error in editing sub notes in db",error);
        return ERR;
    }
}

const getnotesarrfromdb = async (email)=>{
    try {
        const getnotesarrresponse = await Notes.find({"email": email},{"usernotes":1});
        console.log("Notesarr from db",getnotesarrresponse);
        return getnotesarrresponse
    }
    catch (error) {
        console.log("Error in getting sub notes from db",error);
        return ERR;
    }
}

const getlabelsarrfromdb = async (email)=>{
    try {
        const getlabelsarrresponse = await Notes.find({"email": email},{"labelslist":1});
        console.log("Labelslistsarr from db",getlabelsarrresponse);
        return getlabelsarrresponse
    }
    catch (error) {
        console.log("Error in getting Labels list from db",error);
        return ERR;
    }
}

const addlabelnametodb = async (email,labelname)=>{
    try{
        const addlabelsaresponse = await Notes.updateOne({"email": email},{$push:{"labelslist":labelname}});
        console.log("Label added to db",addlabelsaresponse)
    }
    catch(err) {
        console.log("Error in adding labels to labelslist in db",err);
        return ERR;
    }
}

const deleteLabelnameInarrindb = async (email,labelname)=>{
    try {
        const response =await Notes.updateOne({"email" : email},{$pull :{"labelslist":labelname}});
        console.log("Label from the array deleted",response)
        return TRUE;
    }
    catch (err) {
        console.log("Error in deletion of label from labelslist",err);
        return ERR;
    }
}

const editLabelssarrdb = async (email,oldlabel,editedlabel)=>{
    try {
        const editLabelresponse = await Notes.updateOne({"email":email,"labelslist":oldlabel},{$set:{"labelslist.$":editedlabel}});
            
        console.log("Label edited in db",editLabelresponse)
    }
    catch (error) {
        console.log("Error in editing label in db",error);
        return ERR;
    }
}


module.exports = {addMainnotesobjtodb,deleteUsernotesobjInarrindb,editUsernotesarrobjdb,
                   addSubnotesobjinarrdb,getnotesarrfromdb,getlabelsarrfromdb,
                   addlabelnametodb,deleteLabelnameInarrindb,deleteLabelnameInarrindb,
                   editLabelssarrdb,editandreplaceSubnotesobjinarrdb}