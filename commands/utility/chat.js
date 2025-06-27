const { SlashCommandBuilder } = require("discord.js");
const { generateCompletion } = require("../../services/togetherAIService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with the bot")
    .addStringOption((opt) =>
      opt.setName("message").setDescription("Your message").setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString("message");
    const prompt = `Answer for this chat:\n\n${message}`;

    try {
      await interaction.deferReply();
      const response = await generateCompletion(prompt);
      await interaction.editReply(response);
    } catch (err) {
      console.error("Error in /chat:", err);
      await interaction.editReply(
        "Something went wrong while answering the chat."
      );
    }
  },
};
