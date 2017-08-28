const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ profileId: profile.id }).then(existingUser => {
        if (existingUser) {
          console.log("user already exists");
          done(null, existingUser);
        } else {
          console.log("saving new user with profileId: ", profile.id);
          new User({ profileId: profile.id }).save().then(user => {
            done(null, user);
          });
        }
      });
    }
  )
);
