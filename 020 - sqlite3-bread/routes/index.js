const express = require('express');
const router = express.Router();

const controller = require('../controllers/index');

router.get('/', controller.getIndex);
router.get('/page/:page', controller.getIndex);

module.exports = router;
