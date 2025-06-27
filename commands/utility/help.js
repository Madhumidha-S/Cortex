const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all available Cortex commands"),

  async execute(interaction) {
    try {
      const helpMessage = `
\`\`\`
CORTEX COMMANDS

1. /ask              → Ask the AI a question
2. /chat             → Start a new chat session with AI
3. /debug            → Debug code snippets
4. /explain          → Explain a piece of code
5. /github-insight   → Get insights from a GitHub profile
6. /note             → Manage personal notes
7. /rewrite          → Rewrite or paraphrase text
8. /standup          → Submit or view daily standup updates
9. /summarize        → Summarize text or documentation
10. /task            → Manage your task list
10. /help            → View this command list
\`\`\`
      `;
      await interaction.reply(helpMessage);
    } catch (err) {
      console.error("Error in /help:", err);
      await interaction.editReply("Something went wrong");
    }
  },
};
