//Purpose: Handle all routes related to connections
const express = require("express");
const connections = express.Router();
const db = require("../db/dbConnection");

connections.get("/", (req, res) => {
  res.send("Hello from connections");
});

// TODO: Create a function that searches for all connections in the POVEZAVA table
connections.post("/search", async (req, res) => {
  try {
    const k1 = req.body.k1;
    const k2 = req.body.k2;
    const dateTime = req.body.date + "%";
    // Sets the date to be in the right format for searching in sql
    const date = dateTime.split("T")[0] + "%";
    if (k1 && k2 && dateTime) {
      const queryResponse = await db.searchConnections(k1, k2, dateTime);
      if (queryResponse.length === 0) {
        res.status(201).send({
          status: { success: true, message: "No connections found." },
        });
      } else {
        // Send all results
        res.status(200).send(queryResponse);
      }
    } else {
      res
        .status(202)
        .send({ status: { success: false, message: "Missing fields" } });
    }
    res.end();
  } catch (error) {
    console.log(
      "Searching connections Error: \x1b[31m" + error.message + "\x1b[0m"
    );
    res
      .status(500)
      .send({ status: { success: false, message: "Server error" } });
  }
});
// TODO: Create a function that searches for a single connection in POVEZAVA table with route id
connections.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      // TO FINISH;
      console.log("Requesting single connection with ID: " + id);
    } else {
      res
        .status(200)
        .send({ status: { success: false, message: "No id provided." } });
    }
    // Database or server error
  } catch (error) {
    console.log(
      "Getting single connection Error: \x1b[31m" + error.message + "\x1b[0m"
    );
    res
      .status(500)
      .send({ status: { success: false, message: "Server error" } });
  }
});

module.exports = connections;
