const axios = require("axios");
const { togetherApiKey } = require("../config.json");
async function generateCompletion(prompt) {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${togetherApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Error:", error.message);
    return "Sorry, the AI couldn't respond right now.";
  }
}

module.exports = { generateCompletion };
