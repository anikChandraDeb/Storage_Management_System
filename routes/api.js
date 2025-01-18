import express from "express";
const router = express.Router();
import * as taskController from "../app/controllers/taskController.js";
import * as featureController from "../app/controllers/featureController.js";
import authMiddlewares from "../app/middlewares/authMiddlewares.js";
import * as UserController from "../app/controllers/UserController.js";
//Create Route
router.post('/createTask',taskController.createTask);

//Read Route
router.get('/readTask',taskController.readTask);

//Update Route
router.put('/updateTask',taskController.updateTask);

//Delete Route
router.delete('/deleteTask',taskController.deleteTask);

//JWT token encode and decode route
router.get("/feature1/TokenEncode",featureController.TokenEncode);
router.get("/feature2/TokenDecode",featureController.TokenDecode);

//Email route
router.get("/feature3/EmailSend",featureController.Email);

//Profile route
router.get('/feature4/Profile',authMiddlewares,featureController.Profile);

//cookie
router.get('/feature5/CreateCookies',featureController.CreateCookies);
router.get('/feature6/RemoveCookies',featureController.RemoveCookies);

//File Upload route
router.post('/feature7/FileUpload',featureController.FileUpload);





export default router; //export this file