const { OpenAI } = require("openai");
const { OPENAI_API_KEY } = require("../config.json");
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
async function generateCompletion(prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}

module.exports = { generateCompletion };
