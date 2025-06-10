const tasks = {};

function addTask(userId, task) {
  if (!tasks[userId]) tasks[userId] = [];
  tasks[userId].push(task);
}

function listTasks(userId) {
  return tasks[userId] || [];
}

function completeTask(userId, index) {
  if (!tasks[userId] || index < 0 || index >= tasks[userId].length) {
    return "❌ Invalid task number.";
  }
  const done = tasks[userId].splice(index, 1);
  return `✅ Completed task: ${done[0]}`;
}

module.exports = { addTask, listTasks, completeTask };
