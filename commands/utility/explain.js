const { SlashCommandBuilder } = require("discord.js");
const { generateCompletion } = require("../../services/openaiService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explain")
    .setDescription("Explain a code snippet")
    .addStringOption((opt) =>
      opt.setName("code").setDescription("Paste your code").setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("language")
        .setDescription("Language of the code (optional)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const code = interaction.options.getString("code");
    const language = interaction.options.getString("language") || "auto";
    const prompt = `You're an expert software engineer. Analyze and explain the following code in simple, clear language. Format the output using Markdown.
    Language: ${language}
    Code:
    \`\`\`${language}
    ${code}
    \`\`\`
    `;

    try {
      await interaction.deferReply();
      const response = await generateCompletion(prompt);
      await interaction.editReply(response);
    } catch (err) {
      console.error("Error in /explain:", err);
      await interaction.editReply(
        "Something went wrong while explaining the code."
      );
    }
  },
};
