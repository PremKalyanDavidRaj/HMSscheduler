const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getMedicalDescription(code, shortDesc) {
  const prompt = `Explain the ICD-10 code "${code}" - "${shortDesc}" in a clear and patient-friendly way.`;

  try {
    console.log(" Sending prompt to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    console.log(" GPT Response:", response.choices[0].message.content);
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ OpenAI Error (full):", error);
    throw new Error("OpenAI failed");
  }
}

module.exports = { getMedicalDescription };
