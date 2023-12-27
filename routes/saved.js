//Purpose: Handle all routes related to saved connections
const express = require("express");
const saved = express.Router();

saved.get("/", (req, res) => {
  res.send("Hello from saved");
});

// TODO: Create a function that searches for all user saved connections in SHRANI table (purpose: display all saved connections to a logged in user)

// TODO: Creata a function that saves a connection to the SHRANI table

// TODO: Create a function that deletes a saved connection from SHRANI table

// (WILL SEE?) TODO: Create a function that creates a .ics file for a saved connection and sends it to the user

module.exports = saved;
