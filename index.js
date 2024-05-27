// Import the modules we need
var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");

const expressLayouts = require("express-ejs-layouts");

// Create the express application object
const app = express();
const port = 8000;
const mysql = require("mysql");
const session = require("express-session");
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

// app.js or index.js
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://surafelyimamsy:uRW3eJvuR0HRgPlV@cluster0.rrshcut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "user",
//   password: "youth",
//   database: "employability",
// });
// // Connecting to the database
// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("Connected to the database");
// });
// global.db = db;

// Set up css
app.use(express.static(__dirname + "/public"));

// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set("views", __dirname + "/views");

// Tell Express that we want to use EJS as the templating engine
app.set("view engine", "ejs");

// Tell Express that we want to use layouts
app.use(expressLayouts);

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine("html", ejs.renderFile);

// Define our data
var blogData = { blogName: "Employability for the Youth" };

// Requires the main.js file inside the routes folder passing in the Express app and data as arguments.  All the routes will go in this file
require("./routes/main")(app, blogData);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
module.exports = app;
