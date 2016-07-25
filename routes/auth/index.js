const express = require('express');
const router = express.Router();

const jwtHelper = require('../../helpers/jwt')();
const config = require('../../config');

router.post('/token', (req, res, next) => {
  if (req.body.username === config.user.username && req.body.password === config.user.password) {
    res.send({token: jwtHelper.encode(config.user.username)});
  } else {
    res.status(400);
    res.send({error: 'Authentication failed'});
  }
});

module.exports = router;
