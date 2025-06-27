const { SlashCommandBuilder } = require("discord.js");
const { addNote, getNotes, deleteNote } = require("../../services/noteService");

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
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("delete")
        .setDescription("Delete note")
        .addIntegerOption((opt) =>
          opt.setName("index").setDescription("Note number").setRequired(true)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    if (sub === "add") {
      const text = interaction.options.getString("text");

      // DB attempt
      try {
        await addNote(userId, text);
      } catch (err) {
        console.error("DB error: Saving note failed. Falling back.", err);
        if (!notes[userId]) notes[userId] = [];
        notes[userId].push(text);
      }

      return interaction.reply({ content: "Note added!", ephemeral: true });
    }

    if (sub === "view") {
      let noteList = [];

      // Try DB
      try {
        noteList = await getNotes(userId);
        if (noteList.length > 0) {
          const formatted = noteList
            .map(
              (n, i) =>
                `${i + 1}. ${n.content} _(on ${new Date(
                  n.created_at
                ).toLocaleString()})_`
            )
            .join("\n");
          return interaction.reply({
            content: `Your Notes:\n\n${formatted}`,
            ephemeral: true,
          });
        }
      } catch (err) {
        console.error("DB error: Viewing notes failed. Falling back.", err);
      }

      // Fallback
      const fallback = notes[userId] || [];
      return interaction.reply({
        content: fallback.length
          ? fallback.map((n, i) => `${i + 1}. ${n}`).join("\n")
          : "No notes found.",
        ephemeral: true,
      });
    }

    if (sub === "delete") {
      try {
        const index = interaction.options.getInteger("index");
        const userNotes = await getNotes(userId);

        if (index < 1 || index > userNotes.length) {
          return interaction.reply({
            content: "Invalid note number.",
            ephemeral: true,
          });
        }

        const noteID = userNotes[index - 1].id;
        const result = await deleteNote(userId, noteID);

        return interaction.reply({
          content: result,
          ephemeral: true,
        });
      } catch (err) {
        console.error("DB error: Deleting notes failed. Falling back.", err);
      }
    }
  },
};
