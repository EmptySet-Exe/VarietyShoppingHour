// Package Import(s)
import express from "express"
import dotenv from "dotenv";
import cors from "cors";   
const port = process.env.BACKEND_PORT || 3000;  

// Function Import(s)
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoute.js";

// Initialize Configuration(s)
dotenv.config();
const app = express();

app.use(express.json()); // Allows JSON data in the req.body

/// Route (API Endpoints) ///
app.get("/", (req, res) => 
{
    res.send("Successfully called the web server");
});

app.use("/api/products",productRoutes); // Calls the relevant existent Product Route(s)

// Start the server to listen on `port`
app.listen(port, () => 
{
    connectDB(); // Connect to the Database
    console.log(`Server is running on port ${port}`);
});