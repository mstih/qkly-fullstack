// Purpose: Handle all routes related to users (/users/...)
const express = require("express");
const users = express.Router();
const db = require("../db/dbConnection.js");

users.get("/", (req, res) => {
  res.send("Hello from users");
});

// TODO: LOGIN function

// TODO: LOGOUT function

// REGISTER
// Purpose: Check for all the fields and register a new user
users.post("/register", async (req, res, next) => {
  try {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const pass = req.body.pass;
    // Check if all the fields are not empty
    if (name && surname && email && pass) {
      // Send info to database function regsiter and wait for the response
      const queryResponse = await db.register(name, surname, email, pass);
      if (queryResponse.affectedRows > 0) {
        res.statusCode = 200;
        res.send({
          status: { success: true, message: "New user created!" },
        });
        console.log("Register success: New user created!");
      }
    } else {
      res.statusCode = 200;
      res.send({
        status: { success: false, message: "Please fill in all the fields" },
      });
      console.log("Register error: Missing Fields");
    }
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({ status: { success: false, message: "Server error" } });
    next();
  }
});

module.exports = users;
