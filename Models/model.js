const db = require("../db/connection.js");
const { checkArticleExists, checkTopicExists } = require("../util.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  return checkTopicExists(topic).then(() => {
    const sortGreenlist = [
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ];

    if (order !== "asc" && order !== "desc") {
      return Promise.reject({
        status: 400,
        msg: "Invalid order query - must be desc or asc",
      });
    }

    if (!sortGreenlist.includes(sort_by)) {
      return Promise.reject({ status: 404, msg: "Column name not found" });
    }

    let queryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.body)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id`;

    let queryValues = [];

    if (topic) {
      queryStr += ` WHERE topic = $1`;
      queryValues.push(topic);
    }
    queryStr += ` GROUP BY articles.article_id
                       ORDER BY ${sort_by} ${order};`;

    return db.query(queryStr, queryValues).then((result) => {
      return result.rows;
    });
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, COUNT(comments.body)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
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

exports.insertCommentOnArticle = (article_id, newComment) => {
  return checkArticleExists(article_id).then(() => {
    if (
      Object.keys(newComment).length !== 2 ||
      !newComment.body ||
      !newComment.username
    ) {
      return Promise.reject({
        status: 400,
        msg: "Bad request",
      });
    } else {
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
          return result.rows[0];
        });
    }
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
};
exports.fetchUsers = () => {
  return db
    .query(
      `SELECT username, name, avatar_url
        FROM users;`
    )
    .then((result) => {
      return result.rows;
    });
};
