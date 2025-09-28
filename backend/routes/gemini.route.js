// =============== AI STUFF =============================
const express = require('express');
const router = express.Router();

const { promptAI, generateSuggestion } = require('../controllers/gemini.controller.js');

// const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
// const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION;
// const GOOGLE_GENAI_USE_VERTEXAI = process.env.GOOGLE_GENAI_USE_VERTEXAI;

// async function generateContentFromMLDev() {
//   const ai = new GoogleGenAI({vertexai: false, apiKey: GEMINI_API_KEY});
//   const response = await ai.models.generateContent({
//     model: 'gemini-2.0-flash',
//     contents: 'suggest a recipie for me to try',
//   });
//   console.debug("working:", response.text);
// }


router.post('/', promptAI);
router.post('/suggestion', generateSuggestion)


module.exports = router;



// async function generateContentFromVertexAI() {
//   const ai = new GoogleGenAI({
//     vertexai: false,
//     project: GOOGLE_CLOUD_PROJECT,
//     location: GOOGLE_CLOUD_LOCATION,
//   });
//   const response = await ai.models.generateContent({
//     model: 'gemini-2.0-flash',
//     contents: 'why is the sky blue?',
//   });
//   console.debug(response.text);
// }

// async function main() {
//   if (GOOGLE_GENAI_USE_VERTEXAI) {
//     await generateContentFromVertexAI().catch((e) =>
//       console.error('got error', e),
//     );
//   } else {
    // await generateContentFromMLDev().catch((e) =>
    //   console.error('got error', e),
    // );
//   }

//  try {
//     const models = await genAI.model
    
//     console.log('Available models:');
//     for await (const model of models) {
//       console.log(`- ${model.name}`);
//       console.log(`  Display name: ${model.displayName}`);
//       console.log(`  Description: ${model.description}`);
//       console.log('---');
//     }
//   } catch (error) {
//     console.error('Error listing models:', error);
//   }
// }

// main();