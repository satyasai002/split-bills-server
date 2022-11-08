const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    expName: {
      type: String,
      required: true,
    },
    expAmt: {
      type: Number,
      required: true,
    },
    expPaidBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userSplitBtw: [{
      Id:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      amount:{
        type: Number,
        required: true,
      }
  }],
    expGrp: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
