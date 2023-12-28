// Purpose: Handle all routes related to users (/users/...)
const express = require("express");
const users = express.Router();
const db = require("../db/dbConnection.js");

users.get("/", (req, res) => {
  res.send("Hello from users");
});

// LOGIN FUNCTION
// Purpose: Check for all the fields and log in the user, also respond correct errors
users.post("/login", async (req, res, next) => {
  try {
    const email = req.body.email;
    const pass = req.body.pass;
    if (email && pass) {
      const queryResponse = await db.userExists(email);
      console.log(queryResponse);
      if (queryResponse.length > 0) {
        if (pass === queryResponse[0].u_geslo) {
          console.log(
            "User: " +
              queryResponse[0].u_mail +
              " - LOGIN at:  " +
              new Date().toLocaleString()
          );
          res.status(200);
          //req.session.user = queryResponse;
          //req.session.loggedIN = true;
          res.send({
            user: queryResponse[0],
            status: { success: true, msg: "Logged in" },
          });
        } else {
          res.status(200);
          res.send({
            user: null,
            status: { success: false, msg: "Password incorrect" },
          });
          console.log("Login error: Password incorrect");
        }
      } else {
        res.status(200);
        res.send({
          user: null,
          status: {
            success: false,
            msg: "Email " + email + " is not registered.",
          },
        });
        console.log("Login error: Email " + email + " is not registered.");
      }
    } else {
      res.status(200);
      res.send({
        logged: false,
        user: null,
        status: { success: false, msg: "Please fill in all the fields" },
      });
      console.log("Login error: Missing fields");
    }
    res.end();
  } catch (error) {
    console.log("Server error at LOGIN: " + error);
    res.status(500);
    res.send({ status: { success: false, message: "Server error" } });
    next();
  }
});

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
      // Check if the email is already registered
      if (await db.userExists(email)) {
        console.log("Register error: Email already registered");
        res.status(200).send({
          status: {
            success: false,
            message: "Email already registered.",
          },
        });
      } else {
        // Send info to database function regsiter and wait for the response
        const queryResponse = await db.register(name, surname, email, pass);
        if (queryResponse.affectedRows > 0) {
          res.statusCode = 200;
          res.send({
            status: { success: true, message: "New user created!" },
          });
          console.log("Register success: New user created!");
        }
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
