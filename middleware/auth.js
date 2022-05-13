const jwt = require("jsonwebtoken");
require("dotenv").config();

//middleware will continue if the token is inside the local storage
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("authorization");

  // return if there is no token
  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token
  try {
    //it is going to give the user id (user:{id: user.id})
    const verify = jwt.verify(token, process.env.SECRETTOKEN);

    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

// const jwt = require("jsonwebtoken");
// const jwksRsa  = require('jwks-rsa');
// const dotenv = require('dotenv');

// // get config vars
// dotenv.config();

// //configuring the jwt client with the identity server jwt url
// var client = jwksRsa({
//     jwksUri: process.env.JWT_URL
   
//   });
//  // console.log(client);

//   async function getKey(header){
//     try {
//      // console.log("client.getSigningKey(header.kid)", header.kid)
//       var key = await client.getSigningKey(header.kid);
//       //console.log("key :", key);
//       var signingKey = key.publicKey || key.rsaPublicKey;
//       //console.log("signing key :", signingKey);
//       return signingKey;
//     } catch (e) {
//       console.log(e)
//     }
//   }
//   //validating the user jwt token
// const verifyToken = async (req, res, next) => {
//     var token = null;
//     // console.log(req.headers)
//     if(req.headers["authorization"]) token =  req.headers["authorization"].split(' ')[1];
//     //console.log(token);
//     if (!token) {
//       return next({status:403, message:"Authentication is required."});
//     }
//     try {
//       var scecretKey = await getKey(req.headers);
//       //console.log("secret key :", scecretKey);
//       const decoded = jwt.verify(token, scecretKey);
//       req.user = decoded;
//       //console.log("decoded user data:", req.user);
//       return next();
//     } catch (err) {
//       return next(err);
//     }
//   };

//   module.exports = verifyToken;