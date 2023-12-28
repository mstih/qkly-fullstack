//Purpose: Handle all routes related to saved connections
const express = require("express");
const saved = express.Router();
const db = require("../db/dbConnection");

saved.get("/", (req, res) => {
  res.send("Hello from saved");
});

// TODO: Create a function that searches for all user saved connections in SHRANI table (purpose: display all saved connections to a logged in user)
saved.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      const queryResponse = await db.getSaved(id);
      if (queryResponse.affectedRows === 0) {
        res.status(200).send({
          status: { success: true, message: "No saved connections found" },
        });
      } else if (queryResponse.affectedRows > 0) {
        res.status(200).send(queryResponse);
      }
    } else {
      res
        .status(200)
        .send({ status: { success: false, message: "No user id provided." } });
      console.log("GET SAVED CONNECTIONS(Error): No user id provided.");
    }
  } catch (error) {
    console.log("GET SAVED CONNECTIONS(Error): " + error.message);
    res
      .status(500)
      .send({ status: { success: false, message: "Server error" } });
  }
});

// TODO: Creata a function that saves a connection to the SHRANI table
saved.post("/saveConnection", async (req, res) => {
  try {
    const uID = req.body.uid;
    const rID = req.body.rid;
    if (uID && rID) {
      const queryResponse = await db.saveConnection(uID, rID);
      if (queryResponse.affectedRows > 0) {
        res
          .status(200)
          .send({ status: { success: true, message: "Connection saved." } });
      } else {
        res.status(200).send({
          status: { success: false, message: "Connection not saved." },
        });
      }
    } else {
      res.status(200).send({
        status: { success: false, message: "No user id or route id provided." },
      });
    }
    res.end();
  } catch (error) {
    console.log("Saving connection Error: " + error.message);
    res
      .status(500)
      .send({ status: { success: false, message: "Server error." } });
  }
});

// TODO: Create a function that deletes a saved connection from SHRANI table

// (WILL SEE?) TODO: Create a function that creates a .ics file for a saved connection and sends it to the user

module.exports = saved;
