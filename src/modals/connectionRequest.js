const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: "{VALUE} is not a valid type",
      },
    },
    requestSendTo: {
      type: String,
    },
    requestedUser: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequest.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection request to youself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequest
);

module.exports = ConnectionRequestModel;
