const jwt = require('jsonwebtoken')
const crypto = require('crypto');

module.exports.generateToken = (user)=>{
    return jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_KEY);
}


module.exports.generateRandomToken = (length) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}
