import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";

export async function registerUser(req, res) {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password, email } = req.body;
console.log(email);

  // Check if user already exists
  const isUser = await userModel.findOne({ email });
  if (isUser) {
    console.log(isUser);
    
    return res.status(409).json({ message: "Email already exists" }); // 409 Conflict
  }

  // Hash password
  const hashedPassword = await userModel.hashPassword(password);

  // Create user
  const newUser = await userModel.create({
    ...req.body,
    password: hashedPassword,
  });

  console.log(newUser);

  // Generate JWT Token
  const token = newUser.generateAuthToken();

  // Send response with proper JSON format
  return res.status(201).json({
    message: "User registered successfully",
    token,
    user: newUser,
  });
}

export async function signInUser(req, res) {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" }); // Unauthorized
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" }); // Unauthorized
    }

    // Generate authentication token
    const token = user.generateAuthToken();

    // Respond with user data & token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}