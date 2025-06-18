const { SlashCommandBuilder } = require("discord.js");
const { generateCompletion } = require("../../services/openaiService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rewrite")
    .setDescription("Rewrite your code for readability or best practices")
    .addStringOption((opt) =>
      opt.setName("code").setDescription("Code to rewrite").setRequired(true)
    ),

  async execute(interaction) {
    const code = interaction.options.getString("code");
    const prompt = `Rewrite the following code to make it cleaner and follow best practices:\n\n${code}`;

    try {
      await interaction.deferReply();
      const response = await generateCompletion(prompt);
      await interaction.editReply(response);
    } catch (err) {
      console.error("Error in /rewrite:", err);
      await interaction.editReply(
        "Something went wrong while rewriting the code."
      );
    }
  },
};
