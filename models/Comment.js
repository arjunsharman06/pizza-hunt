const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// Replying schema : creating the sub-document
const ReplySchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment _id
    // Need to import Types at the top
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    replyBody: {
      type: String,
      trim: true,
    },
    writtenBy: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  // Telling schema that it can use virtuals.
  {
    toJSON: {
      getters: true,
    },
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true,
    },
    commentBody: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    //  association of  replies with comments
    // Replies is directly neseted in comments.
    // it not being ref like the pizza - comments
    replies: [ReplySchema],
  },
  // Telling schema that it can use virtuals.
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Virtual
CommentSchema.virtual('replyCount').get(function () {
  return this.replies.length;
});

// create the Comment model using the CommentSchema
const Comment = model('Comment', CommentSchema);

module.exports = Comment;
