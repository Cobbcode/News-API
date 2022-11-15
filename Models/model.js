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
      `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.body)::INT AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

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
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.fetchArticleComments = (article_id) => {
  return checkArticleExists(article_id).then(() => {
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

exports.updateArticle = (article_id, newArticleInfo) => {
  return checkArticleExists(article_id).then(() => {
    if (Object.keys(newArticleInfo).length !== 1 || !newArticleInfo.inc_votes) {
      return Promise.reject({
        status: 400,
        msg: "Bad request - invalid patch object",
      });
    } else {
    return db
      .query(
        `UPDATE articles
           SET votes = votes + $1
           WHERE article_id = $2 
           RETURNING *;`,
        [newArticleInfo.inc_votes, article_id]
      )
      .then((result) => {
        return result.rows[0];
      });
    }
  });
}