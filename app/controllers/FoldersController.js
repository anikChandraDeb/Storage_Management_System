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


// Rename a folder
export const renameFolder= async (req, res) => {
    const { folderId } = req.params;
    const { newName } = req.body;

    try {
      const folder = await FolderModel.findById(folderId);
      if (!folder) {
        return res.status(404).json({"Status":"fail", error: "Folder not found" });
      }

      let result=await FolderModel.updateOne({_id:folderId},{name:newName});

      res.status(200).json({"status":"Success", message: "Folder renamed successfully", folder });
    } catch (error) {
      res.status(500).json({"Status":"fail", error: "Failed to rename folder", details: error.message });
    }
}

// Duplicate a folder
export const duplicateFolder= async (req, res) => {
    const { folderId } = req.params;
    const { userId } = req.body; // Assuming the userId is passed in the request body

    try {
        const folder = await FolderModel.findById(folderId);
        if (!folder) {
            return res.status(404).json({"Status":"fail", error: "Folder not found" });
        }

        // Create a new folder with the same structure but associate it with the userId
        let result= await FolderModel.create({
            name: `${folder.name}_copy`,
            userId: userId // Associate with the provided userId
        });

        res.status(201).json({ "status":"Success",message: "Folder duplicated successfully", folder: result });
    } catch (error) {
    res.status(500).json({"Status":"fail", error: "Failed to duplicate folder", details: error.message });
    }
}

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