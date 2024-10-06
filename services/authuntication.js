const jwt = require('jsonwebtoken');

const secret = "09092001"; // Use the same secret in both functions

function createusertoken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
    };
    const token = jwt.sign(payload, secret); 
    return token
}

function verifytoken(token) {
    const payload = jwt.verify(token, secret); 
    return payload;
}

module.exports = {
    createusertoken,
    verifytoken,
};
