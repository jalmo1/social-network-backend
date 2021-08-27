const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/],
  },

  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thoughts",
    },
  ],

  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

const Users = model("Users", UserSchema);

module.exports = Users;
