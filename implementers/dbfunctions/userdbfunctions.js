const {TRUE,ERR} = require('../../constants');
const User = require('../../models/UsersSchema');

const findUsersWithEmailOrUsername = async (email,username)=>{
let userdata = {
    data : null,
    err : null
};

try {
    userdata.data = await User.find({$or : [{email},{username}]}); //'$or' is OR operator,it checks for match of atleast one field

    return userdata;
}
catch (err) {
 userdata.err = err
 return userdata
}

}

let addUserToDB = async (userObj)=>{
    try {
        await userObj.save();
        return TRUE;
    }
    catch (err) {
        console.log("Unable to add user Error",err)
        return ERR
    }
}

let getUserDataFromUsername = async (username)=>{
    let userdata = {
        data : null,
        err : null
    }

    try {
       userdata.data = await User.findOne({username});
       return userdata
    }
    catch (err) {
        userdata.err = err;
        return userdata;
    }
}

let getUserDataFromEmail = async (email)=>{
    let userdata = {
        data : null,
        err : null
    }

    try {
       userdata.data = await User.findOne({email});
       return userdata
    }
    catch (err) {
        userdata.err = err;
        return userdata;
    } 
}



module.exports = {findUsersWithEmailOrUsername,getUserDataFromUsername,getUserDataFromEmail,addUserToDB}