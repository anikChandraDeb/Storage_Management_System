import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: {type: String,required: true},
  userId:{type: mongoose.Schema.Types.ObjectId,require:true},
  favorite: {type: Boolean,default: false},
},
{timestamps:true,versionKey:false}
);

const Folder = mongoose.model('folders', folderSchema);
export default Folder;
