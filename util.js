const db = require("./db/connection.js");
const format = require("pg-format");

exports.checkDataExists = (table, column, filterValue) => {
  const queryStr = format(
    "SELECT * FROM %I WHERE %I = %L;",
    table,
    column,
    filterValue
  );
  return db.query(queryStr).then((result) => {
    if (filterValue && result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Data not found" });
    }
  });
};
