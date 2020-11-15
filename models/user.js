const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const Post = require('./post');
const { secret } = require('../config/index');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      maxlength: 100,
    },
    firstName: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      maxlength: 100,
    },
    lastName: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      maxlength: 100,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['basic', 'member', 'admin'],
      default: 'basic',
    },
    memberPass: String,
    adminPass: String,
  },
  { timestamps: true },
);

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`;
});

UserSchema.pre('findByIdAndRemove', async () => {
  try {
    return await Post.remove({
      _id: { $in: this.posts },
    });
  } catch (err) {
    return err;
  }
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

UserSchema.methods.isMember = function () {
  return (this.role === 'admin' || this.role === 'member');
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000, 10),
  }, secret);
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('User', UserSchema);
