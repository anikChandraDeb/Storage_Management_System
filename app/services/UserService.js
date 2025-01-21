import UsersModel from "../models/UsersModel.js";
import { EncodeToken,DecodeToken } from "../utility/tokenUtility.js";
import EmailSend from "../utility/emailUtility.js";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import path from 'node:path';
import fs from 'fs';
import FileModel from "../models/FileModel.js";
import FolderModel from "../models/FolderModel.js";
import { upload } from "../config/multerConfig.js";


const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');

export const SignUpService = async (req) => {
    try {
        let reqBody = req.body;
        
        
        const salt = await bcrypt.genSalt(10);
        reqBody.password = await bcrypt.hash(reqBody.password, salt);
        
        // Create the user in the database
        let result = await UsersModel.create(reqBody);
        
        // Get userId (assuming it is in the result object)
        const userId = result._id; // Adjust according to your schema

        // Define the storage folder path (two levels above)
        const storagePath = path.join(__dirname, "../../storage", userId.toString());

        // Create the folder for the user
        fs.mkdirSync(storagePath, { recursive: true });

        return { "Status": "Success", "Message": "User registration Successfully" };
    } catch (error) {
        return { "Status": "fail", "Message": error.toString() };
    }
};


export const LoginService=async(req,res)=>{
    try{
        let reqbody=req.body;
        let data = await UsersModel.findOne({email:reqbody.email});
        if(data==null){
            return {"Status":"fail","Message":"User not found"};
        }
        else{
            let isMatch = await bcrypt.compare(reqbody.password, data.password);
            if(isMatch){
                //Login Success Token Encode
                console.log(data.email+ " "+ data._id);
                let token=EncodeToken(data['email'],data['_id']);

                res.cookie('authToken', token, { 
                    expires: new Date(Date.now() + 360000), // Set the cookie to expire in 360000ms (6 minutes)
                    httpOnly: true, 
                });
                
                
                return {"Status":"Success","Token":token,"Message":"User login Successfully"};
            }
            else return {"Status":"fail","Message":"Incorrect Password"};
        }
    }catch(error){
        return {"Status":"fail","Message":error.toString()};
    }
}

export const VerificationCodeService=async(req)=>{
    try{
        let email=req.body.email;
        let data=await UsersModel.findOne({email:email});
        
        if(data===null){
            return {"Status":"fail","Message":"User email does not exist"};
        }
        else{
            let code=Math.floor(100000+Math.random()*900000);
            let EmailTo=data['email'];
            let EmailText="Your Reset Password Code is "+code;
            let EmailSubject = "Storage Management System Password Verification Code";
            let EmailHTMLBody="";

            await EmailSend(EmailTo,EmailText,EmailSubject,EmailHTMLBody);

            let data1 = await UsersModel.updateOne({email:email},{otp:code});
            return {"Status":"Success","Message":"Password Verification Code Send Successfully, Check Email",data: data1};
        }
        

    }catch(error){
        return res.json({"Status":"fail","Message":error.toString()});
    }
}

export const CodeVerifyService=async(req)=>{
    try{
        let reqbody=req.body;

        //verify user and code
        let data=await UsersModel.findOne({email:reqbody.email,otp:reqbody.code});

        if(data===null){
            return {"Status":"fail","Message":"Wrong Verification Code"};
        }
        else{
            return {"Status":"Success","Message":"Vefification Successfully"};
        }


    }catch(error){
        return {"Status":"fail","Message":error.toString()};
    }
}

export const ResetPasswordService=async(req)=>{
    try{
        let reqBody=req.body;
        let data = await UsersModel.findOne({email:reqBody['email'],otp:reqBody['code']});
        if(data===null){
            return {"Status":"fail","Message":"Wrong Verification Code"};
        }
        else{
            await UsersModel.updateOne({email:reqBody['email']},{
                otp:"0",password:reqBody['password']
            })
            return {"Status":"Success","Message":"User Reset Password Successfully"};
        }
    }catch(error){
        return {"Status":"fail","Message":error.toString()};
    }
}

export const DeleteService=async(req)=>{
    try{
        let email=req.headers.email;
        let user_id=req.headers.user_id;
        let ObjectID=mongoose.Types.ObjectId;
        let user_id_object=new ObjectID(user_id);
        console.log(email);
        let result = await UsersModel.deleteOne({_id:user_id,email:email});
        


        if(result.deletedCount===0) return {"Status":"fail","Message":"User Delete Unsuccessful"};
        else{
            await FileModel.deleteMany({userId:user_id});
            await FolderModel.deleteMany({userId:user_id});

            // Define the user's directory path
            const userDirectory = path.join(__dirname, "../../storage", user_id.toString());

            // Delete the user's directory
            if (fs.existsSync(userDirectory)) {
                fs.rmSync(userDirectory, { recursive: true, force: true });
                console.log(`User directory deleted: ${userDirectory}`);
            } else {
                console.log(`User directory not found: ${userDirectory}`);
            }


            return {"Status":"Success","Message":"User Delete Successfully"};
        }
    }catch(error){
        return {"Status":"fail","Message":error.toString()};
    }
}

