const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_KEY)
    req.userData = {
      username: decodedToken.username,
      userFullName: decodedToken.userFullName,
      userId: decodedToken.userId
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Auth failed' })
  }
}
