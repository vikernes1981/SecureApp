import jwt from 'jsonwebtoken';


const SECRET = 'your-secret-key';

const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" }); // Let Axios handle the refresh
        }
        res.status(403).json({ message: "Invalid token" });
    }
};

export default authenticate;