//CRUD-CREATE READ UPDATE DELETE
//Create todo
export const createTask= async (req,res)=>{
    return res.json({message:'Task Created Successfully'});
}
//Create read
export const readTask= async (req,res)=>{
    return res.json({message:'Task Read Successfully'});
}
//Create update
export const updateTask= async (req,res)=>{
    return res.json({message:'Task Update Successfully'});
}
//Create Delete
export const deleteTask= async (req,res)=>{
    return res.json({message:'Task Delete Successfully'});
}