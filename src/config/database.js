const mongoose = require("mongoose");


const connectionDB = async () => {
  await mongoose.connect(
    "mongodb+srv://anantchaturvedi20:5nlZYgcOpWQ4tx1L@cluster0.axy4mjk.mongodb.net/devTinder"
  );
};

module.exports = connectionDB;
