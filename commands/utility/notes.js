const { SlashCommandBuilder } = require("discord.js");
const notes = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("Add or view your notes")
    .addSubcommand((cmd) =>
      cmd
        .setName("add")
        .setDescription("Add a note")
        .addStringOption((opt) =>
          opt.setName("text").setDescription("Note text").setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd.setName("view").setDescription("View all your notes")
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    if (sub === "add") {
      const text = interaction.options.getString("text");
      if (!notes[userId]) notes[userId] = [];
      notes[userId].push(text);
      await interaction.reply("Note added.");
    } else if (sub === "view") {
      const userNotes = notes[userId] || [];
      await interaction.reply(
        userNotes.length
          ? userNotes.map((n, i) => `${i + 1}. ${n}`).join("\n")
          : "No notes found."
      );
    }
  },
};
