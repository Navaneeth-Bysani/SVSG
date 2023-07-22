const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

const cylinderRouter = require("./routes/cylinderRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

const passport = require('passport');
const session = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require("cookie-parser");

const User = require("./models/userModel");

const config = require("./utils/config");
const AppError = require("./utils/appError");

app.use(cookieParser());

app.use(cors({credentials: true, origin: 'http://127.0.0.1:3000'}));


app.use("/api/v1/cylinder", cylinderRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

module.exports = app;