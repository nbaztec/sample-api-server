/**
 * Created by nisheeth on 22/7/16.
 */

const logger = require('./logger');

module.exports = {
  init: (app) => {
    if (app.get('env') !== 'test') {
      app.use(logger('morgan'));
    }
  },
  jwt: require('./jwt'),
  user: require('./user')
};