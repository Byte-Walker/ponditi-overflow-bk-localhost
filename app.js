const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = 5500;

// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ponditi_overflow",
});

db.connect();

// Signup route
app.post("/signup", (req, res) => {
  const user = req.body;

  const create_user_tbl = `CREATE TABLE user_tbl(
          user_email varchar(100) PRIMARY KEY NOT NULL ,
          user_pass varchar(100),
          name varchar(50),
          img_url varchar(1000)
          );`;

  const insert_user_tbl = `INSERT INTO user_tbl(user_email, user_pass, name, img_url)
          VALUES ('${user.user_email}', '${user.user_pass}', '${user.name}', '${user.img_url}');`;

  db.query(insert_user_tbl, (err, rows, fields) => {
    if (err?.errno === 1146) {
      // Creating user_tbl if it doesn't exist
      console.log(err.code);
      db.query(create_user_tbl, (err, rows, fields) => {
        if (err) {
          console.error(err.code);
          res.send(false);
        }
        console.log("user_tbl created successfully!");
      });

      // Insertig user data into user_tbl
      db.query(insert_user_tbl, (err, rows, fields) => {
        if (err) {
          console.error(err.code);
          res.send(false);
        } else {
          console.log("inserted user data into user_tbl after creating user_tbl");
          res.send(true);
        }
      });
    } else {
      console.log("Inserted user data into user_tbl");
      res.send(true);
    }
  });
});

// Login route
app.post("/login", (req, res) => {
  const requestedUser = req.body;

  let user;
  const fetch_user = `SELECT * FROM user_tbl 
    WHERE user_email = '${requestedUser.user_email}';`;
  db.query(fetch_user, (err, rows, fields) => {
    if (err) {
      console.log("Error from /login: ", err);
    } else {
      user = rows[0];
      if (requestedUser.user_pass === user?.user_pass) {
        res.json(user);
      } else {
        res.send(false);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Ponditi overflow listening on port ${port}`);
});
