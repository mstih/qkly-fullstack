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
dataVar.searchConnections = (cityFrom, cityTo, date) => {
  return new Promise((resolve, reject) => {
    // Compare to parameters and send all the results(with full data)
    dbConnection.query(
      `SELECT P.r_id, P.r_odhod, P.r_prihod, 
      P.r_casOdhod, P.r_casPrihod, P.r_cena AS cena,
      K1.k_ime AS k_odhod, 
      K2.k_ime AS k_prihod,
      V.v_id,
      V.v_opis AS vozilo, 
      PR.p_id,
      PR.p_ime AS izvajalec,
      PR.p_link AS link,
      PR.p_kontakt AS kontakt
      FROM Povezava P
      JOIN Kraj K1 ON K1.k_id = P.r_odhod
      JOIN Kraj K2 ON K2.k_id = P.r_prihod
      JOIN Vozilo V ON V.v_id = P.r_vozilo
      JOIN Prevoznik PR ON PR.p_id = V.v_izvajalec
      WHERE P.r_casOdhod LIKE ? AND P.r_odhod = ? AND P.r_prihod = ?`,
      [date, cityFrom, cityTo],
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
};

// TODO: Create a function that searches for a specific connection by ID
dataVar.getConnectionData = (id) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `
      SELECT P.r_casOdhod AS cas1,
      P.r_casPrihod AS cas2,
      K1.k_ime AS odhod,
      K2.k_ime AS prihod,
      K1.k_lokacija AS lokacija,
      V.v_opis AS vozilo,
      PR.p_ime AS prevoznik,
      PR.p_link AS link,
      PR.p_kontakt AS kontakt,
      P.r_cena AS cena
      FROM Povezava P
      JOIN Kraj K1 ON P.r_odhod = K1.k_id
      JOIN Kraj K2 ON P.r_prihod = K2.k_id
      JOIN Vozilo V ON P.r_vozilo = V.v_id
      JOIN Prevoznik PR ON V.v_izvajalec = PR.p_id
      WHERE P.r_id = ?;
    `,
      [id],
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
};

// SAVED CONNECTIONS
// Purpose: Get all the saved connections for a specific user
// TODO: FIGURE OUT HOW TO CALCULATE TIME DIFFERENCE
dataVar.getSaved = (id) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `SELECT 
          S.u_id, S.r_id, 
          P.*, 
          K1.k_ime AS k_odhod, 
          K2.k_ime AS k_prihod,
          V.v_opis AS vozilo,
          PR.p_ime, PR.p_link, PR.p_kontakt
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
dataVar.saveConnection = (uid, rid) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "INSERT INTO Shrani (u_id, r_id) VALUES (?, ?)",
      [uid, rid],
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
};

// DELETE SAVED
// Purpose: Delete a saved connection from the database
dataVar.deleteSaved = (uID, pID) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "DELETE FROM Shrani WHERE u_id = ? AND r_id = ?",
      [uID, pID],
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
};

// CHECK SAVED CONNECTION
// Purpose: Check if a connection is already saved
dataVar.checkSaved = (uID, pID) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "SELECT * FROM Shrani WHERE u_id = ? AND r_id = ?",
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
