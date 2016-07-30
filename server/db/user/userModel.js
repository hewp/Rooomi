const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fbID: String,
  username: String,
  password: { type: String, default: null },
  avatar: { type: String, default: 'http://pix.iemoji.com/images/emoji/apple/ios-9/256/pile-of-poo.png' },
  house: { type: String, default: 'Hack Reactor' },
});

module.exports = mongoose.model('User', userSchema);



