// Package Import(s)
import mongoose from "mongoose";
import Product from "../models/product.model.js"


/// Logic for Product Route(s) ///

export const getProducts = async (req, res) =>
{
    try
    {
        const products = await Product.find({});
        res.status(200).json({success: true, data: products});
    }
    catch(err)
    {
        console.error("Error: Failed to fetch products!\n", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const createProduct = async (req, res) =>
{
    const product = req.body; // This is the sent user data

    // Guard Clause
    if(!product.name || !product.price || !product.image)
        return res.status(400).json({success: false,message: "Please provide all the fields!"});

    const newProduct = new Product(product) // This is an Object stub

    try
    {
        await newProduct.save(); // This is a Document create stub
        res.status(201).json({success: true, data: newProduct});

        console.log("Successfully saved product to the Database!!!");
    }
    catch(err)
    {
        res.status(400).json({success: false, message: "Server Error"});

        console.error("Error: Failed to create product!\n", err.message);
    }

    res.send("Sucessfully called the web server")
}

export const updateProduct = async (req,res) => 
{
    const { id }= req.params;

    const product = req.body; // This is deconstruction, I think

    // Guard Clause
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({success:false, message:"Invalid Product Id"});

    try
    {
        const updatedProduct = await Product.findByIdAndUpdate(id,product,{new:true}); // This is a an Object stub
        res.status(200).json({success: true, data: updatedProduct});
        // res.status(200).json({success: true,message:"Successfully updated product"});
    }
    catch(err)
    {
        res.status(500).json({success: false, message: "Server Error"});
        console.error("Error: Failed to update the product!\n", error.message);
    }
}

export const deleteProduct = async (req,res) =>
{
    const {id} = req.params;
    // console.log("id: ", id);

    // Guard Clause
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({success: false, message: "Invalid Product Id"});

    try
    {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Product Deleted!"});
    }
    catch(err)
    {
        res.status(500).json({success: false, message: "Server Error"});
        console.error("Error: Failed to delete product!\n", err.message);
    }
}