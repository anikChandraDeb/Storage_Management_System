import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import FileModel from '../models/FileModel.js';
import FolderModel from "../models/FolderModel.js";
import UsersModel from '../models/UsersModel.js';
import { upload } from '../config/multerConfig.js';
import mime from 'mime-types';
import { setPinService,getInSecretService } from '../services/SecretService.js';

export const setPin = async (req, res) => {
    await setPinService(req,res);
};

export const getInSecret = async (req, res) => {
    await getInSecretService(req,res);
};

// Middleware function to check file type
const checkFileType = (file) => {
    const mimeType = file.mimetype;
    const extension = mime.extension(mimeType);
    console.log(extension)
    // Check if the file is an image, PDF, or text file
    const validImageTypes = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    const validPdfTypes = ['pdf'];
    const validTextTypes = ['plain', 'text','txt','doc','docx'];
  
    if (validImageTypes.includes(extension)) {
      return 'image';
    } else if (validPdfTypes.includes(extension)) {
      return 'pdf';
    } else if (validTextTypes.includes(extension)) {
      return 'text';
    } else {
      return 'invalid'; // If file type is not supported
    }
};
  
// Add Secret Text File
export const addSecretNote = [
    upload.single('text'), // Middleware to handle file upload
    async (req, res) => {
      const { pin, folderId } = req.body;
      const userId = req.headers.user_id;
  
      try {
        // Step 1: Check if the file is uploaded
        if (!req.file) {
          return res.status(400).json({ error: 'No text file uploaded' });
        }
  
        // Check if the uploaded file is a text file
        const fileType = checkFileType(req.file);
        if (fileType !== 'text') {
            fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: 'Selected file is not a text file' });
        }
  
        // Check if the folderId is provided
        if (!folderId) {
            fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: 'Folder ID is required' });
        }
  
        // Step 2: Check if PIN is provided and validate it
        if (!pin) {
          // No PIN provided, delete the uploaded file and return an error
          fs.unlinkSync(req.file.path); // Delete the file from the server
          return res.status(400).json({ error: 'PIN is required to store secret notes' });
        }
  
        // Validate PIN
        const user = await UsersModel.findById(userId);
        if (!user) {
          // User not found, delete the file
          fs.unlinkSync(req.file.path);
          return res.status(404).json({ error: 'User not found' });
        }
  
        const isPinValid = await bcrypt.compare(pin, user.pinHash);
        if (!isPinValid) {
          // Invalid PIN, delete the file
          fs.unlinkSync(req.file.path);
          return res.status(403).json({ error: 'Invalid PIN. Access denied.' });
        }
  
        // Step 3: If PIN is valid, insert the file into the database
        const relativeFilePath = path.join('storage', userId.toString(), req.file.filename);
  
        // Generate the file URL for the frontend
        const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${req.file.filename}`;
        const fileSize = req.file.size; // File size in bytes
  
        // Create a new file entry in the database
        const newFile = new FileModel({
          name: req.file.originalname, // Original file name
          userId,
          folder: folderId,
          filePath: relativeFilePath, // Store the relative file path
          fileType: req.file.mimetype, // MIME type of the uploaded file
          modifiedFileName: req.file.filename, // Store the modified file name (with timestamp)
          fileSize,
          isSecret: true, // Mark this file as secret
        });
  
        await newFile.save();
  
        // Return response to the client
        res.status(201).json({
          message: 'Text file added successfully',
          file: newFile,
          fileUrl: fileUrl, // Include the file URL in the response
        });
      } catch (error) {
        if(req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to upload text file', details: error.message });
      }
    },
  ];
  


// Add Secret Image File
export const addSecretImage = [
    upload.single('image'), // Middleware to handle file upload
    async (req, res) => {
      const { pin, folderId } = req.body;
      const userId = req.headers.user_id;
  
      try {
        // Step 1: Check if the file is uploaded
        if (!req.file) {
          return res.status(400).json({ error: 'No image file uploaded' });
        }
  
        // Check if the uploaded file is an image
        const fileType = checkFileType(req.file);
        if (fileType !== 'image') {
          fs.unlinkSync(req.file.path); // Delete invalid file
          return res.status(400).json({ error: 'Selected file is not an image' });
        }
  
        // Check if the folderId is provided
        if (!folderId) {
          fs.unlinkSync(req.file.path); // Delete file if no folderId
          return res.status(400).json({ error: 'Folder ID is required' });
        }
  
        // Step 2: Check if PIN is provided and validate it
        if (!pin) {
          fs.unlinkSync(req.file.path); // Delete file if no PIN
          return res.status(400).json({ error: 'PIN is required to store secret images' });
        }
  
        // Validate PIN
        const user = await UsersModel.findById(userId);
        if (!user) {
          fs.unlinkSync(req.file.path); // Delete file if user not found
          return res.status(404).json({ error: 'User not found' });
        }
  
        const isPinValid = await bcrypt.compare(pin, user.pinHash);
        if (!isPinValid) {
          fs.unlinkSync(req.file.path); // Delete file if PIN is invalid
          return res.status(403).json({ error: 'Invalid PIN. Access denied.' });
        }
  
        // Step 3: If PIN is valid, insert the file into the database
        const relativeFilePath = path.join('storage', userId.toString(), req.file.filename);
  
        // Generate the file URL for the frontend
        const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${req.file.filename}`;
        const fileSize = req.file.size; // File size in bytes
  
        // Create a new secret file entry in the database
        const newFile = new FileModel({
          name: req.file.originalname, // Original file name
          userId,
          folder: folderId,
          filePath: relativeFilePath, // Store the relative file path
          fileType: req.file.mimetype, // MIME type of the uploaded file
          modifiedFileName: req.file.filename, // Store the modified file name (with timestamp)
          fileSize,
          isSecret: true, // Mark this file as secret
        });
  
        await newFile.save();
  
        // Return response to the client
        res.status(201).json({
          message: 'Secret image file added successfully',
          file: newFile,
          fileUrl: fileUrl, // Include the file URL in the response
        });
      } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path); // Delete file in case of an error
        res.status(500).json({ error: 'Failed to upload secret image', details: error.message });
      }
    },
  ];
  
  

