const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    groupName: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", groupSchema);
