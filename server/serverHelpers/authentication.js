const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const User = require('../db/user/userModel.js');
const FBStrategy = require('passport-facebook').Strategy;
// const token;
// const ip;

passport.use(new Strategy(
  (username, password, cb) => {
    User.findOne({ username }, (err, user) => {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password !== password) { return cb(null, false); }
      return cb(null, user);
    });
  })
);

passport.use(new FBStrategy({
  clientID: '169564226797360',
  clientSecret: 'f9a6e6f6a452fb18fa720c89d5ced750',
  callbackURL: '/login/facebook/return',
  profileFields: ['id', 'first_name', 'photos', 'emails', 'displayName', 'about', 'gender'],
  auth_type: 'reauthenticate',
  // passReqToCallback: true,
},
  (accessToken, refreshToken, profile, cb) => {
    // console.log(req);
    // ip = req.ip;
    // token = accessToken;
    User.findOne({ fbID: profile.id }).exec()
    .then((user) => {
      if (!user) {
        User.create(
          { fbID: profile.id,
            username: profile.displayName.split(' ')[0],
            avatar: profile.photos[0].value,
          })
        .then((data) => {
          console.log(data);
          cb(null, data) 
        });
        
      }
      else {
        cb(null, user);
      }
    });
  }
));

passport.serializeUser(function(user, cb) {
  // cb(null, user._id);
  cb(null, user);
});

passport.deserializeUser(function(id, cb) {
  cb(null, id);
  // User.findOne({_id: id}, function (err, user) {
  //   if (err) { return cb(err); }
  //   cb(null, user);
  // });
});

module.exports = {
  passport,
};
