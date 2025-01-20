import UsersModel from "../models/UsersModel.js";
import EmailSend from "../utility/emailUtility.js";
import { EncodeToken,DecodeToken } from "../utility/tokenUtility.js";
import FileModel from "../models/FileModel.js";
import FolderModel from "../models/FolderModel.js";
import { upload } from "../config/multerConfig.js";
import path from 'node:path';
import mongoose from "mongoose";
import { SignUpService,LoginService,
    VerificationCodeService,CodeVerifyService,
    ResetPasswordService, 
    DeleteService,ChangePasswordService,
    ProfileService,
    getStorageStatsService,recentItemService} from "../services/UserService.js";


export const SignUp = async(req,res)=>{
    let result=await SignUpService(req,res);
    return res.status(200).json(result);
}

export const Login = async(req,res)=>{
    let result=await LoginService(req,res);
    return res.status(200).json(result);
    
}

export const Profile = async(req,res)=>{
    let result=await ProfileService(req);
    return res.status(200).json(result);
}

// Add Image File
export const editProfile = [
    upload.single('image'),
    async (req, res) => {
      const { username } = req.body;
      const userId = req.headers.user_id;
      console.log(username)
      try {
        if (!req.file && username.length===0) {
          return res.status(400).json({ error: 'No image file seleted or username empty ' });
        }

  
        // Construct the relative file path
        let relativeFilePath;
        if(req.file) relativeFilePath = path.join('storage', userId.toString(), req.file.filename);
  
        // Generate the file URL for the frontend
        //const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${req.file.filename}`;

        const user = await UsersModel.findById(userId);
        user.username=username||user.username;
        user.profilePicturePath=relativeFilePath||null;
        await user.save();
  
  
        // Return response to the client
        res.status(201).json({
          message: 'Image file added successfully',
          result:user
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to upload image', details: error.message });
      }
    },
];

export const EmailVerify = async(req,res)=>{
    let result=await VerificationCodeService(req,res);
    return res.status(200).json(result);
}

export const CodeVerify = async(req,res)=>{
    let result=await CodeVerifyService(req,res);
    return res.status(200).json(result);
}

export const ResetPassword = async(req,res)=>{
    let result=await ResetPasswordService(req,res);
    return res.status(200).json(result);
}

export const Logout = (req, res) => {
    res.clearCookie('authToken'); // Clear the token cookie if stored there
    return res.status(200).json({ message: 'Logout successful' });
};

export const Delete = async(req, res) => {
    let result=await DeleteService(req,res);
    return res.status(200).json(result);
};



export const ChangePassword=async(req,res)=>{
    let result=await ChangePasswordService(req,res);
    return res.status(200).json(result);
}


export const EditProfile=async(req,res)=>{
    let result=await ChangePasswordService(req,res);
    return res.status(200).json(result);
}


export const getStorageStats = async (req, res) => {
    await getStorageStatsService(req,res);
};

// Get recent files or folders for a user
export const recentItems = async (req, res) => {
    await recentItemService(req,res);
};
  
  