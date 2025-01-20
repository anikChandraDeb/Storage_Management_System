import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import FileModel from '../models/FileModel.js';
import FolderModel from "../models/FolderModel.js";
import UsersModel from '../models/UsersModel.js';
import { upload } from '../config/multerConfig.js';
import mime from 'mime-types';


export const setPinService = async (req, res) => {
  const userId = req.headers.user_id; 
  const { pin } = req.body;

  try {

    if (!pin || pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
      return res.status(400).json({
        Status: 'fail',
        message: 'PIN must be a numeric value between 4 and 6 digits.',
      });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);


    const user = await UsersModel.findByIdAndUpdate(
      userId,
      { pinHash: hashedPin },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ Status: 'fail', message: 'User not found.' });
    }

    res.status(200).json({
      Status: 'success',
      message: 'PIN set successfully.',
    });
  } catch (error) {
    console.error('Error setting PIN:', error);
    res.status(500).json({
      Status: 'fail',
      message: 'Failed to set PIN.',
      details: error.message,
    });
  }
};

export const getInSecretService = async (req, res) => {
    const userId = req.headers.user_id; 
    const { pin } = req.body;
  
    try {
      if (!pin) {
        return res.status(400).json({
          Status: 'fail',
          message: 'PIN is required to access secret files and folders.',
        });
      }
  
      const user = await UsersModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          Status: 'fail',
          message: 'User not found.',
        });
      }
  
      // Verify the PIN
      const isPinValid = await bcrypt.compare(pin, user.pinHash);
      if (!isPinValid) {
        return res.status(403).json({
          Status: 'fail',
          message: 'Invalid PIN. Access denied.',
        });
      }
      
      // Fetch secret files and folders for the user
      const secretFiles = await FileModel.find({ userId, isSecret: true });
      const secretFolders = await FolderModel.find({ userId, isSecret: true });
  
      // Combine and sort by creation date (ascending)
      const secretItems = [...secretFiles, ...secretFolders].sort(
        (a, b) => a.createdAt - b.createdAt
      );
  
      if (secretItems.length === 0) {
        return res.status(404).json({
          Status: 'fail',
          message: 'No secret files or folders found.',
        });
      }
  
      // Add file URLs to the secret files
      const secretFilesWithUrls = secretFiles.map(file => {
        const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId}/${file.modifiedFileName}`;
        return {
          ...file._doc,
          fileUrl,
        };
      });
  
      // Respond with the combined data
      res.status(200).json({
        Status: 'success',
        message: 'Secret files retrieved successfully.',
        data: [...secretFilesWithUrls, ...secretFolders],
      });
    } catch (error) {
      console.error('Error accessing secret files or folders:', error);
      res.status(500).json({
        Status: 'fail',
        message: 'Failed to retrieve secret files or folders.',
        details: error.message,
      });
    }
};