
const express = require("express");

const connectDB = require("./config/database");

const app = express();
const User = require("./models/User");


app.post("/signup", async (req, res) => {

  const user = new User({
    firstName: "Ravindra",
    lastName: "Reddy",
    emailId: "info.ravindrareddy@gmail.com",
    password: "ravindra@123",
    age: 27,
  })

  try {
    await user.save();

    res.send("User Added Successfully");
  } catch (err) {
    res.status(500).send("Error adding user: " + err.message);
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

