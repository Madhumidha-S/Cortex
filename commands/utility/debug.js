const { SlashCommandBuilder } = require("discord.js");
const { generateCompletion } = require("../../services/openaiService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Find possible issues in your code")
    .addStringOption((opt) =>
      opt.setName("code").setDescription("Code to debug").setRequired(true)
    ),

  async execute(interaction) {
    const code = interaction.options.getString("code");
    const prompt = `Review the following code and suggest possible bugs or improvements:\n\n${code}`;

    try {
      await interaction.deferReply();
      const response = await generateCompletion(prompt);
      await interaction.editReply(response);
    } catch (err) {
      console.error("Error in /debug:", err);
      await interaction.editReply(
        "Something went wrong while debugging the code."
      );
    }
  },
};
