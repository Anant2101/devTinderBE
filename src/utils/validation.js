const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter a Name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateLogin = (req) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new Error("Enter Email and password");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid Email");
  }
};

const validateUpdaetFields = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "Image",
    "skills",
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isAllowed;
};

module.exports = validateSignUp;
module.exports = validateLogin;
module.exports = validateUpdaetFields;
