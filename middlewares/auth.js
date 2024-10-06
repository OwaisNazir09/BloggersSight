const { verifytoken } = require('../services/authuntication');

function checkforauth(cookieName) {
    return async (req, res, next) => {
        const tokencookievalue = req.cookies[cookieName];  // Get token from cookies
        if (!tokencookievalue) {
            return next();  // If no token, continue without user
        }

        try {
            const userPayload = await verifytoken(tokencookievalue);  // Verify the token (if async)
            req.user = userPayload;  // Attach user to request
            return next();  // Proceed to the next middleware
        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(401).json({ message: 'Unauthorized' }); // Handle the error appropriately
        }
    };
}

module.exports = checkforauth;
