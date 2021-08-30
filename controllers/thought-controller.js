const { Users, Thoughts } = require("../models");

const thoughtController = {
  getThoughts(req, res) {
    Thoughts.find({})
      .populate({ path: "reactions" })
      .then((dbThoughts) => res.json(dbThoughts))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getThoughtById({ params }, res) {
    Thoughts.findOne({ _id: params.id })
      .populate({ path: "reactions" })
      .then((dbThoughts) => {
        if (!dbThoughts) {
          res.status(404).json({
            message: "No thoughts at this current id, go somewhere else!",
          });
          return;
        }
        res.json(dbThoughts);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createThought({ body }, res) {
    Thoughts.create(body).then((dbThoughts) => {
      Users.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: dbThoughts._id } },
        { new: true }
      )
        .then((dbUsersData) => {
          if (!dbUsersData) {
            res.status(404).json({
              message: "No user found go somewhere else!",
            });
            return;
          }
          res.json(dbUsersData);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    });
  },

  //Finds a thought based on the id and deletes it.
  deleteThought({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.id }).then((dbDeleteThought) => {
      console.log(dbDeleteThought._id.toString());

      //I made up this word... but its a variable used to delete the specific id of the thought
      var deleter = dbDeleteThought._id.toString();

      //After it deletes the thought we go in to the user to delete the
      //thought from the user array as well
      Users.findOneAndUpdate(
        { thoughts: deleter },
        { $pull: { thoughts: deleter } }
      )
        .then((dbUserdata) => {
          res.json(dbDeleteThought);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    });
  },

  updateThought({ params, body }, res) {
    Thoughts.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((dbUpdate) => {
        res.json(dbUpdate);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  addReaction({ params, body }, res) {
    console.log(body);
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      //pushes the body of the reaction to users reaction array.
      {
        $push: {
          reactions: {
            reactionBody: body.reactionBody,
            username: body.username,
          },
        },
      },
      { new: true }
    )
      .then((dbReact) => {
        res.json(dbReact);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteReaction({ params }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbDeleteReaction) => {
        Thoughts.findOneAndDelete({ reactionId: params.reactionId });
        res.json(dbDeleteReaction);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = thoughtController;
