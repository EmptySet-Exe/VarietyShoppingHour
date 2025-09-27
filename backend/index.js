require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.BACKEND_PORT || 3000;  


app.use(express.json()); // Allows JSON data in the req.body

// Route(s) (API Endpoints)

// app.get("/", (req, res) =>
// {res.send("Sucessfully called the web server")})

app.post("/api/products", async (req, res) =>
{
    // Post Logic
    const product = req.body; // This is the sent user data

    // Guard Clause
    if(!product.name || !product.price || !product.image)
    {
        return res.status(400).json({success: false,message: "Please provide all the fields!"});
    }

    // const newProduct = new Product(product) // This is an Object stub

    // 
    try
    {
        // await newProduct.save(); // Attempt to save the new object to the DB
        // res.status(201).json({success: true, data: newProduct});

        console.log("Successfully saved product to the Database!!!");
    }
    catch(err)
    {
        console.error("Error: Failed to create product!\n", error.message);
        res.status(400).json({success: false,message:"Server Error"});
    }

    res.send("Sucessfully called the web server")
})

const connectDB = async () => 
    {
        try {
            await mongoose.connect(process.env.MONGODB_URI); // Wait for the database to respond
            console.log("Connected to MongoDB")
            // Start the server to listen on `port`
            app.listen(port, () => 
                {console.log("Server is running on port 3000")})
        }
        catch(err) {
            console.log(err);
            process.exit(1);
        }
    }

    connectDB(); // Run the connect function

// ============== NEW CODE FOR DATABASES ===============

const productRoutes = require("./routes/product.route.js");

app.use(express.json());
app.use("/api/products", productRoutes);