const { SlashCommandBuilder } = require("discord.js");
const { generateCompletion } = require("../../services/openaiService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explain")
    .setDescription("Explain a code snippet")
    .addStringOption((opt) =>
      opt.setName("code").setDescription("Paste your code").setRequired(true)
    ),

  async execute(interaction) {
    const code = interaction.options.getString("code");
    const prompt = `Explain the following code:\n\n${code}`;
    const response = await generateCompletion(prompt);

    await interaction.reply(response);
  },
};
