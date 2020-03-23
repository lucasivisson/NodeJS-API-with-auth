const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const verifyToken = function (req, res, next) {
    let token = req.headers['x-acess-token'];
    if(!token) return res.status(401).send({ auth: false, message: 'No token provided'});
    
    jwt.verify(token, secret, function(err, decoded) {
        if(err) return res.status(200).send({ auth: false, message: 'Failed to authentication token.'});
        
    req.userId = decoded.id;
    next();
    })
}
module.exports = verifyToken;