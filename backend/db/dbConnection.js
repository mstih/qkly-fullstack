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
    console.log(
      "Connection to the database failed. Error: " +
        "\x1b[31m" +
        error.message +
        "\x1b[0m"
    );
    return;
  }
  console.log("Connected to the database\x1b[32m successfully.\x1b[0m");
});

// Stores all the database response data as a type OBJECT
let dataVar = {};

// LOGIN
// Purpose: Check if the user exists in the database and get all the details about the user
dataVar.userExists = (email) => {
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
      "INSERT INTO Uporabnik (u_ime, u_priimek, u_mail, u_geslo) VALUES (?,?,?,CAST(? AS CHAR(60)))",
      [name, surname, email, pass],
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
};

// TODO: Create a function that searches for all connections in the POVEZAVA table at the specific date and combination of two cities
// TO FINISH WITH
dataVar.searchConnections = (date, cityFrom, cityTo) => {
  return new Promise((resolve, reject) => {
    dbConnection.query("", [], (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
};

// SAVED CONNECTIONS
// Purpose: Get all the saved connections for a specific user
// TODO: FIGURE OUT HOW TO CALCULATE TIME DIFFERENCE
dataVar.getSaved = (id) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `SELECT 
          S.*, 
          P.*, 
          K1.k_ime AS odhod, 
          K2.k_ime AS prihod,
          PR.p_ime AS prevoznik_ime,
          V.v_opis AS vozilo_opis
      FROM
          Shrani S
      JOIN
          Povezava P ON S.r_id = P.r_id
      JOIN
          Kraj K1 ON P.r_odhod = K1.k_id
      JOIN
          Kraj K2 ON P.r_prihod = K2.k_id
      JOIN
          Prevoznik PR ON P.r_id = PR.p_id
      JOIN
          Vozilo V ON P.r_vozilo = V.v_id
      WHERE
      S.u_id = ?;`,
      id,
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
};

// SAVE CONNECTION
// Purpose: Save a connection to the database linked to a specific user
dataVar.saveConnection = (uID, rID) => {
  return new Promise((resolve, reject) => {
    "INSERT INTO Shrani (u_id, p_id) VALUES (?, ?)",
      [uID, rID],
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      };
  });
};

// DELETE SAVED
// Purpose: Delete a saved connection from the database
dataVar.deleteSaved = (uID, pID) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "DELETE FROM Shrani WHERE u_id = ? AND p_id = ?",
      [uID, pID],
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
};

// SEARCH CITIES
// Purpose: Get all the cities from the database for dropdown menu
dataVar.searchCities = () => {
  return new Promise((resolve, reject) => {
    dbConnection.query("SELECT * FROM Kraj", (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
};
// Eporting the data so it can be used in API routes
module.exports = dataVar;
