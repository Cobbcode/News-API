const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
    return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.body)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`).then((result) => {
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

