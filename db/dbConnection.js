const mysql = require("mysql2");

// Creates connection to database with the information from .env file
const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Connects to database and checks for errors in connection
dbConnection.connect((error) => {
  if (error) {
    console.log("Connection to database failed. Error: " + error.message);
    return;
  }
  console.log("Connected to database was successfully established.");
});

// Stores all the database response data as a type OBJECT
let dataVar = {};

// LOGIN
// Purpose: Check if the user exists in the database and get all the details about the user
dataVar.login = (email) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "SELECT * FROM Uporabnik WHERE u_mail = ?",
      email,
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });
};

// REGISTER
// Purpose: Add a user to the database
dataVar.register = (name, surname, email, pass) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "INSERT INTO Uporabnik (u_ime, u_priimek, u_mail, u_geslo, u_datumReg) VALUES (?,?, CAST(? AS CHAR(60)),?)"[
        (name, surname, email, pass)
      ],
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
};

// TODO: Create a function that searches for all connections in the POVEZAVA table

// TODO: Create a function that searches for a single connection in POVEZAVA table with route id

// TODO: Create a function that searches for all user saved connections in SHRANI table (purpose: display all saved connections to a logged in user)

// TODO: Create a function that adds the connection to the SHRANI table

// TODO: Create a function that deletes a saved connection from SHRANI table

// TODO: Create a function that searches for all cities from KRAJ table (puropose: autocomplete search)

// Eporting the data so it can be used in API routes
module.exports = dataVar;
