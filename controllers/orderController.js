const Order = require("./../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllOrders = catchAsync(async (req,res,next) => {
    try {
        const orders = await Order.find();
        console.log(orders);
        res.status(200).json({
            orders
        })
    } catch(err) {
        console.log(err);
        return next (new AppError("something went wrong", 400))
    }
});
