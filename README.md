# Storage Management System

The Storage Management System is a Node.js-based backend application for managing files and folders, supporting features like user authentication, folder hierarchy, and file uploads. This system uses MongoDB as the database and integrates with Google OAuth for authentication.

## Features

- User Authentication (Email/Password and Google OAuth)
- File Upload and Download
- Folder Management (Nested Structure)
- JWT-Based Authorization
- Secure File Handling with Unique Identifiers

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)

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

3. **Environment Configuration**

   Create a `.env` file in the root directory and add the following configurations:

   ```env
   PORT=5050
   MONGO_URI=mongodb://localhost:27017/storage_management
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   ```

   Replace `your_google_client_id`, `your_google_client_secret`, and other placeholders with your actual credentials.

4. **Set Up MongoDB**

   Ensure MongoDB is running on your local machine or connect to a cloud instance. Update the `MONGO_URI` in the `.env` file if necessary.

5. **Run the Application**

   Start the server:

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:5050`.

6. **Run in Development Mode**

   To run the app in development mode with live reload:

   ```bash
   npm install -g nodemon
   nodemon app.js
   ```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user.
- **POST** `/api/auth/login` - Log in with email and password.
- **GET** `/api/auth/google` - Log in with Google.
- **GET** `/api/auth/logout` - Log out the user.

### File Management

- **POST** `/api/files/upload` - Upload a file.
- **GET** `/api/files/:id` - Retrieve a file by ID.

### Folder Management

- **POST** `/api/folders` - Create a new folder.
- **GET** `/api/folders/:id` - Get folder details by ID.
- **PUT** `/api/folders/:id` - Update folder details.
- **DELETE** `/api/folders/:id` - Delete a folder.

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
│   │   └── passport.js
│   └── utility/
├── storage/ (Files stored here)
├── .env
├── app.js
├── package.json
└── README.md
```

## Security Considerations

- **JWT Tokens**: Tokens are used for authorization and should be stored securely (e.g., HTTP-only cookies).
- **Environment Variables**: Do not hardcode sensitive credentials in the code.
- **Unique File Names**: Uploaded files are stored with unique names to avoid conflicts.

## Future Improvements

- Add role-based access control (RBAC).
- Implement search functionality for files and folders.
- Optimize file storage with cloud solutions like AWS S3 or Google Cloud Storage.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to the project by submitting issues or pull requests!
