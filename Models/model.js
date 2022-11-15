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
    })
}

exports.insertCommentOnArticle = (article_id, newComment) => {
  return checkArticleExists(article_id).then(() => {
    return db
      .query(
        `
      INSERT INTO comments
          (body, author, article_id)
        VALUES
            ($1, $2, $3) 
            RETURNING *;`,
        [newComment.body, newComment.username, article_id]
      )
      .then((result) => {
        console.log(result.rows[0]);
        return result.rows[0];
      });
  });
};





