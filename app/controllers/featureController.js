import {DecodeToken, EncodeToken} from "../utility/tokenUtility.js";
import EmailSend from "../utility/emailUtility.js";
import * as path from "node:path";

export const TokenEncode=async (req,res)=>{
    let result = EncodeToken("anik.deb@gmail.com","123");
    res.json({"Token": result});
}

export const TokenDecode=async (req,res)=>{
    let result = DecodeToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuaWsuZGViQGdtYWlsLmNvbSIsInVzZXJfaWQiOiIxMjMiLCJpYXQiOjE3MzI5NzgyMTEsImV4cCI6MTczNTU3MDIxMX0.8IdJGhjvBAq84WFf1lLSNkOvBIQZ_EbOC8VP_USRmkA");
    res.json({"Decode-result":result});
}

export const Email=async (req,res)=>{
    let EmailTo="istiak2147@gmail.com,";
    let EmailText="Nothing";
    let EmailSubject="Read the important jocks";
    let EmailHTMLBody="স্যার: পরীক্ষার আগে কী করো? ছাত্র: প্রশ্নপত্র ফাঁসের জন্য প্রার্থনা।";
    let result= await EmailSend(EmailTo,EmailText,EmailSubject,EmailHTMLBody);
    res.json({"EmailStatus":result});
}

export const Profile=async (req,res)=>{
    res.json({"status":"ok"});
}

export const CreateCookies=async (req,res)=>{

    let cookieOptions={
        expires: new Date(Date.now()+3600*1000), //1hour = 3600*1000 milisecond    
        httpOnly:true,
        sameSite:true
    };
    let data="anik.deb@gmail.com";
    let cookieName="email";

    res.cookie(cookieName,data,cookieOptions);
    res.json({"status":"Ok"});
}
export const RemoveCookies=async (req,res)=>{

    let cookieOptions={
        expires: new Date(Date.now()-3600*1000), //minus for remove cookie
        httpOnly:true,
        sameSite:true
    };
    let data="";
    let cookieName="email";

    res.cookie(cookieName,data,cookieOptions);
    res.json({"status":"Ok"});
}

export const FileUpload = async (req, res) => {
    try {
        // Check if files exist
        if (!req.files || !req.files.myFile) {
            return res.status(400).json({ status: "No file uploaded" });
        }

        // Catch the file
        let myFile = req.files['myFile']; //req.files.myFile
        console.log(myFile);
        let myFileName = myFile.name;

        // Prepare File Storage Path
        let myFilePath = path.resolve(process.cwd(), 'storage', myFileName);

        // Move the file to the destination
        myFile.mv(myFilePath, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: "File not uploaded" });
            }
            res.json({ status: "File uploaded successfully", filePath: myFilePath });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Server error" });
    }
};
