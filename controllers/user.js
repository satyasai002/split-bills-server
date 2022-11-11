const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.user_signup = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              fullName: req.body.fullName,
              mobile: req.body.mobile,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
               
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "password",
            {
              expiresIn: "12h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      
      res.status(500).json({
        error: err,
      });
    });
};

exports.user_allUsers = async (req, res) => {
  const keyword = req.body.search
    ? {
        $or: [
          { fullName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.userData.userId } });
  res.send(users);
};
exports.user_profile = async (req,res)=>{
  const id = req.userData.userId;
  const user = await User.findOne({_id:id})
  if(user){
    res.status(200).json({
      name:user.fullName,
      Id:user._id,
      email:user.email,
      mobile:user.mobile
    })
  }
  else{
    res.status(500).json({
      message:"user not found"
    })
  }

}
