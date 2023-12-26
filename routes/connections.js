//Purpose: Handle all routes related to
const express = require("express");
const connections = express.Router();

connections.get("/", (req, res) => {
  res.send("Hello from connections");
});

module.exports = connections;
