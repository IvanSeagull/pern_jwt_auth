const jwt = require('jsonwebtoken');
const { SECRET_JWT } = require('../config');

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') next();

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) return res.status(403).json({ msg: 'Unauthorized user' });

      const { role: userRoles } = jwt.verify(token, SECRET_JWT);

      console.log(userRoles);
      console.log(roles);

      let hasRole = false;
      if (userRoles === roles) {
        hasRole = true;
      }
      //   userRoles.forEach((role) => {
      //     if (roles.includes(role)) {
      //       hasRole = true;
      //     }
      //   });

      if (!hasRole) return res.status(403).json({ msg: 'You are not an admin' });

      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ msg: 'Unauthorized user' });
    }
  };
};
