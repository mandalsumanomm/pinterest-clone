const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterest-clone");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: String,
  email: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  profileImage: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  dp: { type: String, default: 'default.jpg' }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
