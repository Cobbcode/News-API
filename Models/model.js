const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
    return db.query(`SELECT author, title, article_id, topic, created_at, votes, COUNT(article_id)::int AS comment_count
    FROM articles 
    GROUP BY article_id
    ORDER BY created_at DESC`).then((result) => {
        return result.rows
    })

}

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT author, title, article_id, body, topic, created_at, votes
       FROM articles
       WHERE article_id = $1;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: "Article ID does not exist" });
      } else {
        return result.rows[0];
      }
    });
};

