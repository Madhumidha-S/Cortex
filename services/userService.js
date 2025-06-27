const pool = require("./database");

async function getOrCreateUser(discord_id) {
  const res = await pool.query("SELECT * FROM users WHERE discord_id = $1", [
    discord_id,
  ]);
  if (res.rows.length) return res.rows[0];

  const insert = await pool.query(
    "INSERT INTO users (discord_id) VALUES ($1) RETURNING *",
    [discord_id]
  );
  return insert.rows[0];
}

module.exports = { getOrCreateUser };
