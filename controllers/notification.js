const mongoose = require("mongoose");
const Group = require("../models/Group");
const Expense = require("../models/Expense");
const Notification = require("../models/Notification");
const { response } = require("express");

exports.notifications_get_notification = async (req, res) => {
  try {
    const id = req.userData.userId;
    Notification.find({ to: id })
      .populate("to", "-password")
      .populate("from", "-password")
      .populate("data")
      .then(async (results) => {
        res.status(200).send(results);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (err) {
  }
};
exports.notifications_delete_notification = async (req, res) => {
  id = req.params.id;
  Notification.findByIdAndDelete({ _id: id })
    .then((results) => {
      res.status(200).json("notification deleted");
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
};
