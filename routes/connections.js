//Purpose: Handle all routes related to connections
const express = require("express");
const connections = express.Router();

connections.get("/", (req, res) => {
  res.send("Hello from connections");
});

// TODO: Create a function that searches for all connections in the POVEZAVA table

// TODO: Create a function that searches for a single connection in POVEZAVA table with route id

module.exports = connections;
