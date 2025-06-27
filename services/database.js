const { Pool } = require("pg");
const { host, port, name, user, password } = require("../config.json");

const pool = new Pool({
  host: host,
  port: port,
  database: name,
  user: user,
  password: password,
});

module.exports = pool;
