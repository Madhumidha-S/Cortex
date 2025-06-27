const pool = require("./database");
const { getOrCreateUser } = require("./userService");

async function addTask(discord_id, description) {
  const user = await getOrCreateUser(discord_id);
  await pool.query("INSERT INTO tasks (user_id, description) VALUES ($1, $2)", [
    user.id,
    description,
  ]);
}

async function listTasks(discord_id) {
  const user = await getOrCreateUser(discord_id);
  const res = await pool.query(
    "SELECT id, description, is_completed FROM tasks WHERE user_id = $1 AND is_completed = false",
    [user.id]
  );
  return res.rows;
}

async function completeTask(discord_id, taskId) {
  const user = await getOrCreateUser(discord_id);
  const result = await pool.query(
    "UPDATE tasks SET is_completed = true WHERE id = $1 AND user_id = $2 RETURNING *",
    [taskId, user.id]
  );
  return result.rowCount > 0 ? "Task completed!" : "Task not found.";
}

async function listCompletedTasks(discord_id) {
  const user = await getOrCreateUser(discord_id);
  const res = await pool.query(
    "SELECT id, description FROM tasks WHERE user_id = $1 AND is_completed = true",
    [user.id]
  );
  return res.rows;
}

module.exports = { addTask, listTasks, completeTask, listCompletedTasks };
