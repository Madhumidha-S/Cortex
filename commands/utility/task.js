const { SlashCommandBuilder } = require("discord.js");
const {
  addTask,
  listTasks,
  completeTask,
  finishedTask,
} = require("../../services/taskService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("task")
    .setDescription("Manage your tasks")
    .addSubcommand((cmd) =>
      cmd
        .setName("add")
        .setDescription("Add task")
        .addStringOption((opt) =>
          opt.setName("task").setDescription("Task text").setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd.setName("list").setDescription("List all tasks")
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("complete")
        .setDescription("Complete task")
        .addIntegerOption((opt) =>
          opt.setName("index").setDescription("Task number").setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd.setName("finished").setDescription("List all finished tasks")
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    if (sub === "add") {
      const task = interaction.options.getString("task");
      addTask(userId, task);
      return interaction.reply(`Task added: ${task}`);
    }

    if (sub === "list") {
      const tasks = listTasks(userId);
      return interaction.reply(
        tasks.length
          ? tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")
          : "No pending tasks."
      );
    }

    if (sub === "complete") {
      const index = interaction.options.getInteger("index");
      const result = completeTask(userId, index - 1);
      return interaction.reply(result);
    }

    if (sub === "finished") {
      const finishedTasks = finishedTask(userId);
      return interaction.reply(
        finishedTasks.length
          ? finishedTasks.map((t, i) => `${i + 1}. ${t}`).join("\n")
          : "No finished tasks."
      );
    }
  },
};
