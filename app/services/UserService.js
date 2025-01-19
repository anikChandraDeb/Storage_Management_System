import UsersModel from "../models/UsersModel.js";
import { EncodeToken,DecodeToken } from "../utility/tokenUtility.js";
import EmailSend from "../utility/emailUtility.js";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';






export const SignUpService=async(req)=>{
    try{
        let reqBody=req.body;
        const salt = await bcrypt.genSalt(10);
        reqBody.password=await bcrypt.hash(reqBody.password,salt);
        let result=await UsersModel.create(reqBody);
        return {"Status":"Success","Message":"User registration Successfully"};
    }catch(error){
        return {"Status":"fail","Message":error.toString()};
    }
}


export const LoginService=async(req,res)=>{
    try{
        let reqbody=req.body;
        let data = await UsersModel.findOne({email:reqbody.email});
        if(data==null){
            return {"Status":"fail","Message":"User not found"};
        }
        else{
            let isMatch = await bcrypt.compare(reqody.password, data.password);
            if(isMatch){
                //Login Success Token Encode
                console.log(data.email+ " "+ data._id);
                let token=EncodeToken(data['email'],data['_id']);

                res.cookie('authToken', token, { 
                    expires: new Date(Date.now() + 360000), // Set the cookie to expire in 360000ms (6 minutes)
                    httpOnly: true, // Secure option (only accessible via HTTP)
                });b
                
                
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
            return {"Status":"fail","Message":"Vefification Successfully"};
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
        let data = await UsersModel.findOne({"_id":user_id});
        return {"Status":"Success","Message":"User profile Info.","data":data};

    }catch(error){
        return {"Status":"fail","Message":error.toString()};
    }
}