const jwt = require('jsonwebtoken');

const isAuth = (req,res,next)=>{
    const tokenstring = req.headers["token-gkeep"];
    const token = tokenstring.split(' ')[1];
    let verified;

    try {
        verified = jwt.verify(token,process.env.JWT_SECRET);
    }
    catch (err) {
        return res.status(400).send({
            status :400,
            message : "Token verification failed.Please Login",
            data : err
        })
    }

    if(verified) {
        req.locals = verified;
        next();
    }
    else {
        res.status(401).send({
            status :401,
            message : "User Not Authenticated.Please Login"
        })
    }
 }

 module.exports = {isAuth};