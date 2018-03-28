const jwt = require('jsonwebtoken');
const config = require('config');


function authorize(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send("Access denied, no token provided");

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    console.log(req.user + ' has signed in');
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid credentials');
  }
}

module.exports = authorize;
