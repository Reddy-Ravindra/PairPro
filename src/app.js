const express = require("express");

const app = express();


app.get('/user', (req, res) => {
  res.send({ firstname: "Ravindra", lastname: "Reddy" });
});





app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
