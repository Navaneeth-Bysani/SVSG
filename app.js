const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

const materialRouter = require("./routes/materialRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");

const cookieParser = require("cookie-parser");


const config = require("./utils/config");

app.use(cookieParser());

app.use(cors());


app.use("/api/v1/material", materialRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);

module.exports = app;