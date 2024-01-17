const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(express.json());
app.use(morgan('combined'));

const cylinderRouter = require("./routes/cylinderRoutes");
const duraCylinderRouter = require("./routes/duraCylinderRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const clientRouter = require("./routes/clientRoutes");

const cookieParser = require("cookie-parser");


const config = require("./utils/config");
const permanentPackageRouter = require("./routes/permanentPackageRoutes");

app.use(cookieParser());

app.use(cors());

app.get("/api/v1", (req,res,next) => {
    res.status(200);
})
app.use("/api/v1/cylinder", cylinderRouter);
app.use("/api/v1/duracylinder", duraCylinderRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/package/permanent", permanentPackageRouter);

module.exports = app;