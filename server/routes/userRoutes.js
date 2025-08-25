import express from 'express';
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectRoute, updateProfile);
userRouter.get('/check', protectRoute, checkAuth);
userRouter.post('/logout', protectRoute, (req, res) => {
  // Optionally clear any session or token logic here
  res.json({ success: true, message: "Logged out successfully" });
});

export default userRouter;