const express = require('express');

const authRouter = express.Router();
const User = require("../models/User");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");



authRouter.post("/signup", async (req, res) => {
  try {
    // Validation for data
    validateSignupData(req);

    // Encrypting the password
    const { firstName, lastName, emailId, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();

    res.send("User Added Successfully");
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Find user by email
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare passwords
    const isMatch = await user.validatePassword(password);

    if (isMatch) {
      const token = await user.getJWTToken();
      console.log(token);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      });

      res.send("Login successful for user: " + user.firstName);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});



module.exports = authRouter;