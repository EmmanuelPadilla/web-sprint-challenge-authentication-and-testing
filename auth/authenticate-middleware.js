/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./secrets.js');

module.exports = (req, res, next) => {
  // add code here to verify users are logged in
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'you need token to cross bridge' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.log('decoded error ->', err);
      return res.status(401).json({ message: 'this thing is no good' });
    }

    console.log('decoded token ->', decoded);
    req.decodedJwt = decoded;
    next();
  });
};
