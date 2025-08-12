const jwt = require("jsonwebtoken");
const User = require("../modals/user");

const userAuth = async (req, res, next) => {
  try {
    //read the token
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login again");
    }
    //verify the token
    const decodedId = await jwt.verify(token, "Dev@tinder$789");
    const { _id } = decodedId;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = {
  userAuth,
};
