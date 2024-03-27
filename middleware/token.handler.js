const jwt = require('jsonwebtoken');
const {config} = require('../config/config')

function tokenHandler () {
    return (req, res, next) => {

        try {
            if(req.headers.authorization === null){
                return res.status(400).json({message: "Debes iniciar sesión"})
            }else{
                let payload = jwt.verify(req.headers.authorization.slice(7,req.headers.authorization.length), config.jwtSecret);
                // let payload = jwt.verify(req.headers.authorization, config.jwtSecret);
                if(payload.nombre){
                    next();
                }
            }
            
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Problemas de autenticación"})
        }
      }
}

module.exports = tokenHandler;