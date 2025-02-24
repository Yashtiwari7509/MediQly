import { validationResult } from "express-validator";
import doctorModel from "../models/doctor.model.js";
import jwt from "jsonwebtoken";

export async function registerDoctor(req, res) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, email } = req.body;

    // Check if doctor already exists
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ message: "Email already exists" }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await doctorModel.hashPassword(password);

    // Create doctor
    const newDoctor = await doctorModel.create({
      ...req.body,
      password: hashedPassword,
    });

    // Generate JWT Token
    const token = newDoctor.generateAuthToken();

    // Remove password from response
    const doctorResponse = newDoctor.toObject();
    delete doctorResponse.password;

    // Send response
    return res.status(201).json({
      message: "Doctor registered successfully",
      token,
      doctor: doctorResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function signInDoctor(req, res) {
  try {
    // Validate request input
    const errors = validationResult(req);
    console.log(errors);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;
    console.log(email, password);
    

    // Check if doctor exists
    const doctor = await doctorModel.findOne({ email });
    console.log(doctor);
    
    if (!doctor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await doctor.comparePassword(password);
console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate authentication token
    const token = doctor.generateAuthToken();

    // Remove password from response
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;

    // Respond with doctor data & token
    return res.status(200).json({
      message: "Login successful",
      token,
      doctor: doctorResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getDoctorProfile = async (req, res) => {
  try {
    if (!req.doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Remove password from doctor data before sending response
    const doctorResponse = req.doctor.toObject();
    delete doctorResponse.password;

    return res.status(200).json(doctorResponse);
  } catch (error) {
    console.error("Profile retrieval error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
