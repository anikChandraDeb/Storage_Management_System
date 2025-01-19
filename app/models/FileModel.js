import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {type: String,required: true},
  userId:{type: mongoose.Schema.Types.ObjectId,require:true},
  folder: {
    type: mongoose.Schema.Types.ObjectId,require:true // The folder where this file is stored
  },
  filePath: {
    type: String, // Path to the file in the storage folder
    required: true,
  },
  fileType: {
    type: String, // e.g., 'image/png', 'application/pdf'
    required: true,
  }
},
{timestamps:true,versionKey:false}
);

const FileModel = mongoose.model('files', fileSchema);
export default FileModel;