export const ChangePasswordService=async(req)=>{
    try{
        let email=req.headers.email;
        let user_id=req.headers.user_id;
        let ObjectID=mongoose.Types.ObjectId;
        let user_id_object=new ObjectID(user_id);
        
        let curPassword=req.body.curPassword;
        let newPassword=req.body.newPassword;
        console.log(curPassword);
        console.log(email)
        let result = await UsersModel.findOne({_id:user_id,email:email,password:curPassword});

        if(result===null){
            return {"Status":"fail","Message":"Current Password not Matched"};
        }
        else{
            result = await UsersModel.updateOne({_id:user_id_object,email:email},{password:newPassword});
            
            if(result.modifiedCount) return {"Status":"Success","Message":"Password Updated"};
            else return  {"Status":"fail","Message":"Password not Updated"};
        }
    }catch(error){
        return {"Status":"fail","Message":error.toString()};
    }
}

export const ProfileService=async(req)=>{
    try{
        let user_id=req.headers['user_id'];
        console.log(user_id)
        let datas = await UsersModel.find({_id:user_id},{password:0,otp:0,createdAt:0,updatedAt:0});
        // Add URLs to each file
        const datawithurls = datas.map(data => {
            const fileUrl = `${req.protocol}://${req.get('host')}/${data.profilePicturePath}`;
            return {
            ...data._doc,
            fileUrl, // Add the fileUrl to each file object
            };
        });
      
      return { "Status": "Success", "Message": "User profile Info.", "data": datawithurls };
      

    }catch(error){
        return {"Status":"fail","Message":error.toString()};
    }
}

export const getStorageStatsService = async (req, res) => {
    const userId = req.headers.user_id;
  
    try {
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  

      const totalFolders = await FolderModel.countDocuments({ userId });
      
      let ObjectID=mongoose.Types.ObjectId;
      let userId_obj=new ObjectID(userId);


      const fileStats = await FileModel.aggregate([
        { $match: { userId: userId_obj ,isSecret:false} }, // Filter files for the user
        {
          $group: {
            _id: '$fileType',
            totalFiles: { $sum: 1 }, 
            totalSize: { $sum: '$fileSize' }, 
          },
        },
      ]);
  

      const totalSpace = fileStats.reduce((acc, file) => acc + file.totalSize, 0);

      let user = await UsersModel.findById(userId);

      if (!user) {
         return res.status(404).json({ error: 'User not found' });
    }
      user.usedStorage=totalSpace;
      let storageLimit=user.storageLimit;
      let usedStorage=user.usedStorage;
      let availableStorage=storageLimit-usedStorage;
      await user.save();

      // Organizing statistics
      const stats = {
        storageLimit,
        usedStorage,
        availableStorage,
        totalFolders,
        totalSpace,
        fileDetails: {
          notes: { count: 0, size: 0 },
          pdfs: { count: 0, size: 0 },
          images: { count: 0, size: 0 },
        },
      };
  
      // Map aggregated results to file types
      fileStats.forEach((file) => {
        const { _id: fileType, totalFiles, totalSize } = file;
        if (fileType === 'text/plain') {
          stats.fileDetails.notes.count = totalFiles;
          stats.fileDetails.notes.size = totalSize;
        } else if (fileType === 'application/pdf') {
          stats.fileDetails.pdfs.count = totalFiles;
          stats.fileDetails.pdfs.size = totalSize;
        } else if (fileType.startsWith('image/')) {
          stats.fileDetails.images.count += totalFiles;
          stats.fileDetails.images.size += totalSize;
        }
      });
  
      res.status(200).json({ message: 'Storage statistics fetched successfully', stats });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch storage statistics', details: error.message });
    }
};

// Get recent files or folders for a user
export const recentItemService = async (req, res) => {
    const userId = req.headers.user_id;
  
    try {
      // Fetch recent files
      const recentFiles = await FileModel.find({ userId: userId }).sort({ createdAt: -1 }).limit(5);
      

      const recentFilesWithUrls = recentFiles.map(file => {
        const fileUrl = `${req.protocol}://${req.get('host')}/storage/${userId.toString()}/${file.modifiedFileName}`;
        return {
          ...file._doc,
          fileUrl, // Add the fileUrl to each file object
        };
      });
  
      // Fetch recent folders
      const recentFolders = await FolderModel.find({ userId: userId }).sort({ createdAt: -1 }).limit(5);

      // Combine files and folders into one array
      const recentItems = [
        ...recentFilesWithUrls, 
        ...recentFolders
      ].sort((a, b) => b.createdAt - a.createdAt);
  
      if (recentItems.length === 0) {
        return res.status(404).json({ Status: "fail", message: "No recent files or folders found" });
      }
  
      res.status(200).json({
        Status: "success",
        recentItems: recentItems
      });
    } catch (error) {
      res.status(500).json({
        Status: "fail",
        error: "Failed to retrieve recent files or folders",
        details: error.message
      });
    }
};
  