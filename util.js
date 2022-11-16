const db = require("./db/connection.js");

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article ID not found" });
      }
    });
};

exports.checkTopicExists = (topic) => {
    return db
      .query(
        `SELECT * FROM topics
         WHERE slug = $1`,
        [topic]
      )
      .then((result) => {
        if (topic && result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Topic name not found" });
        }
      });
};
