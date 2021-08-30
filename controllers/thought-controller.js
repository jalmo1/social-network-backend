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

  deleteThought({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.id }).then((dbDeleteThought) => {
      console.log(dbDeleteThought._id.toString());
      var deleter = dbDeleteThought._id.toString();
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
