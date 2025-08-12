const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../modals/user");
const ConnectionRequest = require("../modals/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const status = req.params.status;
      const toUserId = req.params.toUserId;
      const requestedUser = req.user.firstName;

      const allowedStatus = ["intrested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).send("Invalid status");
      }

      const toUser = await User.findById(toUserId);
      const requestSendTo = toUser.firstName;
      if (!toUser) {
        return res.status(404).send("User not Found");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(404).send("Connection request already present");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
        requestSendTo,
        requestedUser,
      });

      // this will save data in DB
      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName +
          " has send Connection Request to " +
          requestSendTo,
        data: data,
      });
    } catch (err) {
      res.status(404).send("Error " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInuser = req.user;
      const { status, requestId } = req.params;
      console.log(status, requestId);

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).send("Invalid status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInuser._id,
        status: "intrested",
      });

      console.log(connectionRequest);
      if (!connectionRequest) {
        return res.status(404).send("Connection request not found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.send(data);
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

module.exports = requestRouter;
