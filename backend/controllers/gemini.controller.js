import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from "../models/product.model.js";
// import mongoose from 'mongoose';

const genAI = new GoogleGenerativeAI("AIzaSyDLa_NnKtz3D0ycs9awrUp7sxSgZqDQzys");

const promptAI = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const { prompt } = req.body;
    
    const result = await model.generateContent(formatPromptForPlainText(prompt));
    const response = await result.response;
    
    res.json({ message: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateSuggestion = async (req, res) => {
  try {
    const { prompt } = req.body;

    // 1. Fetch data from MongoDB
    const products = await Product.find({ /*active: true*/ }).limit(50);

    // 2. Format data for Gemini
    const productData = products.map(product => ({
        id:product._id,
        name: product.name,
        price: product.price,
        description: product.description
    }));

    console.log(formatPromptForSuggestion(productData, prompt))
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(formatPromptForSuggestion(productData, prompt));
    const response = await result.response;
    
    res.json({ message: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function formatPromptForSuggestion(productData, userPrompt){
    return `
    Analyze these products data from my e-commerce store:
    
    ${JSON.stringify(productData, null, 2)}
    
    Please provide product suggestions based on this preference: ${userPrompt}

    Respond with the ids of the products only.
    If more than one product matches the preference, respond with comma separated list of the ids containing the list of product ids.
    If no product matches the preference, respond with "None".
    `;
}

function formatPromptForPlainText(userPrompt) {
  return `You are a helpful assistant that responds only in plain text format. No formatting, no bullet points, no bold text, no lists. Just natural paragraph text.

    User question: ${userPrompt}

    Response:`;
}

export {promptAI, generateSuggestion};