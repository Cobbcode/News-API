const db = require ("../db/connection.js")

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        console.log("line 5")
        return result.rows
    })
}