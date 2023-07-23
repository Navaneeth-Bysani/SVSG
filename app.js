const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

const materialRouter = require("./routes/materialRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

const cookieParser = require("cookie-parser");


const config = require("./utils/config");

app.use(cookieParser());

app.use(cors({credentials: true, origin: 'http://127.0.0.1:3000'}));


app.use("/api/v1/material", materialRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

module.exports = app;