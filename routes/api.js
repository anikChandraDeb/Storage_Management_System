import express from "express";
const router = express.Router();

import authMiddlewares from "../app/middlewares/authMiddlewares.js";
import * as UserController from "../app/controllers/UserController.js";
import * as FolderController from "../app/controllers/FoldersController.js";
import * as FileController from "../app/controllers/FilesController.js";
import * as FileFolderController from "../app/controllers/FileFolderController.js";
import * as FavoriteController from "../app/controllers/FavoriteController.js";



//Folder
router.post('/createFolder',authMiddlewares,FolderController.createFolder);
router.get('/listOfFolders',authMiddlewares,FolderController.listOfFolders);

//File
router.post('/addImage',authMiddlewares,FileController.addImage);
router.post('/addPdf',authMiddlewares,FileController.addPdf);
router.post('/addNote',authMiddlewares,FileController.addNote);
router.get('/listOfNotes',authMiddlewares,FileController.listOfNotes);
router.get('/listOfImages',authMiddlewares,FileController.listOfImages);
router.get('/listOfPDFs',authMiddlewares,FileController.listOfPDFs);

//FileFolder
router.post('/listOfItemByDate',authMiddlewares,FileFolderController.listOfItemByDate);
router.post('/rename/:id/:type',authMiddlewares,FileFolderController.rename);
router.get('/duplicate/:id/:type',authMiddlewares,FileFolderController.duplicate);
router.get('/delete/:id/:type',authMiddlewares,FileFolderController.Delete);

//Favorite
router.get('/addFavorite/:id/:type',authMiddlewares,FavoriteController.addFavorite)
router.get('/removeFavorite/:id/:type',authMiddlewares,FavoriteController.removeFavorite)
router.get('/listFavoriteItem',authMiddlewares,FavoriteController.listFavoriteItem)




export default router; //export this file