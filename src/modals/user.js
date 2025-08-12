const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invaid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "others"],
        message: `{VALUE} is not a valid type`,
      },
    },
    about: {
      type: String,
      default: "This is a default description you you",
    },
    Image: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg",
    },
    skills: {
      type: [String],
      default: "No Skills added ",
    },
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user.id }, "Dev@tinder$789", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validepassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  
  const ispassword = await bcrypt.compare(passwordInputByUser, passwordHash);

  return ispassword;
};

const userModal = mongoose.model("User", userSchema);

module.exports = userModal;
