# Storage Management System

The Storage Management System is a Node.js-based backend application for managing files and folders, supporting features like user authentication, folder hierarchy, and file uploads. This system uses MongoDB as the database and integrates with Google OAuth for authentication.


## Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/storage-management-system.git
   cd storage-management-system
   ```

2. **Install Dependencies**

   Install all the required npm packages:

   ```bash
   npm install
   ```

3. **Configuration**

   In  `config.js` file in the `app/config` directory set these variable :

   ```
   #For Google authentication
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secre"
   
   #MongoDB Connection
   MONGODB_CONNECTION="your mongodb connection"
   
   #Set Email Server to work Reset Password Email Verification Perfectly
   EMAIL_HOST="email server host"
   EMAIL_PORT="port"
   EMAIL_USER="email server account user"
   EMAIL_PASSWORD="password"
   MAIL_ENCRYPTION="encryption method"
   ```

   Replace `your_google_client_id`, `your_google_client_secret`, and other placeholders with your actual credentials.

4. **Set Up MongoDB**

   Ensure MongoDB is running on your local machine or connect to a cloud instance. Update the `MONGO_URI` in the `config.js` file if necessary.

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

## API Endpoints
Show in the postman collection and documentation(click below)
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
│   └── utility/
|   |
├── storage/ (Files stored here)
├── app.js
├── package.json
└── README.md
```

## Security Considerations

- **JWT Tokens**: Tokens are used for authorization and should be stored securely (e.g., HTTP-only cookies).
- **Environment Variables**: Do not hardcode sensitive credentials in the code; they are centralized in `config.js`.
- **Unique File Names**: Uploaded files are stored with unique names to avoid conflicts.

## Future Improvements

- Add role-based access control (RBAC).
- Implement search functionality for files and folders.
- Optimize file storage with cloud solutions like AWS S3 or Google Cloud Storage.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to the project by submitting issues or pull requests!
