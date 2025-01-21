import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } from './config.js';
import UsersModel from '../models/UsersModel.js';
import path from 'node:path';
import fs from 'fs';

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');

export const configureGoogleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5050/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Ensure the user is logged in via Google by checking if profile exists
          if (profile) {

            let user = await UsersModel.findOne({ email: profile.emails[0].value });

            // If the user does not exist, create a new user
            if (!user) {
              user = await UsersModel.create({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos[0].value,
              });

              // Get userId (assuming it is in the result object)
              const userId = user._id;

              // Define the storage folder path (two levels above)
              const storagePath = path.join(__dirname, "../../storage", userId.toString());

              // Create the folder for the user if it doesn't exist
              fs.mkdirSync(storagePath, { recursive: true });
            }
            
            done(null, user);
          } else {
            done(new Error("Google login failed"), null);
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // Serialize user for session handling
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UsersModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
