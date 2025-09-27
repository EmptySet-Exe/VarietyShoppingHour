import mongoose from "mongoose";

export const connectDB = async () => 
    {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URI); // Wait for the database to respond
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
        catch(err) {
            console.log(`Error: ${err.message}`);
            process.exit(1);
        }
    };