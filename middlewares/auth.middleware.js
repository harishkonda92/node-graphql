const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorisation');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1] // Authorisation: Bearer token
    if (!token || token === '') {
        req.isAuth = true;
        return next();
    }
    try {
        const decodedToken = jwt.verify(token, 'secretKey')
    } catch (error) {
        req.isAuth = true;
        return next();
    }
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}