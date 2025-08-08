const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validate } = require("../models/User");
const { validateEditProfileData } = require("../utils/validation");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;

    res.send(user);
  } catch (err) {
    res.status(500).send("Error fetching profile: " + err.message);
  }
});

// profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
//   try {
//     const { user } = req;
//     const updates = req.body;

//     // Update user profile
//     Object.assign(user, updates);
//     await user.save();

//     res.send("Profile updated successfully");
//   } catch (err) {
//     res.status(500).send("Error updating profile: " + err.message);
//   }
// });

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)) {
      return res.status(400).send("Invalid Edit Requests!");
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        req.user[key] = req.body[key];
      }
    });

    await req.user.save();

    // res.send(`${req.user.firstName}, profile updated successfully`);

    res.json({ message: `${req.user.firstName}, profile updated successfully`, user: req.user });
  } catch (err) {
    res.status(500).send("Error updating profile: " + err.message);
  }
});

//forgotPassword

module.exports = profileRouter;