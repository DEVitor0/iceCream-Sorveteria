const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  getCurrentUser
} = require('../controllers/others/changePermission/userRoleController');
const authenticateJWT = require('../middlewares/security/authMiddleware');
const checkRole = require('../middlewares/security/roleMiddleware');

// Rotas protegidas por autenticação JWT
router.use(authenticateJWT);

router.get('/me', getCurrentUser);

router.use(checkRole('admin'));
router.get('/', getAllUsers);
router.patch('/:userId/role', updateUserRole);

module.exports = router;
