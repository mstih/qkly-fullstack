const express = require("express");
const dotenv = require("dotenv").config();

const app = express();

// Routes
const users = require("./routes/users");
const connections = require("./routes/connections");

app.use("/users", users);
app.use("/connections", connections);

// Server starting and listening
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}...`);
});
