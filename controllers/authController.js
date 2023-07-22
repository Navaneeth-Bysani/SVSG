const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../models/userModel");
const config = require("../utils/config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



const createToken = (id, role) => {
    const jwtToken = jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
  return jwtToken;
};


exports.login = async (req, res, next) => {
  try{
    const { token } = req.body;
    console.log(token);
    if (!token) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a token',
      });
    }

    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      }
    )

    console.log(response?.data);
    
    const { email, name, picture } = response?.data;
    let currentUser = await User.findOne({ email });
    if (!currentUser) {
      return next(new AppError("user not found", 401));
    }

    if(currentUser.isSignedUp === false) {
      currentUser.name = name;
      currentUser.picture = picture;
      currentUser.isSignedUp = true;
      await currentUser.save();
    }
    
    if (currentUser.picture !== picture) {
      currentUser.picture = picture;
      await currentUser.save();
    }

    const jwt_token = createToken(currentUser._id, currentUser.role);
    console.log(jwt_token);
    res.status(200).json({
      status: 'success',
      jwt: jwt_token,
      message: 'Logged in successfully',
    })
  }
  catch(err){
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.verifyJwtToken = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2) Verifying token
  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);

  req.jwtPayload = {
    id: decoded.id,
    role: decoded.role,
  };
  next();
});

exports.loggedInUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.jwtPayload.id);
  // if (!currentUser) {
  //   return next(new AppError("User not found", 401));
  // }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};


exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if(req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});