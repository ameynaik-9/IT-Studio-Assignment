require("dotenv").config();
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const nodemailer = require("nodemailer");

// Create User
router.post("/createuser", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this email already exists" });
    }

    // Create a new user
    user = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      hobbies: req.body.hobbies,
    });
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Express.js route for creating a new user
router.post("/createuser", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this email already exists" });
    }

    // Create a new user
    user = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      hobbies: req.body.hobbies,
    });
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Express.js route for updating a user by id
router.put("/updateuser/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          hobbies: req.body.hobbies,
        },
      },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Express.js route for deleting a user by id
router.delete("/deleteuser/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getuser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/sendemail", async (req, res) => {
  console.log("Route");
  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.E_MAIL,
      pass: process.env.PASS_WORD,
    },
  });
  try {
    // Extract the checked rows data from the request body
    const { rows, email } = req.body;
    // Compose the email content with the checked rows
    const emailContent = `
  <h1>Checked Rows:</h1>
  <ul>
    ${rows
      .map(
        (row) => `
          <li>
            Name: ${row.name}<br>
            Email: ${row.email}<br>
            Phone: ${row.phone}<br>
            Hobbies: ${row.hobbies}
          </li>`
      )
      .join("")}
  </ul>
`;

    // Define email options
    const mailOptions = {
      from: "process.env.E_MAIL",
      to: email,
      subject: "Checked Rows",
      html: emailContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
