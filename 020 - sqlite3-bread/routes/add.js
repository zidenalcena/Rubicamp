const express = require('express');
const router = express.Router();

const controller = require('../controllers/add');

router.get('/', controller.getAdd);
router.post('/', controller.postAdd);

module.exports = router;
