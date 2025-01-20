import FileModel from "../models/FileModel.js";
import FolderModel from "../models/FolderModel.js";
import mongoose from "mongoose";
import multer from 'multer';
import path from 'node:path';
import fs from 'fs';
import mime from 'mime-types'; // Optional, to check file extension if needed


//  get __dirname
const __dirname = new URL('.', import.meta.url).pathname;

export const renameService = async (req, res) => {
    const { type, id } = req.params; // 'type' can be 'file' or 'folder', 'id' is the item ID
    const { newName } = req.body;
  
    try {
      let result;
  
      if (type === 'file') {
        // Rename a file
        const file = await FileModel.findById(id);
        if (!file) {
          return res.status(404).json({ status: "fail", error: "File not found" });
        }
  
        // Get the current file path in storage
        const oldFilePath = path.join('storage', file.userId.toString(), file.modifiedFileName);
  
        // Get the new file path
        const newFilePath = path.join('storage', file.userId.toString(), `${Date.now()}_${newName}`);
  
        // Rename the file in the storage
        fs.renameSync(oldFilePath, newFilePath);
  
        // Update the database with the new file name
        result = await FileModel.findByIdAndUpdate(id, { name: newName, modifiedFileName: newName,filePath:newFilePath }, { new: true });
  
      } else if (type === 'folder') {
        // Rename a folder
        const folder = await FolderModel.findById(id);
        if (!folder) {
          return res.status(404).json({ status: "fail", error: "Folder not found" });
        }
  
        result = await FolderModel.findByIdAndUpdate(id, { name: newName }, { new: true });
      } else {
        return res.status(400).json({
          status: "fail",
          error: "Invalid type. Use 'file' or 'folder'.",
        });
      }
  
      res.status(200).json({
        status: "success",
        message: `${type === 'file' ? 'File' : 'Folder'} renamed successfully`,
        item: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        error: `Failed to rename ${type}`,
        details: error.message,
      });
    }
}

export const deplicateService=async(req,res)=>{
    const { type, id } = req.params; // 'type' can be 'file' or 'folder', 'id' is the item ID
  
    try {
      if (type === 'file') {
        // Duplicate a file
        const file = await FileModel.findById(id);
        if (!file) {
          return res.status(404).json({ status: "fail", error: "File not found" });
        }
  
        // Generate a new file name and path
        const newFileName = `${Date.now()}_${file.name}`;
        const newFilePath = path.join('storage', file.userId.toString(), newFileName);
  
        // Ensure the new file directory exists
        const newDirectory = path.dirname(newFilePath);
        if (!fs.existsSync(newDirectory)) {
          fs.mkdirSync(newDirectory, { recursive: true });
        }
  
        // Copy the original file to the new location
        await fs.promises.copyFile(file.filePath, newFilePath);
  
        
        const duplicatedFile = await FileModel.create({
          name: `copy_${file.name}`,
          modifiedFileName: newFileName,
          userId: file.userId,
          folder: file.folder,
          filePath: newFilePath,
          fileType: file.fileType,
          fileSize: file.fileSize,
        });
  
        return res.status(201).json({
          status: "success",
          message: "File duplicated successfully",
          item: duplicatedFile,
        });
      } else if (type === 'folder') {
        // Duplicate a folder
        const folder = await FolderModel.findById(id);
        if (!folder) {
          return res.status(404).json({ status: "fail", error: "Folder not found" });
        }
  
        // Create a new folder with the same structure
        const duplicatedFolder = await FolderModel.create({
          name: `${folder.name}_copy`,
          userId: folder.userId,
        });
  
        return res.status(201).json({
          status: "success",
          message: "Folder duplicated successfully",
          item: duplicatedFolder,
        });
      } else {
        return res.status(400).json({
          status: "fail",
          error: "Invalid type. Use 'file' or 'folder'.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "fail",
        error: `Failed to duplicate ${type}`,
        details: error.message,
      });
    }
}

export const DeleteService=async(req,res)=>{
    const { type, id } = req.params; // 'type' can be 'file', 'folder', or 'listFolders'
    const userId = req.headers.user_id; 
  
    try {
      if (type === 'file') {
        // Delete a file
        const file = await FileModel.findById(id);
        if (!file) {
          return res.status(404).json({ Status: "fail", error: "File not found" });
        }
  
        const filePath = file.filePath;
        fs.unlink(filePath, async (err) => {
          if (err) {
            return res.status(500).json({
              Status: "fail",
              error: "Failed to delete file from storage",
              details: err.message,
            });
          }
  
          await FileModel.deleteOne({ _id: id });
          res.status(200).json({
            status: "success",
            message: "File deleted successfully from storage and database",
          });
        });
  
      } else if (type === 'folder') {
        // Delete a folder
        const folder = await FolderModel.findById(id);
        if (!folder) {
          return res.status(404).json({ Status: "fail", error: "Folder not found" });
        }
  
        // delete folder
        await FolderModel.deleteOne({ _id: id });
        //delete recursively nested files
        await FileModel.deleteMany({folder:id});
        res.status(200).json({
          status: "success",
          message: "Folder deleted successfully",
        });
        
      }  else {
        res.status(400).json({
          Status: "fail",
          error: "Invalid type. Use 'file', 'folder', or 'listFolders'.",
        });
      }
    } catch (error) {
      res.status(500).json({
        Status: "fail",
        error: `Failed to process ${type}`,
        details: error.message,
      });
    }
}

export const listOfItemByDateService=async(req,res)=>{
    const userId = req.headers.user_id;
    const { specificDate } = req.body;
  
    try {
      // Validate specificDate
      if (!specificDate) {
        return res.status(400).json({ Status: "fail", error: "Specific date is required" });
      }
  
      const date = new Date(specificDate);
  
      if (isNaN(date.getTime())) {
        return res.status(400).json({ Status: "fail", error: "Invalid date format" });
      }
  
      // Define the start and end of the specific day
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
      // Fetch files created on the specific date
      const files = await FileModel.find({
        userId: userId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        isSecret:false
      });
  
      // Fetch folders created on the specific date
      const folders = await FolderModel.find({
        userId: userId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
  
      // Add URLs to each file
      const filesWithUrls = files.map(file => {
        const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${file.modifiedFileName}`;
        return {
          ...file._doc,
          fileUrl, // Add the fileUrl to each file object
        };
      });
  
      // Add URLs to each folder (assuming folders have URLs like files, you can customize as needed)
      const foldersWithUrls = folders.map(folder => {
        const folderUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${folder.name}`;
        return {
          ...folder._doc,
          folderUrl, // Add the folderUrl to each folder object
        };
      });
  
      // Combine files and folders into a single response
      const items = [...filesWithUrls, ...foldersWithUrls].sort((a, b) => a.createdAt - b.createdAt);
  
      if (items.length === 0) {
        return res.status(404).json({ Status: "fail", message: "No files or folders found for the specified date" });
      }
  
      res.status(200).json({
        Status: "success",
        message: "Files and folders retrieved successfully",
        items: items,
      });
    } catch (error) {
      res.status(500).json({
        Status: "fail",
        error: "Failed to retrieve files or folders by specific date",
        details: error.message,
      });
    }
}