const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/index');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    user_name: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      maxlength: 100,
    },
    first_name: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      maxlength: 100,
    },
    last_name: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      maxlength: 100,
    },
    email: {
      email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
      },
    },
    hash: {
      type: String,
      required: true,
    },
    membership: {
      status: {
        type: Boolean,
        default: false,
      },
      pass: String,
    },
    admin: {
      status: {
        type: Boolean,
        default: false,
      },
      pass: String,
    },
  },
  { timestamps: true },
);

UserSchema.virtual('fullName').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

UserSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.isAdmin = function () {
  return this.admin.status;
};

UserSchema.methods.isMember = function () {
  return this.membership.status;
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
