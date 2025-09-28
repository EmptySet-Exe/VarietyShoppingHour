require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;  



app.get("/", (req, res) => {
    res.send("Sucessfully called the web server")
});

const connectDB = async () => 
    {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("Connected to MongoDB")
            app.listen(port, () => 
                {console.log("Server is running on port 3000")})
        }
        catch(err) {
            console.log(err);
            process.exit(1);
        }
    }
    connectDB();

// ============== NEW CODE FOR DATABASES ===============

const productRoutes = require("./routes/product.route.js");
const aiRoutes = require("./routes/gemini.route.js");

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/aichat", aiRoutes);
