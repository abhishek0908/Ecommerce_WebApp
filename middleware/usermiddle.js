const { secretKey } = require('../config');
const jwt = require('jsonwebtoken');

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const words = token.split(' ');
        const jwtToken = words[1];
        const decodedValue = jwt.verify(jwtToken, secretKey);

        if (decodedValue.username) {
            next();
        } else {
            res.status(403).send('Invalid token');
        }
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).send('Invalid token');
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(403).send('Token expired');
        }
        res.status(500).send('Internal server error');
    }
}

module.exports = { userMiddleware };
