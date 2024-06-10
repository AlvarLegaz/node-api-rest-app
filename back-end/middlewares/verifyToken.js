const jwt = require("jsonwebtoken");
const debug = require('debug')('http')

module.exports = function(req, res, next) {

    try{

        const token = req.headers['authorization']; 
        debug("Received token:", token);
        debug("JWT PRIVATE KEY:", process.env.JWTPRIVATEKEY);
  
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        debug("Decoded token: ", decoded);
        
        next();

    }
    catch (error){

        debug("Token inválido");
        res.status(400).send("Token inválido");

    }

}   