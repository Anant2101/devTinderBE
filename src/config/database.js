const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(
    "mongodb+srv://anantchaturvedi20:Test123@cluster0.axy4mjk.mongodb.net/devTinder"
  );
};

module.exports = connectionDB;
