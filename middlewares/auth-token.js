/**
 * Created by nisheeth on 25/7/16.
 */

module.exports = (validate, error) => {
  return (req, res, next) => {
    if (req.headers['authorization'] && validate(req.headers['authorization'])) {
      next();
    } else {
      error(res);
    }
  };
};