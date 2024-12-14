// const jwt = require('jsonwebtoken');

// const authenticate = (req,res,next) =>{
//     const token = req.header('Authorization');
//     if(!token || !token.startsWith('Bearer ')){   
//         return res.status(401).send('Authentication failed:invalid token ')
//     }
//     try {
//         const tokenData = token.split(' ')[1];
//         const decodedToken = jwt.verify(tokenData,process.env.JWT_SECRET);
//         req.userId=decodedToken._id;
//         next();
//     } catch (error) {
//         return res.status(401).send('Authentication failed:invalid token ')

//     }
// }


// Middleware to protect routes
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(403); // No token, return forbidden
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Invalid token, return forbidden
        }
        req.user = user; // Store the user information for further use
        next(); // Continue to the next middleware or route handler
    });
};

module.exports = authenticateToken;
