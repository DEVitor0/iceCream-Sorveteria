const { verifyToken } = require('../utils/auth');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Acesso não autorizado'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('jwt');
        res.status(401).json({
            success: false,
            message: 'Sessão expirada ou inválida'
        });
    }
};

module.exports = authenticateJWT;
