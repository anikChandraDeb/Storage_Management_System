import express from "express";
const router = express.Router();

import authMiddlewares from "../app/middlewares/authMiddlewares.js";
import * as UserController from "../app/controllers/UserController.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { EncodeToken,DecodeToken } from "../app/utility/tokenUtility.js";

//User
router.get('/Profile',authMiddlewares, UserController.Profile);
router.get('/getStorageStats',authMiddlewares,UserController.getStorageStats);
router.get('/recentItems',authMiddlewares,UserController.recentItems);
router.post('/editProfile',authMiddlewares,UserController.editProfile);


export default router; //export this file