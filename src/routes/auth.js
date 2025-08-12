const express = require("express");
const validateSignUp = require("../utils/validation");
const validateLogin = require("../utils/validation");
const User = require("../modals/user");
const bcrypt = require("bcrypt");
const { unsubscribe } = require("./requests");

const authRouter = express.Router();

//signup
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, skills } = req.body;

  try {
    //validate the data
    validateSignUp(req);

    //excrypt password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      skills,
    });
    await user.save();
    res.send("User added successfull");
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate
    validateLogin(req);

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const userPassword = await user.validepassword(password);

    if (userPassword) {
      //create a jwt token
      const token = await user.getJwt();

      res.cookie("token", token);

      res.json({ message: "login Successfull", data: user });
    } else {
      res.send("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

//logout
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfull");
});

module.exports = authRouter;
