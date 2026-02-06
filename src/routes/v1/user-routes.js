const express = require('express');
const { UserController, InfoController } = require('../../controllers');

const router = express.Router();

router.get('/info', InfoController.info);
router.post('/signup', UserController.createUser);

module.exports = router;