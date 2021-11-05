const express = require('express');
const controller = require('../controllers/userController');
const {isGuest} = require('../middlewares/auth');
const {isLoggedin} = require('../middlewares/auth');
const {loginLimiter} = require('../middlewares/rateLimiter');
const {validateSignup,validateLogin,validateResult} = require('../middlewares/validator');
const router = express.Router();

//GET & POST /user/newUser: send html form for new user signup.
router.get('/new',isGuest, controller.newUser);
router.post('/signup', isGuest,  validateSignup, validateResult, controller.create);

//GET & POST /user/login: send html form for login
router.get('/login',isGuest, controller.login);
//POST /users/login: authenticate user's login
router.post('/login', loginLimiter, validateLogin, isGuest, validateResult, controller.validatelogin);

//GET /user/logout: delete the session
router.get('/logout',isLoggedin, controller.logout);

//GET /user/profile: send html form of index page.
router.get('/profile',isLoggedin, controller.profile);

module.exports = router;