/**
 * Created by nisheeth on 22/7/16.
 */

const jwt = require('jwt-simple');
const moment = require('moment');

const config = require('../config');

module.exports = () => {
  return {
    encode: (subject, expire) => {
      return jwt.encode({
        sub: subject,
        iat: moment().unix(),
        exp: expire || moment().add(1, 'days').unix()
      }, config.jwt.secret)
    },

    decode: (token) => {
      return jwt.decode(token, config.jwt.secret);
    }
  }
};