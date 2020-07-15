const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./user-model');
const validatePassword = require('../lib/password-tools').validatePassword;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

const verifyCallback = (email, password, done) => {
    User.findOne({ email: email })
        .then ( user => {
            console.log(user);
            if (!user) {
                console.log('!user');
                return done(null, false);
            }

            const isValid = validatePassword (password, user.hash, user.salt);

            if (!isValid) {
                console.log('!isValid');
                return done(null, false);
            } else {
                console.log('isValid');
                return done(null, user);
            }
        })
        .catch(err=>console.log(err));
  };

  const customFields = {
    usernameField: 'email',
    passwordField: 'password'};

const startegy = new LocalStrategy (customFields, verifyCallback);

passport.use(startegy);
