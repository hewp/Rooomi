const User = require('./userModel.js');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = {
  signup(userCreds, callback) {
    User.findOne({ username: userCreds.username }, (err, user) => {
      if (err) { callback(err, null); }
      if (user) { callback(null, null); }
      if (!user) {
        User.create({
          username: userCreds.username,
          password: userCreds.password,
          house: userCreds.house,
        }).then(callback(null, { username: userCreds.username, house: userCreds.house }));
      }
    });
  },

  getAllUsers(house, callback) {
    User
      .find()
      .where('house').equals(house)
      .then(callback);
  },

  updateHouse(userObj, callback) {
    User
      .update({ username: userObj.username },
        { $set: { house: userObj.house } },
      () => User.findOne({ username: userObj.username })
      .then((user) => callback(user)));
  },
};
