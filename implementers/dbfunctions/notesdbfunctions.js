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
        const getnotesarrresponse = await Notes.find({"email": email});
        console.log("Notesarr from db",getnotesarrresponse);
        return getnotesarrresponse
    }
    catch (error) {
        console.log("Error in getting sub notes from db",error);
        return ERR;
    }
}

//labels functions

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
        
        let notesdocumentdata = await getnotesarrfromdb(email);

        let filteredusernotesarrlabelsupdated = notesdocumentdata[0].usernotes.filter((currObj,index)=>{
            if(currObj.labels.includes(labelname))
                {
                    let notelabelarr = currObj.labels;
                    let labelindex = notelabelarr.indexOf(labelname);
                    notelabelarr.splice(labelindex,1);
                    currObj.labels = notelabelarr
                    return currObj;
                }
                else {
                    return currObj;
                } 
        })
        const usernotesupdate = await Notes.updateOne( { "email":email }, { $set: { "usernotes": filteredusernotesarrlabelsupdated } });
        
        console.log("Label & Usernotes leble deleted in db",response,"Notesdocumentdata",notesdocumentdata,"Usernotesupdate",usernotesupdate)
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

        let notesdocumentdata = await getnotesarrfromdb(email);

        let filteredusernotesarrlabelsupdated = notesdocumentdata[0].usernotes.filter((currObj,index)=>{
            if(currObj.labels.includes(oldlabel))
                {
                    let notelabelarr = currObj.labels;
                    let oldlabelindex = notelabelarr.indexOf(oldlabel);
                    notelabelarr.splice(oldlabelindex,1,editedlabel);
                    currObj.labels = notelabelarr
                    return currObj;
                }
                else {
                    return currObj;
                } 
        })
        const usernotesupdate = await Notes.updateOne( { "email":email }, { $set: { "usernotes": filteredusernotesarrlabelsupdated } });
            
        console.log("Label & Usernotes with that label edited in db",editLabelresponse,"Notesdocumentdata",notesdocumentdata,"Usernotesupdate",usernotesupdate)
    }
    catch (error) {
        console.log("Error in editing label in db",error);
        return ERR;
    }
}

//notes delete from trash after 30 days function

const deletetrashednotesafter30daysindb = async (email)=>{
    try {
        let currTime = new Date().getTime();
        let millisecs30days = 1000*60*60*24*30;
        
        let notesdocumentdata = await getnotesarrfromdb(email);
        let filteredusernotesarrafterexpiry = notesdocumentdata[0].usernotes.filter((currObj,index)=>{
            if(currObj.trashed==false || (currObj.trashed==true && ((currTime-currObj.id)<=millisecs30days)))
                {
                    return currObj;
                } 
        })
        console.log("Trashed 30 days",filteredusernotesarrafterexpiry)

        const usernotesupdate = await Notes.updateOne( { "email":email }, { $set: { "usernotes": filteredusernotesarrafterexpiry } });
        // console.log("data",notesdocumentdata[0].usernotes)
        console.log("Trashed notes delted after 30 days in db",usernotesupdate)
    }
    catch (error) {
        console.log("Error in delete trashed notes after 30 days lin  db",error);
        return ERR;
    }
}

 
module.exports = {addMainnotesobjtodb,deleteUsernotesobjInarrindb,editUsernotesarrobjdb,
                   addSubnotesobjinarrdb,getnotesarrfromdb,getlabelsarrfromdb,
                   addlabelnametodb,deleteLabelnameInarrindb,deleteLabelnameInarrindb,
                   editLabelssarrdb,editandreplaceSubnotesobjinarrdb,
                   deletetrashednotesafter30daysindb}