const tasks = {};
const completedTask = {};

function addTask(userId, task) {
  if (!tasks[userId]) tasks[userId] = [];
  tasks[userId].push(task);
}

function listTasks(userId) {
  return tasks[userId] || [];
}

function completeTask(userId, index) {
  if (!tasks[userId] || index < 0 || index >= tasks[userId].length) {
    return "Invalid task number.";
  }
  const done = tasks[userId].splice(index, 1);
  if (!completedTask[userId]) completedTask[userId] = [];
  completedTask[userId].push(done[0]);
  return `Completed task: ${done[0]}`;
}

function finishedTask(userId) {
  return completedTask[userId] || [];
}

module.exports = { addTask, listTasks, completeTask, finishedTask };
