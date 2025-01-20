import { renameService,deplicateService, 
    DeleteService,listOfItemByDateService } from "../services/FileFolderService.js";



export const rename = async (req, res) => {
    await renameService(req,res);
};



export const duplicate = async (req, res) => {
    await deplicateService(req,res);
};
  

// Combined method for file and folder operations
export const Delete = async (req, res) => {
    await DeleteService(req,res);
};
  

// Get files or folders for a specific date
export const listOfItemByDate = async (req, res) => {
    await listOfItemByDateService(req,res);
};
  
  