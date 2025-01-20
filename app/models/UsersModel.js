import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String,default:1 }, // Present only for Google accounts
  profilePicturePath: { type: String },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        // Password is required only if googleId is not present
        return this.googleId || (value && value.length > 0);
      },
      message: "Password is required for non-Google accounts.",
    },
  },
  pinHash:{type:String,},
  storageLimit: { type: Number, default: 15 * 1024 * 1024 * 1024 }, // 15 GB
  usedStorage: { type: Number, default: 0 },
  otp:{type:String,default: 0}
},
{timestamps:true,versionKey:false}
);

export default mongoose.model("users", userSchema);
