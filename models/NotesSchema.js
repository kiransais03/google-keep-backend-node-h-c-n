const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// //Sub schema for usernotes array objects
// const Notesobjsubschema = new Schema ({
//     id :{
//         type :Number,
//         unique : true,
//         required : true
//     },
//     title :{
//         type :String,
//         unique : true,
//         required : true
//     },
//     text :{
//         type :String,
//         required : true
//     },
//     pinselected :{
//         type :Boolean,
//         required : true
//     },
//     archived :{
//         type :Boolean,
//         required : true
//     },
//     trashed :{
//         type :Boolean,
//         required : true
//     },
//     notebgcolour :{
//         type :String,
//         required : true
//     },
//     labels : {
//         type : [String],
//         requried : true
//     }
// })



//Main Schema for Notes collection embedding the usernotes subschema in this 
const NotesSchema = new Schema ({
    email : { 
        type : String,
        unique : true,
        required : true
    },
    usernotes : {
        type : Array,
        requried : true
    }

},{collection : "notes"})

module.exports = mongoose.model("notes",NotesSchema)


