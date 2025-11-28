const express = require("express");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuth = require('../middlewares/authMiddleware.js')

const userRouter = express.Router(); // Route

// Sign up Route

userRouter.post("/register", async (req, res) => {
  try {
    // check if the user already exits
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      res.send({
        success: false,
        message: "User Already Exists with the Email",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashPwd = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashPwd;

    const newUser = await User(req.body);
    await newUser.save();

    res.send({
      success: true,
      message: "User Registered Successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Login Api

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.send({
        success: false,
        message: "user does not exist Please Register",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      res.send({
        success: false,
        message: "Sorry, invalid password entered!",
      });
    }

   const token =  jwt.sign({ userId: user._id }, process.env.JWT_SECRET , {expiresIn:'10d'});

    res.cookie('jwtToken' , token , {
          httpOnly : true,
          expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)  // 10 days
    })

    //REMOVE PASSWORD BEFORE SENDING
    delete user._doc.password;
    // below both will work but for delete, have to use .lean() at last when fetching user from db
    // delete user.password;
    // user.password = undefined;

    res.send({
      success: true,
      message: "You've successfully logged in!",
      user:user
    });
  } catch (error) {
    res.status(500).json({ message: "Error in Logging in!" });
  }
});


userRouter.get("/current-user",isAuth,  async (req, res) => {
  const userId = req.userId;
  if (userId === undefined) {
    return res.status(401).json({ message: "Not authorized , no token" });
  }
  try {
    const verifiedUser = await User.findById(userId).select("-password");
    res.json(verifiedUser);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  } 
});


// Logout Api - Clear cookie
userRouter.post("/logout", (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie('jwtToken', {
      httpOnly: true,
    });

    res.send({
      success: true,
      message: "Logged out successfully!"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error logging out" 
    });
  }
});

module.exports = userRouter;