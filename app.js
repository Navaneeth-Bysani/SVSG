const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

const cylinderRouter = require("./routes/cylinderRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const clientRouter = require("./routes/clientRoutes");

const cookieParser = require("cookie-parser");


const config = require("./utils/config");

app.use(cookieParser());

app.use(cors());

app.get("/api/v1", (req,res,next) => {
    res.status(200);
})
app.use("/api/v1/cylinder", cylinderRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/client", clientRouter);

module.exports = app;