const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    about: {
      type: String,
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    data: {
      type: String,
      ref: "Group",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
