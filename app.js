//import applications all packages
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from 'mongoose';
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import * as path from "path";
import router from "./routes/api.js";
import authRoutes from "./routes/authRoute.js";
import { MONGODB_CONNECTION,PORT,MAX_JSON_SIZE,URL_ENCODER,WEB_CACHE,REQUEST_LIMIT_NUMBER,REQUEST_LIMIT_TIME, JWT_SECRET} from "./app/config/config.js";

import { lutimes } from "fs";
import passport from 'passport';
import session from 'express-session';

import { configureGoogleStrategy } from './app/config/passport.js';




const app = express();
//Global Application Middleware
app.use(cors());
app.use(express.json({limit: MAX_JSON_SIZE}));
app.use(express.urlencoded({extended: URL_ENCODER}));
app.use(hpp());
app.use(helmet());
app.use(cookieParser());


// Configure Passport.js
configureGoogleStrategy(passport);
app.use(session({ secret: JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// app.use(fileupload({
//     limits: {fileSize: 50*1024*1024}
// }));

//Rate Limiter
const limiter = rateLimit({windowMs: REQUEST_LIMIT_TIME,max: REQUEST_LIMIT_NUMBER});
app.use(limiter);

//Web Caching Mechanism
app.set('etag',false);

//MongoDB Connection
mongoose.connect(MONGODB_CONNECTION)
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((error)=>{
    console.log(error);
});

//Set API Route
app.use('/api',router);
app.use("/api/auth", authRoutes);

//Set Application Storage
app.use(express.static('storage'));


//Run Your Express Backend Project
app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}`);
});