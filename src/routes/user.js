const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../modals/connectionRequest");
const User = require("../modals/user");
const userRouter = express.Router();

const Userdata = "firstName lastName gender age about skills status";

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInuser,
      status: "intrested",
    }).populate("fromUserId", Userdata);

    const data = connectionRequest.map((element) => element.fromUserId);

    res.json({
      message: "This are the user intrested in you",
      data,
    });
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connection = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", Userdata)
      .populate("toUserId", Userdata);

    const data = connection.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUser = new Set();
    connectionRequest.map((req) => {
      hideUser.add(req.fromUserId.toString());
      hideUser.add(req.toUserId.toString());
    });

    console.log(hideUser);

    const toShowFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUser) } },
        { _id: { $nin: loggedInUser._id } },
      ],
    })
      .select(Userdata)
      .skip(skip)
      .limit(limit);

    res.send(toShowFeed);
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});
module.exports = userRouter;
