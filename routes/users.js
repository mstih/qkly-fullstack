// Purpose: Handle all routes related to users (/users/...)
const express = require("express");
const users = express.Router();

users.get("/", (req, res) => {
  res.send("Hello from users");
});

module.exports = users;
