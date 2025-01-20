import FileModel from '../models/FileModel.js';
import FolderModel from '../models/FolderModel.js';

export const addFavoriteService=async(req,res)=>{
    const { type, id } = req.params; // 'type' can be 'file' or 'folder', 'id' is the item ID

    try {
        let result;

        if (type === 'file') {
            // Find and update the file
            result = await FileModel.findByIdAndUpdate(id,{ favorite: true },{ new: true });
        } else if (type === 'folder') {
            // Find and update the folder
            result = await FolderModel.findByIdAndUpdate(
            id,{ favorite: true },{ new: true } );
        } else {
            return res.status(400).json({
            status: 'fail',
            error: 'Invalid type. Use "file" or "folder".',
            });
        }

        if (!result) {
            return res.status(404).json({
            status: 'fail',
            error: `${type === 'file' ? 'File' : 'Folder'} not found`,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `${type === 'file' ? 'File' : 'Folder'} added to favorites successfully`,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Failed to add to favorites',
            details: error.message,
        });
    }
}


export const removeFavoriteService=async(req,res)=>{
    const { type, id } = req.params; // 'type' can be 'file' or 'folder', 'id' is the item ID
  
    try {
      let result;
  
      if (type === 'file') {
        // Find and update the file
        result = await FileModel.findByIdAndUpdate(id,{ favorite: false },{ new: true });
      } else if (type === 'folder') {
        // Find and update the folder
        result = await FolderModel.findByIdAndUpdate(
          id,{ favorite: false },{ new: true } );
      } else {
        return res.status(400).json({
          status: 'fail',
          error: 'Invalid type. Use "file" or "folder".',
        });
      }
  
      if (!result) {
        return res.status(404).json({
          status: 'fail',
          error: `${type === 'file' ? 'File' : 'Folder'} not found`,
        });
      }
  
      res.status(200).json({
        status: 'success',
        message: `${type === 'file' ? 'File' : 'Folder'} removed from favorites`,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        error: 'Failed to add to favorites',
        details: error.message,
      });
    }
}

export const listFavoriteItemService=async(req,res)=>{
    const userId = req.headers.user_id;
  
    try {
      // Find all favorite files 
      const files = await FileModel.find({ userId, favorite: true,isSecret:false  });
  
      // Find all favorite folders
      const folders = await FolderModel.find({ userId, favorite: true});
  
      if (files.length === 0 && folders.length === 0) {
        return res.status(404).json({
          status: "fail",
          message: "No favorite files or folders found",
        });
      }
  
      const filesWithUrls = files.map(file => {
        const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${file.modifiedFileName}`;
        return {
          ...file._doc,
          fileUrl, 
        };
      });
  
      
      const items = [...filesWithUrls, ...folders].sort((a, b) => a.createdAt - b.createdAt);
  
      res.status(200).json({
        status: "success",
        items: items,
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        error: "Failed to retrieve favorite files and folders",
        details: error.message,
      });
    }
}