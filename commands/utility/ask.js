const { SlashCommandBuilder } = require("discord.js");
const { generateCompletion } = require("../../services/openaiService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask the AI anything related to tech/dev")
    .addStringOption((opt) =>
      opt.setName("question").setDescription("Your question").setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString("question");
    const prompt = `You're an expert developer. Answer this clearly:\n\n${question}`;

    try {
      await interaction.deferReply();
      const response = await generateCompletion(prompt);
      await interaction.editReply(response);
    } catch (err) {
      console.error("Error in /ask:", err);
      await interaction.editReply(
        "Something went wrong while answering the question."
      );
    }
  },
};
