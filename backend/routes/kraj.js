const express = require("express");
const kraj = express.Router();
const db = require("../db/dbConnection");

// GET all cities for search
kraj.get("/", async (req, res, next) => {
  try {
    const queryResult = await db.searchCities();
    if (queryResult.length > 0) {
      res.json(queryResult);
    }
  } catch (err) {
    console.log("Failed to get all cities. ERROR: " + err);
    res.sendStatus(500);
  }
});

module.exports = kraj;