// Add Secret PDF File
export const addSecretPdf = [
    upload.single('pdf'), // Middleware to handle file upload
    async (req, res) => {
      const { pin, folderId } = req.body;
      const userId = req.headers.user_id;
  
      try {
        // Step 1: Check if the file is uploaded
        if (!req.file) {
          return res.status(400).json({ error: 'No PDF file uploaded' });
        }
  
        // Check if the uploaded file is a PDF
        const fileType = checkFileType(req.file);
        if (fileType !== 'pdf') {
          fs.unlinkSync(req.file.path); // Delete invalid file
          return res.status(400).json({ error: 'Selected file is not a PDF' });
        }
  
        // Check if the folderId is provided
        if (!folderId) {
          fs.unlinkSync(req.file.path); // Delete file if no folderId
          return res.status(400).json({ error: 'Folder ID is required' });
        }
  
        // Step 2: Check if PIN is provided and validate it
        if (!pin) {
          fs.unlinkSync(req.file.path); // Delete file if no PIN
          return res.status(400).json({ error: 'PIN is required to store secret PDFs' });
        }
  
        // Validate PIN
        const user = await UsersModel.findById(userId);
        if (!user) {
          fs.unlinkSync(req.file.path); // Delete file if user not found
          return res.status(404).json({ error: 'User not found' });
        }
  
        const isPinValid = await bcrypt.compare(pin, user.pinHash);
        if (!isPinValid) {
          fs.unlinkSync(req.file.path); // Delete file if PIN is invalid
          return res.status(403).json({ error: 'Invalid PIN. Access denied.' });
        }
  
        // Step 3: If PIN is valid, insert the file into the database
        const relativeFilePath = path.join('storage', userId.toString(), req.file.filename);
  
        // Generate the file URL for the frontend
        const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${req.file.filename}`;
        const fileSize = req.file.size; // File size in bytes
  
        // Create a new secret file entry in the database
        const newFile = new FileModel({
          name: req.file.originalname, // Original file name
          userId,
          folder: folderId,
          filePath: relativeFilePath, // Store the relative file path
          fileType: req.file.mimetype, // MIME type of the uploaded file
          modifiedFileName: req.file.filename, // Store the modified file name (with timestamp)
          fileSize,
          isSecret: true, // Mark this file as secret
        });
  
        await newFile.save();
  
        // Return response to the client
        res.status(201).json({
          message: 'Secret PDF file added successfully',
          file: newFile,
          fileUrl: fileUrl, // Include the file URL in the response
        });
      } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path); // Delete file in case of an error
        res.status(500).json({ error: 'Failed to upload secret PDF', details: error.message });
      }
    },
  ];
  
  