const express = require('express');
const router = express.Router();

const controller = require('../controllers/404');

router.get('*', controller.get404);

module.exports = router;
