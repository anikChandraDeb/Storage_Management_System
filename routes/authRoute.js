import express from "express";
const router = express.Router();
import authMiddlewares from "../app/middlewares/authMiddlewares.js";
import * as UserController from "../app/controllers/UserController.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { EncodeToken,DecodeToken } from "../app/utility/tokenUtility.js";

//User
router.post('/SignUp',UserController.SignUp);
router.post('/Login',UserController.Login);

router.get('/try',(req,res)=>{
    res.send("Hello")
})
// Redirect to Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback after Google login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/error" }),
  (req, res) => {
    // Generate JWT
    const token = EncodeToken(req.user.email,req.user._id);
    res.cookie('authToken', token, { 
        expires: new Date(Date.now() + 360000), // Set the cookie to expire in 360000ms (6 minutes)
        httpOnly: true, // Secure option (only accessible via HTTP)
    });
    res.json({ token });
  }
);
// Define the login route
router.get('/error', (req, res) => {
    res.send("Please log in with Google");
});

router.post('/VerificationCode',UserController.EmailVerify);
router.post('/CodeVerify',UserController.CodeVerify);
router.post('/ResetPassword',UserController.ResetPassword);
router.get('/Delete',authMiddlewares,UserController.Delete);
router.post('/ChangePassword',authMiddlewares,UserController.ChangePassword);
router.get('/Logout',authMiddlewares,UserController.Logout);



export default router; //export this file