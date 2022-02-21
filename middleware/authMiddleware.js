const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') next();

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(403).json({ msg: 'Unauthorized user' });

    const decodedData = jwt.verify(token, process.env.SECRET_JWT);

    req.user = decodedData;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: 'Unauthorized user' });
  }
};
