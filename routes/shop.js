const path = require('path');
const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

// Route handling middlewares
router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views','shop.html'));
  });

module.exports = router;