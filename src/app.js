const express = require("express");
const connectionDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

connectionDB()
  .then(() => {
    console.log("Db Connection is successfull");
    app.listen(3000, (req, res) => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.error("Db not connected");
  });
