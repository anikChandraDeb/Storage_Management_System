import FileModel from '../models/FileModel.js';
import multer from 'multer';
import path from 'node:path';
import fs from 'fs';
import mime from 'mime-types'; // Optional, to check file extension if needed
import {upload} from '../config/multerConfig.js';
import { listOfImagesServices, listOfNotesServices, listOfPDFsServices } from '../services/FileService.js';





// List all notes (text files) for a user
export const listOfNotes = async (req, res) => {
    await listOfNotesServices(req,res);
};
  
// List all image files for a user
export const listOfImages = async (req, res) => {
    await listOfImagesServices(req,res);
};
  
// List all PDF files for a user
export const listOfPDFs = async (req, res) => {
    await listOfPDFsServices(req,res);
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
  

// Add Image File
export const addImage = [
  upload.single('image'), // Middleware to handle file upload
  async (req, res) => {
    const { folderId } = req.body;
    const userId = req.headers.user_id;

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      const fileType = checkFileType(req.file);

      if (fileType != 'image') {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({ error: 'Selected File not an image' });
      }

      if (!folderId) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Folder ID is required' });
      }

      // Construct the relative file path
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
        fileSize
      });

      await newFile.save();

      // Return response to the client
      res.status(201).json({
        message: 'Image file added successfully',
        file: newFile,
        fileUrl: fileUrl, // Include the file URL in the response
      });
    } catch (error) {
      if(req.file) fs.unlinkSync(req.file.path);

      res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
  },
];


// Add Pdf File
export const addPdf = [
    upload.single('pdf'), // Middleware to handle file upload
    async (req, res) => {
      const { folderId } = req.body;
      const userId = req.headers.user_id;
  
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No pdf file uploaded' });
        }
  
        const fileType = checkFileType(req.file);
  
        if (fileType != 'pdf') {
          fs.unlinkSync(req.file.path);

          return res.status(400).json({ error: 'Selected File not a pdf' });
        }
  
        if (!folderId) {
          fs.unlinkSync(req.file.path);

          return res.status(400).json({ error: 'Folder ID is required' });
        }
  
        // Construct the relative file path
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
          fileSize
        });
  
        await newFile.save();
  
        // Return response to the client
        res.status(201).json({
          message: 'Pdf file added successfully',
          file: newFile,
          fileUrl: fileUrl, // Include the file URL in the response
        });
      } catch (error) {
        if(req.file) fs.unlinkSync(req.file.path);

        res.status(500).json({ error: 'Failed to upload pdf', details: error.message });
      }
    },
  ];

  // Add Image File
export const addNote = [
    upload.single('text'), // Middleware to handle file upload
    async (req, res) => {
      const { folderId } = req.body;
      const userId = req.headers.user_id;
  
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No text file uploaded' });
        }
  
        const fileType = checkFileType(req.file);
        console.log(fileType)
        if (fileType != 'text') {
          fs.unlinkSync(req.file.path);

          return res.status(400).json({ error: 'Selected File not a text' });
        }
  
        if (!folderId) {
          fs.unlinkSync(req.file.path);

          return res.status(400).json({ error: 'Folder ID is required' });
        }
  
        // Construct the relative file path
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
          fileSize
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

        res.status(500).json({ error: 'Failed to upload text', details: error.message });
      }
    },
];


  



