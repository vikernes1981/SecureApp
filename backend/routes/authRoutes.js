import express from 'express';
import { login, register, refreshToken } from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';
import { loginLimiter, registerLimiter } from '../middleware/limiters.js';

const router = express.Router();

// Routes
router.get('/', authenticate, (req, res) => {
    res.status(200).json({ message: `Welcome to the homepage, ${req.user.username}!` });
});
router.post('/login',loginLimiter, login);
router.post('/register',registerLimiter, register);
router.post('/refresh-token', refreshToken);

export default router;