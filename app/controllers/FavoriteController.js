import FileModel from '../models/FileModel.js';
import FolderModel from '../models/FolderModel.js';
import { addFavoriteService, 
    removeFavoriteService,
    listFavoriteItemService } from '../services/FavoriteService.js';


// Add to favorites
export const addFavorite = async (req, res) => {
    await addFavoriteService(req,res);
};

// Add to favorites
export const removeFavorite = async (req, res) => {
    await removeFavoriteService(req,res);
};


// List favorite files and folders for a user
export const listFavoriteItem = async (req, res) => {
    await listFavoriteItemService(req,res);
};
  