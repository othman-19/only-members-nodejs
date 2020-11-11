const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "can't be blank"],
      maxlength: 200,
    },
    text: {
      type: String,
      required: [true, "can't be blank"],
      maxlength: 300,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"],
    },
  },
  { timestamps: true },
);

PostSchema.virtual('url').get(function () {
  return `/post/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);
