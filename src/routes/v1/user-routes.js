const express = require('express');
const { UserController, InfoController } = require('../../controllers');

const { AuthRequestMiddlewares } = require('../../middlewares');

const router = express.Router();

router.get('/info', InfoController.info);
router.post('/signup',AuthRequestMiddlewares.validateAuthRequest, UserController.createUser);
router.post('/signin', AuthRequestMiddlewares.validateAuthRequest, UserController.signIn);

module.exports = router;