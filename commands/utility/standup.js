const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("standup")
    .setDescription("Fill your daily standup"),

  async execute(interaction) {
    const questions = [
      "What did you work on yesterday?",
      "What are you working on today?",
      "Any blockers?",
    ];

    await interaction.reply({
      content: "Check your DMs to begin your standup!",
      ephemeral: true,
    });

    try {
      const firstMessage = await interaction.user.send(questions[0]);
      const dmChannel = firstMessage.channel;

      const answers = [];
      let index = 1;

      const collector = dmChannel.createMessageCollector({
        filter: (m) => m.author.id === interaction.user.id,
        max: questions.length,
        time: 5 * 60_000,
      });

      collector.on("collect", async (msg) => {
        answers.push(msg.content);
        console.log("Collected:", msg.content);

        if (index < questions.length) {
          await dmChannel.send(questions[index]);
          index++;
        } else {
          collector.stop();
        }
      });

      collector.on("end", async () => {
        if (answers.length === questions.length) {
          await dmChannel.send("Standup complete! Here's your summary:");
          await dmChannel.send(
            `**Yesterday:** ${answers[0]}\n**Today:** ${answers[1]}\n**Blockers:** ${answers[2]}`
          );
        } else {
          await dmChannel.send("Standup incomplete or timed out.");
        }
      });
    } catch (error) {
      console.error("DM Error:", error);
      await interaction.followUp({
        content: "Couldn't DM you. Please enable DMs and try again.",
        ephemeral: true,
      });
    }
  },
};
