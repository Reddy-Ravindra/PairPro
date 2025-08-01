
const express = require("express");

const connectDB = require("./config/database");
const bcrypt = require("bcrypt");

const app = express();
const User = require("./models/User");
const { validateSignupData } = require("./utils/validation");

app.use(express.json());


app.post("/signup", async (req, res) => {

  try {
    // Validation for data
    validateSignupData(req);

    

    // Encrypting the password
    const { firstName, lastName, emailId, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = new User({
      firstName, lastName, emailId, password: hashedPassword
    });

    await user.save();

    res.send("User Added Successfully");
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
  
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Find user by email
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    } 

    // Passwords match, proceed with login
    res.send("Login successful for user: " + user.firstName);

    
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});

app.get('/user', async (req, res) => {
  const email = req.body.emailId;

  await User.find({ emailId: email })
    .then((user) => {
      if (user.length > 0) {
        res.send(user);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      res.status(500).send("Error fetching user: " + err.message);
    });
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(500).send("Error fetching users: " + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount > 0) {
      res.send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Error deleting user: " + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Invalid update fields provided");
    }

    if (data?.skills.length > 10) {
      return res.status(400).send("Skills cannot exceed 10 items");
    }

    const result = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (result.modifiedCount > 0) {
      res.send("User updated successfully");
    } else {
      res.status(404).send("User not found or no changes made");
    }
  } catch (err) {
    res.status(500).send("Error updating user: " + err.message);
  }
});


connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(8080, () => {
      console.log("Server is running on http://localhost:8080");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

