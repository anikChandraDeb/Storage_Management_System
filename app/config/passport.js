import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,JWT_SECRET } from './config.js';
import UsersModel from '../models/UsersModel.js';

export const configureGoogleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5050/api/auth/google/callback",
      },
      async(accessToken, refreshToken, profile, done) => {
        // Logic to find or create a user in the database
        try {
            // Check if the user already exists in the database
            let user = await UsersModel.findOne({ email:profile.emails[0].value,googleId: profile.id });
    
            if (!user) {
              // If not, create a new user
              let user =await UsersModel.create({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos[0].value,
              });
            }
    
            done(null, user);
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
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });  
};
