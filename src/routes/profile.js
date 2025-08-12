const express = require("express");
const { userAuth } = require("../middleware/auth");
const validateUpdaetFields = require("../utils/validation");
const authRouter = require("./auth");
const bcrypt = require("bcrypt");
const User = require("../modals/user");

const profieRouter = express.Router();

//get profiles
profieRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

//update a profile
profieRouter.patch("/profile/edit", userAuth, (req, res) => {
  try {
    if (!validateUpdaetFields(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach(
      (keys) => (loggedInUser[keys] = req.body[keys])
    );

    res.json({
      message: `${loggedInUser.firstName} your profile was edited`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

//forgot password
profieRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const dbuser = req.user;

    //check if User provided pass is same as it is in the db
    const match = await bcrypt.compare(password, dbuser.password);

    if (match) {
      return res.status(400).send("Cannot reuse Old Password");
    }

    //convert user password to update to hash
    const hashPassword = await bcrypt.hash(password, 10);

    dbuser.password = hashPassword;
    await dbuser.save();

    res.send("Password Updated successfuly");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = profieRouter;
