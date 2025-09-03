const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //bearer TOKEN

    if(!token) {
        return res.status(401).json({msg: 'A token is required for authentication'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(403).json({msg: 'Invalid Token'})
    }

    return next();
}

module.exports = verifyToken;