const User = require("./../models/regularUserModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");

const roles = ["admin", "filler", "tester", "pickup"];

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

function isSubarray(subarray, array) {
    const subarraySet = new Set(subarray);
    const arraySet = new Set(array);
  
    for (const element of subarraySet) {
      if (!arraySet.has(element)) {
        return false;
      }
    }
  
    return true;
}

exports.changeRole = catchAsync(async (req,res,next) => {
    const {newRole} = req.body;
    const {email} = req.body;

    const user = await User.findOne({email});

    if(user.role.includes("admin")) {
        res.status(400).json({
            "message" : "Can't change the role of admin directly"
        });
        return;
    }
    

    if(!isSubarray(newRole, roles)){
        return next (new AppError("give some role among : admin, store", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, {role : newRole}, {new : true});

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

    const limit = req.query.limit;
    const pageNumber = req.query.pageNumber;

    const startIndex = limit*(pageNumber-1);

    let filterOptions = {};
    if(role) {
        filterOptions.role = role;
    }
    const users = await User.find(filterOptions).skip(startIndex).limit(limit);

    res.status(200).json({
        users
    })
})


exports.getUserRole = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    if (!email) {
      return next(new AppError("Invalid data", 404));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Student not found", 404));
    }
    req.user = user;
    // req.user.save({validate});
    let role = req.user.role;
    res.status(200).json({ status: "success", role });
});

exports.addUserManual = catchAsync(async(req,res,next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role : req.body.role,
        passwordConfirm : req.body.passwordConfirm
    });

    res.status(200).json({
        message : "user added successfully"
    })
});

exports.deleteUser = catchAsync(async(req, res) => {
    const user = await User.findOne({email: req.params.email});
    if(user.role.includes("admin")) {
        res.status(400).json({
            "message:" : "Can't delete an admin user directly"
        });
        return;
    }

    if(user?._id === req.user._id) {
        res.status(400).json({
            "message" : "You can't delete yourselves"
        });
        return;
    }
    const deletedUser = await User.findOneAndDelete({email : req.params.email});
    
    res.status(204);
})