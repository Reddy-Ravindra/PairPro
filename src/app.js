
const express = require("express");

const connectDB = require("./config/database");

const app = express();
const User = require("./models/User");

app.use(express.json());


app.post("/signup", async (req, res) => {

  const user = new User(req.body);

  try {
    await user.save();

    res.send("User Added Successfully");
  } catch (err) {
    res.status(500).send("Error adding user: " + err.message);
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

