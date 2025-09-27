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

app.use(express.json());
app.use("/api/products", productRoutes);

// =============== AI STUFF =============================
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION;
const GOOGLE_GENAI_USE_VERTEXAI = process.env.GOOGLE_GENAI_USE_VERTEXAI;

async function generateContentFromMLDev() {
  const ai = new GoogleGenAI({vertexai: false, apiKey: GEMINI_API_KEY});
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'why is the sky blue?',
  });
  console.debug("working:", response.text);
}

async function generateContentFromVertexAI() {
  const ai = new GoogleGenAI({
    vertexai: true,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'why is the sky blue?',
  });
  console.debug(response.text);
}

async function main() {
  if (GOOGLE_GENAI_USE_VERTEXAI) {
    await generateContentFromVertexAI().catch((e) =>
      console.error('got error', e),
    );
  } else {
    await generateContentFromMLDev().catch((e) =>
      console.error('got error', e),
    );
  }
}

main();
