const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");

const roles = ["admin", "store"];

exports.addUser = catchAsync(async (req,res,next) => {
    const {email, role} = req.body;
    if(!email || !role) {
        return next (new AppError("you must enter email or role", 400));
    }
    
    const existingUser = await User.findOne({email});
    if(existingUser) {
        return next (new AppError("user with that email id already exists", 400));
    }

    const newUser = await User.create({email, role, isSignedUp:false});

    //send email
    const url = "http://localhost:3000/"
    const emailer = new Email(newUser, url);
    await emailer.sendInvite();
    
    res.status(201).json({
        "message" : "User has been sent invite link successfully to their emails"
    });
});

exports.changeRole = catchAsync(async (req,res,next) => {
    const {newRole} = req.body;
    const id = req.params.id;
    if(!roles.includes(newRole)) {
        return next (new AppError("give some role among : admin, tester,filler,pickup", 400));
    }
    const updatedUser = await User.findByIdAndUpdate(id, {role : newRole}, {new : true});

    if(!updatedUser) {
        return next (new AppError("user doesn't exist", 404));
    }
    if(updatedUser) {
        res.status(200).json({
            "message" : "updated successfully",
            updatedUser
        })
    }
})

exports.getAllUsers = catchAsync(async (req,res,next) => {
    const {role} = req.query;

    let filterOptions = {};
    if(role) {
        filterOptions.role = role;
    }
    const users = await User.find(filterOptions);

    res.status(200).json({
        users
    })
})