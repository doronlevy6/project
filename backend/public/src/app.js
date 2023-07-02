const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

// Initialize express app
const app = express();

app.use(cors());
app.use(bodyParser.json());

console.log(`\n xxx1y3`, "2", `\n`); //!
// Setup PostgreSQL connection with the right credentials and connection details.
// Update these details as per your local PostgreSQL setup.
const pool = new Pool({
  user: "newuser1",
  host: "db",
  database: "mynewdb1",
  password: "newpassword1",
  port: 5432,
});
const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      );
    `);
    console.log("users table created or already exists");
  } catch (error) {
    console.error("\n\n\n\nError creating users table:", error);
  }
};

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error: " + err);
  } else {
    console.log("Database connected...");
  }
});

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the user already exists in the database
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      // If user already exists, send a message to the client
      res.json({ success: false, message: "Username/Email already exists." });
    } else {
      // If user does not exist, create a new user
      const user = await pool.query(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
        [username, password, email]
      );

      console.log("Registered user:", user.rows[0]);
      res.json({ success: true });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.json({ success: false });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (user.rows.length > 0) {
      console.log("Logged in user:", user.rows[0]);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.json({ success: false });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000.");
});
