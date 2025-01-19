import UsersModel from "../models/UsersModel.js";
import EmailSend from "../utility/emailUtility.js";
import { EncodeToken,DecodeToken } from "../utility/tokenUtility.js";
import { SignUpService,LoginService,
    VerificationCodeService,CodeVerifyService,
    ResetPasswordService, 
    DeleteService,ChangePasswordService,
    ProfileService} from "../services/UserService.js";



export const SignUp = async(req,res)=>{
    let result=await SignUpService(req);
    return res.status(201).json(result);
}

export const Login = async(req,res)=>{
    let result=await LoginService(req,res);
    return res.status(200).json(result);
    
}

export const Profile = async(req,res)=>{
    let result=await ProfileService(req);
    return res.status(200).json(result);
}

export const ProfileUpdate = async(req,res)=>{
    try{
        let reqBody=req.body;
        let user_id=req.headers['user_id'];
        
        let data = await UsersModel.updateOne({"_id":user_id},reqBody);
        return res.json({"Status":"Success","Message":"User Profile Update Successfully"});

    }catch(error){
        return res.json({"Status":"fail","Message":error.toString()});
    }
    
}

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

