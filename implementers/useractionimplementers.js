const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/UsersSchema');
const {addUserToDB,getUserDataFromEmail,getUserDataFromUsername} = require('./dbfunctions/userdbfunctions')
const {verifyUsernameAndEmailExisits} = require('./verifyUsernameAndEmailExists');
const {addMainnotesobjtodb} = require('./dbfunctions/notesdbfunctions')
const {TRUE,ERR,FALSE,NOT_EXIST} = require('../constants')

const BCRYPT_SALTS = Number(process.env.BCRYPT_SALTS);

//POST Register
const registerUser =async (req,res)=>{

//Data Validation
const isValid = Joi.object({
    name : Joi.string().required(),
    username : Joi.string().min(3).max(30).alphanum().required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required()
}).validate(req.body);

if(isValid.error)
    {
        return res.status(400).send({
            status : 400,
            message : "Invalid input data format",
            data : isValid.error
        })
    }

    //Checking whether we have any email or username exiting in our Database
    const isUserExisting = await verifyUsernameAndEmailExisits(req.body.email,req.body.username);

    if(isUserExisting==TRUE)
        {
            return res.status(400).send({
                status:400,
                message : "Email or username already exists"
            })
        }
        else if(isUserExisting==ERR)
            {
                return res.status(400).send({
                    status : 400,
                    send : "Username and Email checking failed"
                })
            }

        const hashedPassword =await bcrypt.hash(req.body.password,BCRYPT_SALTS);

        const userObj = new User({
            name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,
        })

        const isUseradded = await addUserToDB(userObj);

        if(isUseradded == ERR)
            {
                return res.status(400).send({
                    status : 400,
                    message : "DB Error:Failed to add new user"
                }) 
            }
            else if(isUseradded == TRUE)
                {
                  //Creating the Mainnotesobj with email for saving all the notes of user into the "usernotes" array 
                  //present in this collection object
                  const isMainnotesadded = await addMainnotesobjtodb(req.body.email); 

                  if(isMainnotesadded == ERR) {
                    return res.status(400).send({
                        status : 400,
                        message : "Error occurred while adding Main notes in db.Pls retry"
                    }) 
                   }
                    return res.status(201).send({
                        status : 201,
                        message : "User added successfully"
                    })
                }
}

//POST Login

const loginUser = async (req,res)=>{
  const {loginId,password} = req.body;

  const isEmail = Joi.object({
    loginId : Joi.string().email().required()
  }).validate({loginId})

  let userData;

  if (isEmail.error) {         //If the user given loginId as username instead of Email,then get details of user with Username
    userData = await getUserDataFromUsername(loginId);
    if (userData.err) {
      return res.status(400).send({
        status: 400,
        message: "DB error: getUserDataFromUsername failed",
        data: userData.err,
      });
    }
  } else {
    userData = await getUserDataFromEmail(loginId);  //If the email is correct,then get user details with Email

    if (userData.err) {
        return res.status(400).send({
          status: 400,
          message: "DB error: getUserDataFromEmail failed",
          data: userData.err,
        });
      }
    }
  
    if (!userData.data) {         //If user data not found
      return res.status(400).send({
        status: 400,
        message: "No user found! Please register",
      });
    }

      const isPasswordMatching = await bcrypt.compare( 
        password,
        userData.data.password
      );
    
      if (!isPasswordMatching) {
        return res.status(400).send({
          status: 400,
          message: "Incorrect Password",
        });
      }

      const payload = {                  
        username: userData.data.username,
        name: userData.data.name,
        email: userData.data.email,
        userId: userData.data._id,
      };
    
      const token = jwt.sign(payload, process.env.JWT_SECRET);  
    
      res.status(200).send({
        status: 200,
        message: "Logged in successfully",
        data: {
          token,
        },
      });

    }



module.exports = {registerUser,loginUser}