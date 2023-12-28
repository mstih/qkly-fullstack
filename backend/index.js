const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");
const db = require("./db/dbConnection");
const users = require("./routes/users");
const connections = require("./routes/connections");
const saved = require("./routes/saved");
const kraji = require("./routes/kraj");

// Middleware
app.use(express.json());
app.use(cors({ methods: ["GET", "POST"] }));

// Endpoints for routes
app.use("/users", users);
app.use("/connections", connections);
app.use("/saved", saved);
app.use("/kraji", kraji);

// TODO: Static express files for frontend

// For now a simple response to / route
app.get("/", (req, res) => {
  res.send("Hello, here will be the frontend.");
});
// Server starting and listening
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}...`);
});