const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT author, title, article_id, body, topic, created_at, votes
       FROM articles
       WHERE article_id = $1;`,[article_id]
    )
    .then((result) => {
      return result.rows;
    });
};
