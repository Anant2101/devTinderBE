const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(
    "mongodb+srv://anantchaturvedi20:HMsc4QjaX2dXlCBb@cluster0.axy4mjk.mongodb.net/devTinder?retryWrites=true&w=majority"
  );
};

module.exports = connectionDB;
