const { Schema, model } = require("mongoose");
const moment = require("moment");
const Reaction = require("./Reaction");

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      //using a getter method to get the current date and time using moment
      get: (createdAtVal) =>
        moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
    },

    username: {
      type: String,
      required: true,
    },

    reactions: {
      reaction: [Reaction],
    },
  },
  {
    toJson: {
      virtuals: true,
    },

    id: false,
  }
);

// creating virtual that retrieves the length of the thoughts reaction
ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reaction.length;
});

const Thoughts = model("Thoughts", ThoughtSchema);

module.exports = Thoughts;
