const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// //Permet de s'inscrire ***** 1
router.post('/signup', userCtrl.signup);
// //Permet de se log ***** 2
router.post('/login', userCtrl.login);

module.exports = router;
