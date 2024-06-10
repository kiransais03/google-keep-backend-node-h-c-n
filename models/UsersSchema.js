const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        unique : true,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    }
},{collection : "users"})

module.exports = mongoose.model("users",UsersSchema)