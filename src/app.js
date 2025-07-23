const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello you are on Dashboard");
});



app.use("/profile", (req, res) => {
    res.send("Hello, This is server running on PORT: 8080");
});

app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
})