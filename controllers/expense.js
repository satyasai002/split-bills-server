const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Group = require("../models/Group")

exports.expenses_create_expense = (req, res, next) => {
  const expense = new Expense({
    _id: new mongoose.Types.ObjectId(),
    expName: req.body.expName,
    expAmt: req.body.expAmt,
    expPaidBy: req.userData.userId,
    userSplitBtw: req.body.userSplitBtw,
    expGrp: req.body.expGrp,

  });
  expense
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created expense successfully",
        createdExpense: {
          expName: result.expName,
          expAmt: result.expAmt,
          expPaidBy: result.userId,
          userSplitBtw: result.userSplitBtw,
          expGrp: result.expGrp,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.expenses_get_groupexpense = async (req, res, next) => {
  Expense.find({ expGrp: req.body.expGrp })
    .populate("userSplitBtw", "-password").populate("expPaidBy","-password")
    .populate("userSplitBtw.Id", "-password")
    .populate("expGrp")
    .then(async (results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.expenses_update_expense = (req, res, next) => {
    Expense.find({ _id: req.body.expId });
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.expenses_delete = async (req, res, next) => {
  const id = req.params.expenseId;
  const expense = await Expense.findById({_id : id});
  if (expense.expPaidBy == req.userData.userId) {
    Expense.remove({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "expense deleted",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  } else {
    console.log("you cannot delete this expense");
    res.status(500).json({
      error: "you cannot delete this expense",
    });
  }
};
