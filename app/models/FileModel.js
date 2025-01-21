import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  folder: { type: mongoose.Schema.Types.ObjectId },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  modifiedFileName: { type: String, required: true },
  fileSize:{type:Number,require:true},
  favorite: {type: Boolean,default: false},
  isSecret:{type:Boolean,default:false}
}, { timestamps: true,versionKey:false });

const FileModel = mongoose.model('File', fileSchema);

export default FileModel;
