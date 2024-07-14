//The code snippet requests a token from the client, checks if a token is available, and verifies that token.

//JWT verifies your token with your jwtSecret and returns a callback function. This function returns status code 401 if the token fails the authentication test.

const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET;

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" })
      } else {
        req.id = decodedToken.id;
        next()
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}