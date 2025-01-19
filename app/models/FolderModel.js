import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: {type: String,required: true},
  userId:{type: mongoose.Schema.Types.ObjectId,require:true},
},
{timestamps:true,versionKey:false}
);

const Folder = mongoose.model('folders', folderSchema);
export default Folder;
