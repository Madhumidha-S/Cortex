const { SlashCommandBuilder } = require("discord.js");
const { generateCompletion } = require("../../services/openaiService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("summarize")
    .setDescription("Summarize a code snippet or concept")
    .addStringOption((opt) =>
      opt
        .setName("text")
        .setDescription("Text or code to summarize")
        .setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString("text");
    const prompt = `Summarize this code or concept clearly:\n\n${input}`;

    try {
      await interaction.deferReply();
      const response = await generateCompletion(prompt);
      await interaction.editReply(response);
    } catch (err) {
      console.error("Error in /summarize:", err);
      await interaction.editReply(
        "Something went wrong while summarizing the code/text."
      );
    }
  },
};
