const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
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
      pass: String,
      status: Boolean,
    },
    admin: {
      pass: String,
      status: Boolean,
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

module.exports = mongoose.model('Author', UserSchema);
