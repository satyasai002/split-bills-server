const mongoose = require("mongoose");
const Group = require("../models/Group");
const Expense = require("../models/Expense");
const Notification = require("../models/Notification")
const Splitwise = require("splitwise-js-map");
const { response } = require("express");

exports.groups_get_all = (req, res) => {
  Group.find({ members: { $elemMatch: { $eq: req.userData.userId } } }).populate("members", "-password")
      .populate("admin", "-password").then(async (results) => {
        res.status(200).send(results);
      })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.groups_create_group = async (req, res,next) => {
  const group = new Group({
    _id: new mongoose.Types.ObjectId(),
    groupName: req.body.name,
    admin: req.userData.userId,
    members: req.userData.userId,
  });
  group
    .save().then((result) => {
        
        res.status(201).json({
          message: "Created group successfully",
          createdGroup: {
            name: result.name,
            Id: result._id,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
};

exports.groups_add_user =async (req, res, next) => {
  try{
  const groupId = req.body.groupId;
  const userId = req.body.userId;
  const group = await Group.findOne({_id:groupId});
  userId
    .map((member) => {
      const notification = new Notification({
        _id: new mongoose.Types.ObjectId(),
        to: member,
        about: "group",
        from: req.userData.userId,
        data: groupId,
      });
      notification.save();
    })
      res.status(200).json({
        message: "group created",
      })
  }
  catch(err){
    req.send("error");
  }
  // if(group.admin == req.userData.userId){
  // Group.findOneAndUpdate(
  //   {
  //     _id: groupId,
  //   },
  //   {
  //     $push: {
  //       members: userId,
  //     },
  //   }
  // )
  //   .populate("members", "-password")
  //   .populate("admin","-password")
  //   .then((doc) => {
  //     console.log("From database", doc);
  //     if (doc) {
  //       res.status(200).json({
  //         data: doc,
  //       });
  //     } else {
  //       res
  //         .status(404)
  //         .json({ message: "No valid entry found for provided ID" });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ error: err });
  //   });}
  //   else{
  //     console.log("user is not admin");
  //     res.status(500).json({ error: "bad gateway" });
  //   }
};
exports.groups_join_group = async (req, res, next) => {
  const groupId = req.body.groupId;
  const notificationId = req.body.notificationId;
  const group = await Group.findOne({ _id: groupId });
    Group.findOneAndUpdate(
      {
        _id: groupId,
      },
      {
        $push: {
          members: req.userData.userId,
        },
      }
    )
      .populate("members", "-password")
      .populate("admin", "-password").then((result)=>{
      })
    await Notification.findByIdAndDelete({ _id: notificationId })
      .then((doc) => {
        if (doc) {
          res.status(200).json({
            data: doc,
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  
};



exports.groups_delete = async (req, res, next) => {
  const id = req.params.groupId;
  const group = await Group.findById({_id : id});
  if(group.admin == req.userData.userId){
  Group.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "group deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
}
    else{
      res.status(500).json({
        error: "you are not admin",
      });
    }
};
exports.groups_split_expenses = async (req, res, next) => {
  try{
  const expenses = await Expense.find({ expGrp: req.body.expGrp })
    .populate("expPaidBy")
    .populate("userSplitBtw.Id", "-password");
    const data = expenses.map((expense)=>{
        const payFor = expense.userSplitBtw.reduce((obj,item) =>Object.assign(obj,{[item.Id.fullName]:item.amount}),{});
        const temp = {
          paidBy: expense.expPaidBy.fullName,
          paidFor: payFor,
        };
        return temp;
    })
    const expenses1 = await Expense.find({ expGrp: req.body.expGrp });
    const splits = Splitwise(data);
    res.status(200).json(splits);

  }
  catch(err){
    req.send("error");
  }
    

  
};