// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Try to find user by Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // If not found, try by email
            const email = profile.emails && profile.emails[0].value;
            user = await User.findOne({ email });

            // If still not found, create new user
            if (!user) {
              user = await User.create({
                name: profile.displayName,
                email,
                googleId: profile.id,
                provider: 'google',
              });
            } else {
              // Link existing local account with Google
              user.googleId = profile.id;
              user.provider = 'google';
              await user.save();
            }
          }

          return done(null, user);
        } catch (err) {
          console.error('GoogleStrategy Error:', err.message);
          return done(err, null);
        }
      }
    )
  );
};
