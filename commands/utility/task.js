const { SlashCommandBuilder } = require("discord.js");
const {
  addTask,
  listTasks,
  completeTask,
  listCompletedTasks,
} = require("../../services/taskService");

const tasks = {};
const completedTasks = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("task")
    .setDescription("Manage your tasks")
    .addSubcommand((cmd) =>
      cmd
        .setName("add")
        .setDescription("Add a task")
        .addStringOption((opt) =>
          opt
            .setName("task")
            .setDescription("Task description")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd.setName("list").setDescription("List pending tasks")
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("complete")
        .setDescription("Mark task as complete")
        .addIntegerOption((opt) =>
          opt
            .setName("index")
            .setDescription("Task Index (from list)")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd.setName("finished").setDescription("List completed tasks")
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    if (sub === "add") {
      const description = interaction.options.getString("task");

      try {
        await addTask(userId, description);
      } catch (err) {
        console.error("DB error: Adding task failed. Falling back.", err);
        if (!tasks[userId]) tasks[userId] = [];
        tasks[userId].push(description);
      }

      return interaction.reply({
        content: `Task added: ${description}`,
        ephemeral: true,
      });
    }

    if (sub === "list") {
      try {
        const result = await listTasks(userId);
        if (result.length > 0) {
          const formatted = result
            .map((t, i) => `${i + 1}. ${t.description}`)
            .join("\n");
          return interaction.reply({
            content: `Pending Tasks:\n\n${formatted}`,
            ephemeral: true,
          });
        }
      } catch (err) {
        console.error("DB error: Listing tasks failed. Falling back.", err);
      }

      const fallback = tasks[userId] || [];
      return interaction.reply({
        content: fallback.length
          ? fallback.map((t, i) => `${i + 1}. ${t}`).join("\n")
          : "No pending tasks.",
        ephemeral: true,
      });
    }

    if (sub === "complete") {
      const index = interaction.options.getInteger("index");
      const tasks = await listTasks(userId);

      if (index < 1 || index > tasks.length) {
        return interaction.reply({
          content: "Invalid task number.",
          ephemeral: true,
        });
      }

      const taskId = tasks[index - 1].id;
      const result = await completeTask(userId, taskId);

      return interaction.reply({
        content: result,
        ephemeral: true,
      });
    }

    if (sub === "finished") {
      try {
        const result = await listCompletedTasks(userId);
        if (result.length > 0) {
          const formatted = result.map((t) => `${t.description}`).join("\n");
          return interaction.reply({
            content: `Completed Tasks:\n\n${formatted}`,
            ephemeral: true,
          });
        }
      } catch (err) {
        console.error(
          "DB error: Listing finished tasks failed. Falling back.",
          err
        );
      }

      const fallback = completedTasks[userId] || [];
      return interaction.reply({
        content: fallback.length
          ? fallback.map((t, i) => `${i + 1}. ${t}`).join("\n")
          : "No finished tasks.",
        ephemeral: true,
      });
    }
  },
};
