const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  console.log(token);
  jwt.verify(token, process.env.JWTKEY, (err, decoded) => {
    if (err) {
      //console.log(err);
      // Token is invalid or expired
      res.status(401).json({ message: 'Unauthorized', err: err });
    } else {
      // User is authenticated
      req.user = decoded;
      next();
    }
  });
}

function signToken(user){
  //const { iss, sub, aud, exp, nbf, iat, jti } = claims;
  const payload = {
    iss: process.env.JWTISS,      // Issuer
    sub: user.id,            // Subject (user ID)
    aud: 'Home Network User',    // Audience
    exp: Math.floor(Date.now() / 1000) + 3600, // Expiration time (1 hour from now)
    iat: Math.floor(Date.now() / 1000),            // Issued at
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWTKEY);
}


module.exports = { verifyToken, signToken };
