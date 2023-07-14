require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //This middleware helps in parsing form data

// Available Routes
app.use('/api/user', require('./routes/user'))

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`IT Studio Assignment running at http://localhost:${port}`);
});