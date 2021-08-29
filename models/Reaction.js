const { Schema, model, Types } = require("mongoose");
const moment = require("moment");

const ReactionSchema = new Schema({
  reactionId: {
    type: Types.ObjectId,
    default: new Types.ObjectId(),
  },

  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },

  username: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    //using a getter method to get the current date and time using moment
    get: (createdAtVal) =>
      moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
  },
});

module.exports = ReactionSchema;
