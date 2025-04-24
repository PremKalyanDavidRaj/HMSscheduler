const express = require("express");
const axios = require("axios");
const { getMedicalDescription } = require("../utils/fetchFromOpenAI");

const router = express.Router();

router.get("/:code", async (req, res) => {
  const { code } = req.params;
  let shortDesc = "Not found";

  try {
    const response = await axios.get("https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search", {
      params: {
        sf: "code,name",
        terms: code,
      },
    });

    const results = response.data?.[1];
    if (Array.isArray(results) && results.length > 0) {
      shortDesc = results[0][1]; // Get description from first match
    }

  } catch (err) {
    console.warn("⚠️ ClinicalTables API failed:", err.message);
    // Still continue to get description from OpenAI
  }

  try {
    const aiDesc = await getMedicalDescription(code, shortDesc);
    res.json({ code, shortDesc, aiDesc });
  } catch (error) {
    console.error("❌ OpenAI Error:", error.message);
    res.status(500).json({
      code,
      shortDesc,
      aiDesc: "Could not fetch explanation from AI.",
    });
  }
});

module.exports = router;
