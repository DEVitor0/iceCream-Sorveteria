const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware');

router.get("/", authenticateJWT, (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = router;
