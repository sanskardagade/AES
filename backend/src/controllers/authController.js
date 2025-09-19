// src/controllers/authController.js
import sql from "../config/neonsetup.js"; // import the Neon connection

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Insert new user
    const result = await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${password}) RETURNING id, name, email`;

    res.status(201).json({ 
      message: "User registered successfully", 
      user: result[0],
      name: result[0].name, 
      email: result[0].email 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email and password
    const user = await sql`SELECT id, name, email FROM users WHERE email = ${email} AND password = ${password}`;

    if (user.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ 
      message: "Login successful", 
      user: user[0] 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};
