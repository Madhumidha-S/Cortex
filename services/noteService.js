const pool = require("./database");
const { getOrCreateUser } = require("./userService");

async function addNote(discord_id, content) {
  const user = await getOrCreateUser(discord_id);
  await pool.query("INSERT INTO notes (user_id, content) VALUES ($1, $2)", [
    user.id,
    content,
  ]);
}

async function getNotes(discord_id) {
  const user = await getOrCreateUser(discord_id);
  const res = await pool.query(
    "SELECT id, content, created_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
    [user.id]
  );
  return res.rows;
}

async function deleteNote(discord_id, noteID) {
  const user = await getOrCreateUser(discord_id);
  const result = await pool.query(
    "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",
    [noteID, user.id]
  );
  return result.rowCount > 0 ? "Note deleted!" : "You have no saved notes. Use `/note add` to create one!";
}
module.exports = { addNote, getNotes, deleteNote };
