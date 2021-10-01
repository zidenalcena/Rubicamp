const express = require('express');
const router = express.Router();

const controller = require('../controllers/edit');

router.get('/:id', controller.getEdit);
router.post('/:id', controller.postEdit);

module.exports = router;
