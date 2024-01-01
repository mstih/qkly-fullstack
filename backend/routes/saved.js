//Purpose: Handle all routes related to saved connections
const express = require("express");
const saved = express.Router();
const db = require("../db/dbConnection");
const ical = require("ical.js");
const fs = require("fs");

// Special Import for tempfile because it doesn't work with require
let tempfile;

import("tempfile")
  .then((module) => {
    tempfile = module.default;
  })
  .catch((err) => {
    console.error(err);
  });
//

saved.get("/", (req, res) => {
  res.send("Hello from saved");
});

// GET ALL SAVED CONNECTIONS
// Purpose: Show all saved connection for a specific userID
saved.get("/all/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const queryResponse = await db.getSaved(id);
      // NO SAVED CONNECTIONS
      if (queryResponse.length === 0) {
        res.status(200).send({
          status: { success: true, message: "No saved connections found" },
        });
        // Return saved connections
      } else {
        console.log("Get Saved connections for Uid: " + id + " successful");
        res.status(200).send(queryResponse);
      }
      // No id provided, return false
    } else {
      res
        .status(200)
        .send({ status: { success: false, message: "No user id provided." } });
      console.log("GET SAVED CONNECTIONS(Error): No user id provided.");
    }
    // Server or database error
  } catch (error) {
    console.log(
      "Get All Saved connections Error: \x1b[31m" + error.message + "\x1b[0m"
    );
    res
      .status(500)
      .send({ status: { success: false, message: "Server error" } });
  }
});

// SAVE CONNECTION
// Purpose: Save a specific connection to the SHRANI table together with a user that has requested that
saved.post("/save_connection", async (req, res) => {
  try {
    const uID = req.body.uid;
    const rID = req.body.rid;
    // Checks if both ids are present in the request
    if (uID && rID) {
      const isAllreadySaved = await db.checkSaved(uID, rID);
      if (!isAllreadySaved || isAllreadySaved.length === 0) {
        const queryResponse = await db.saveConnection(uID, rID);
        if (queryResponse) {
          res
            .status(200)
            .send({ status: { success: true, message: "Connection saved." } });
        } else {
          res.status(201).send({
            status: { success: false, message: "Connection not saved." },
          });
        }
      } else {
        res.status(203).send({
          status: { success: false, message: "Connection allready saved." },
        });
      }
    } else {
      res.status(201).send({
        status: { success: false, message: "No user id or route id provided." },
      });
    }
    res.end();
  } catch (error) {
    console.log(
      "Saving connection Error: \x1b[31m" + error.message + "\x1b[0m"
    );
    res
      .status(500)
      .send({ status: { success: false, message: "Server error." } });
  }
});

// DELETE SAVED CONNECTION
// Purpose: Delete a specific saved connection from the SHRANI table
saved.post("/delete_connection", async (req, res) => {
  try {
    const uid = req.body.uid;
    const rid = req.body.rid;
    // Checks if both ids are present
    if (uid && rid) {
      const queryResponse = await db.deleteSaved(uid, rid);
      if (queryResponse.affectedRows > 0) {
        res
          .status(200)
          .send({ status: { success: true, message: "Connection deleted" } });
      } else {
        console.log(
          "Deleting connection Error: " +
            "\x1b[31m" +
            "Connection(uid:" +
            uid +
            " | rid:" +
            rid +
            ") not found" +
            "\x1b[0m"
        );
        res.status(201).send({
          status: { success: false, message: "Connection not found." },
        });
      }
    } else {
      console.log(
        "Deleting connection Error: " + "\x1b[31m" + "Params empty" + "\x1b[0m"
      );
    }
  } catch (error) {
    console.log(
      "Deleting connection Error: \x1b[31m" + error.message + "\x1b[0m"
    );
    res
      .status(500)
      .send({ status: { success: false, message: "Server error." } });
  }
});

// SPECIAL FEATURE: DOWNLOAD TO CALENDAR
// Purpose: Generates a .ics file for a saved connection and sends it to the user
saved.get("/download/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const queryResponse = await db.getConnectionData(id);
      if (queryResponse.length === 1) {
        const data = queryResponse[0];
        console.log(JSON.stringify(data));
        // Creates a new event and adds the data into the event object
        const event = new ical.Event();
        event.uid = "event-" + Date.now();
        event.startDate = ical.Time.fromJSDate(new Date(data.cas1), false);
        event.endDate = ical.Time.fromJSDate(new Date(data.cas2), false);
        event.summary = `${data.odhod} --> ${data.prihod}`;
        event.description = `Transport type: ${data.vozilo} \nPrice: ${data.cena} Eur\nPurchase ticket at ${data.link}`;
        event.location = data.lokacija;
        event.organizer = `mailto:${data.kontakt}`;

        // Compiles the event into a .ics file
        const comp = new ical.Component(["vcalendar", [], []]);
        comp.addSubcomponent(event.component);
        const icsData = comp.toString();

        // Uses a temporary file to store the .ics file and then sends it to the user
        const tempFilePath = tempfile({ extension: ".ics" });
        fs.writeFileSync(tempFilePath, icsData);

        console.log("Created event: " + event.summary.toString());

        res.download(
          tempFilePath,
          `${data.odhod}_to_${data.prihod}.ics`,
          (error) => {
            if (error) {
              console.log(
                "File download Error: \x1b[31m" + error.message + "\x1b[0m"
              );
              return res
                .status(500)
                .send({ status: { success: false, message: "Server error." } });
            }
            // Deletes the temporary file after it has been sent to the user
            fs.unlinkSync(tempFilePath);
          }
        );
      } else {
        console.log(
          "Downloading ICS Error: \x1b[31m" + "Route Id not valid" + "\x1b[0m"
        );
        res.status(500).send({
          status: { success: false, message: "Route id does not exist." },
        });
      }
    } else {
      console.log(
        "Downloading ICS Error: \x1b[31m" + "No route id provided." + "\x1b[0m"
      );
      res
        .status(200)
        .send({ status: { success: false, message: "No route id provided." } });
    }
  } catch (error) {
    console.log("Downloading ICS Error: \x1b[31m" + error.message + "\x1b[0m");
    res
      .status(500)
      .send({ status: { success: false, message: "Server error." } });
  }
});
module.exports = saved;
