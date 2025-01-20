import express from "express";
const router = express.Router();
import authMiddlewares from "../app/middlewares/authMiddlewares.js";
import * as SecretController from "../app/controllers/SecretController.js";



router.post('/setPin',authMiddlewares,SecretController.setPin);
router.post('/getInSecret',authMiddlewares,SecretController.getInSecret);
router.post('/addSecretNote',authMiddlewares,SecretController.addSecretNote);
router.post('/addSecretImage',authMiddlewares,SecretController.addSecretImage);
router.post('/addSecretPdf',authMiddlewares,SecretController.addSecretPdf);




export default router; //export this file