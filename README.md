# Storage Management System

The Storage Management System is a backend application for efficient file and folder management. It features secure authentication, Google login, file uploads, advanced sorting, favorites, and user account management. With added security for restricted content, it ensures organized and reliable storage solutions.


# Key Features of Storage Management System

## Folder Management  
- Create folders to organize files systematically.  
- List all folders for easy navigation.  
- Rename folders to maintain clarity.  
- Delete folders to remove unnecessary content.  

## File Management  
- Upload files of various types, including images, PDFs, and notes.  
- Retrieve files quickly with optimized endpoints.  

## Advanced Features  
- Mark items as favorites for quick access.  
- Duplicate files or folders easily.  
- Sort items by date for better organization.  
- Access recently used items for convenience.  

## User Account Management  
- Sign up for personalized access.  
- Log in to manage your account securely.  
- Recover lost passwords with ease.  
- Edit user profiles to update information.  
- View detailed storage statistics for better file management.  

## Secure Access  
- Set PINs to restrict access to sensitive content.  
- Manage secret notes securely.  
- Add secret images and PDFs with extra protection.  


## API Endpoints
## User Management
- **/SignUp**: User registration.
- **/Login**: User login.
- **/Profile**: View user profile details (requires authentication).
- **/ProfileUpdate**: Update user profile (requires authentication).
- **/EmailVerify**: Verify user email.
- **/ResetPassword**: Reset user password.
- **/ChangePassword**: Change user password (requires authentication).
- **/Logout**: User logout (requires authentication).

## File Management
- **/createFolder**: Create a new folder (requires authentication).
- **/listOfFolders**: List all folders (requires authentication).
- **/addImage**: Upload an image file (requires authentication).
- **/addPdf**: Upload a PDF file (requires authentication).
- **/addNote**: Upload a note file (requires authentication).
- **/listOfNotes**: List all note files (requires authentication).
- **/listOfImages**: List all image files (requires authentication).
- **/listOfPDFs**: List all PDF files (requires authentication).

## Folder/File Operations
- **/listOfItemByDate**: List files and folders sorted by date (requires authentication).
- **/rename/:id/:type**: Rename a file or folder (requires authentication).
- **/duplicate/:id/:type**: Duplicate a file or folder (requires authentication).
- **/delete/:id/:type**: Delete a file or folder (requires authentication).

## Favorites
- **/addFavorite/:id/:type**: Add a file or folder to favorites (requires authentication).
- **/removeFavorite/:id/:type**: Remove a file or folder from favorites (requires authentication).
- **/listFavoriteItem**: List all favorite items (requires authentication).

https://documenter.getpostman.com/view/38239023/2sAYQcEqRm#dee8d1e5-4e53-4926-94ed-06968ef25202




## Folder and File Structure

Files and folders are stored in the `storage` directory by default. MongoDB is used to manage metadata like folder hierarchy, file names, and ownership.

## Project Structure

```
storage-management-system/
├── app/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   │   ├── passport.js
│   │   └── config.js
│   ├── utility/
│   ├── service/
│   └── middlewares/
├── storage/ (Files stored here)
├── routes/ (Routes in the root)
├── app.js
├── package.json
└── README.md
```

## Security Considerations

- **JWT Tokens**: Tokens are used for authorization and should be stored securely (e.g., HTTP-only cookies).
- **Environment Variables**: Do not hardcode sensitive credentials in the code; they are centralized in `config.js`.
- **Unique File Names**: Uploaded files are stored with unique names to avoid conflicts.

## Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/anikChandraDeb/Storage_Management_System
   cd Storage_Management_System
   ```

2. **Install Dependencies**

   Install all the required npm packages:

   ```bash
   npm install
   ```

3. **Configuration**

   In  `config.js` file located in the `app/config` directory set these variable :

   ```
   #For Google authentication(SignUp with Google)

   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secre"
   
   #MongoDB Connection

   MONGODB_CONNECTION="your mongodb connection"
   
   #Set Email Server Info to work Reset Password Email Verification Perfectly

   EMAIL_HOST="email server host"
   EMAIL_PORT="port"
   EMAIL_USER="email server account user"
   EMAIL_PASSWORD="password"
   MAIL_ENCRYPTION="encryption method"
   ```

   Replace `your_google_client_id`, `your_google_client_secret`, and other placeholders with your actual credentials.

4. **Set Up MongoDB**

   Ensure MongoDB is running on your local machine or connect to a cloud instance. Update the `MONGO_URI` in the `config.js` file if necessary.

   Create a new Database name `storage` and upload the dummy data located in the dummy_data directory(there are three tables `files`,`users`,`folders`)

5. **Run the Application**

   Start the server:

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:5050`.

6. **Run in Development Mode**

   To run the app in development mode with live reload:

   ```bash
   nodemon app.js
   ```



## Future Improvements

- Add role-based access control (RBAC).
- Implement search functionality for files and folders.
- Optimize file storage with cloud solutions like AWS S3 or Google Cloud Storage.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to the project by submitting issues or pull requests!
