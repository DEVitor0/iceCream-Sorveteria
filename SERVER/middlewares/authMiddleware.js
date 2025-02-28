const { verifyToken } = require('../utils/auth');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('jwt')
        res.redirect('/login');
    }
};

module.exports = authenticateJWT;
