/**
 * Created by nisheeth on 25/7/16.
 */
const express = require('express');
const router = express.Router();

router.all('/', function(req, res, next) {
  res.send({status: 'OK', version: '1.0'})
});

module.exports = router;