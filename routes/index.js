const express = require('express');
const router = express.Router();
const authToken = require('../middlewares/auth-token');
const jwtHelper = require('../helpers/jwt')();
const config = require('../config');

router.all('/', (req, res, next) => {
  res.send({status: 'OK'});
});


router.use('/auth', require('./auth'));

// Protect API resource with JWT authentication
router.use('/api', authToken(token => {
  try {
    const t = jwtHelper.decode(token);
    return t.sub === config.user.username;
  } catch (e) {
    return false;
  }
}, res => {
  res.status(400);
  res.send({error: 'Unauthorized request'});
}), require('./api'));

module.exports = router;
