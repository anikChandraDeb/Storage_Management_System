import FileModel from '../models/FileModel.js';
import multer from 'multer';
import path from 'node:path';
import fs from 'fs';
import mime from 'mime-types'; 
import {upload} from '../config/multerConfig.js';


export const listOfNotesServices = async (req, res) => {
    const  userId  = req.headers.user_id;  
    try {
      const notes = await FileModel.find({ userId: userId, fileType: "text/plain", isSecret:false });
  
      if (notes.length === 0) {
        return res.status(404).json({ Status: "fail", message: "No notes found" });
      }
      const notesWithUrls = notes.map(note => {
        const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId}/${note.modifiedFileName || note.name}`;
        return {
          ...note._doc,
          fileUrl, 
        };
      });


      res.status(200).json({
        Status: "success",
        notes: notesWithUrls
      });
    } catch (error) {
      res.status(500).json({
        Status: "fail",
        error: "Failed to retrieve notes",
        details: error.message
      });
    }
  };
  
// List all image files for a user
export const listOfImagesServices = async (req, res) => {
    const  userId  = req.headers.user_id;  
    try {
      const images = await FileModel.find({ userId: userId, fileType: { $regex: /^image\// }, isSecret:false });
  
      if (images.length === 0) {
        return res.status(404).json({ Status: "fail", message: "No images found" });
      }

const imagesWithUrls = images.map(image => {
    const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${image.modifiedFileName}`;
    return {
        ...image._doc,
        fileUrl,
        };
    });
    
    res.status(200).json({
        Status: "success",
        images: imagesWithUrls
    });
    } catch (error) {
      res.status(500).json({
        Status: "fail",
        error: "Failed to retrieve images",
        details: error.message
      });
    }
  };
  

export const listOfPDFsServices = async (req, res) => {
    const  userId  = req.headers.user_id;
  
    try {
      const pdfs = await FileModel.find({ userId: userId, fileType: "application/pdf", isSecret:false });
  
      if (pdfs.length === 0) {
        return res.status(404).json({ Status: "fail", message: "No PDFs found" });
      }
  

    const pdfsWithUrls = pdfs.map(pdf => {
        const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${pdf.modifiedFileName}`;
        return {
        ...pdf._doc,
        fileUrl, 
        };
    });
    
    res.status(200).json({
        Status: "success",
        pdfs: pdfsWithUrls
    });
    } catch (error) {
      res.status(500).json({
        Status: "fail",
        error: "Failed to retrieve PDFs",
        details: error.message
      });
    }
  };
  
