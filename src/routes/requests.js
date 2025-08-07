const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");


requestRouter.post("/sendConnectRequest", userAuth, async (req, res) => {
  const { user } = req;
  // sending a connection request
  console.log("Sending a connection request");

  res.send(user.firstName + " has sent you a connection request.");
});



module.exports = requestRouter;