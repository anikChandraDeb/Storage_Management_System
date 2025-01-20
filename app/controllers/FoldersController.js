import FolderModel from '../models/FolderModel.js';

export const createFolder = async (req, res) => {
  try {
    let reqBody = req.body;
    let user_id=req.headers['user_id'];
    reqBody.user_id=user_id;

    let result= await FolderModel.create(reqBody);
    res.status(201).json({ status: 'success',message:"Folder Created", data: result });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.toString() });
  }
};


  // Delete a folder
export const deleteFolder= async (req, res) => {
    const { folderId } = req.params;

    try {
      const folder = await FolderModel.findById(folderId);
      if (!folder) {
        return res.status(404).json({"Status":"fail", error: "Folder not found" });
      }

      // Optionally handle recursive deletion of nested folders
      await FolderModel.deleteOne({ _id: folderId });

      res.status(200).json({"status":"Success", message: "Folder deleted successfully" });
    } catch (error) {
      res.status(500).json({"Status":"fail", error: "Failed to delete folder", details: error.message });
    }
}

// List all folders for a user
export const listOfFolders = async (req, res) => {
    const  userId  = req.headers.user_id; 
  
    try {
      const folders = await FolderModel.find({ userId: userId });
  
      if (folders.length === 0) {
        return res.status(404).json({ Status: "fail", message: "No folders found" });
      }
  
      res.status(200).json({
        Status: "success",
        folders: folders
      });
    } catch (error) {
      res.status(500).json({
        Status: "fail",
        error: "Failed to retrieve folders",
        details: error.message
      });
    }
  };