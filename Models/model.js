const db = require("../db/connection.js");
const { checkArticleExists } = require("../util.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes, COUNT(article_id)::int AS comment_count
    FROM articles 
    GROUP BY article_id
    ORDER BY created_at DESC`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticleComments = (article_id) => {
  return checkArticleExists(article_id).then(() => {
    // throws error if doesn't exist
    return db
      .query(
        `SELECT comment_id, votes, created_at, author, body 
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        `,
        [article_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};