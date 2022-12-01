const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  pool.query("SELECT * FROM users", (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const getUserById = (req, res) => {
  let sql = "SELECT ??, ?? FROM ?? WHERE ?? = ?";
  // req_url = `${req.url}`.split("/") //This is just one other way to get the same information as "req.params.id" by using the URL instead.
  // req_id = req_url[1]
  const replacements = ["id", "first_name", "users", "id", req.params.id]; //"req.params.id" can be changed to "req_id" if the code above gets uncommented.
  sql = mysql.format(sql, replacements);

  pool.query(sql, (err, rows) => {
    if (err) {
      console.log({ message: "Error occurred: " + err });
      return res.status(500).send("An unexpected error occurred");
    }
    res.json(rows);
  })
}

const createUser = (req, res) => {
  let sql = "INSERT INTO ?? (??, ??) VALUES (?, ?)"
  const replacements = ["users", "first_name", "last_name", "Bolten", "Beebs"]
  sql = mysql.format(sql, replacements)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
}

const updateUserById = (req, res) => {
  let sql = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?"
  const replacements =
  ["users",
  "first_name", "newFirstName",
  "last_name", "newLastName",
  "id", req.params.id]
  sql = mysql.format(sql, replacements)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  let sql = "DELETE FROM ?? WHERE ?? = ?"
  const replacements = [ "users", "first_name", req.params.first_name]
  console.log(req.params.first_name)
  sql = mysql.format(sql, replacements)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}