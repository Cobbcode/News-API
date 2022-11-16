const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleComments,
  getArticleById,
  postCommentOnArticle,
  patchArticle,
} = require("./Controllers/controller.js");

const app = express();

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postCommentOnArticle)
app.patch("/api/articles/:article_id", patchArticle);


app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid article ID - must be a number" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Username not found" });
  } else {
    next(err);
  }
});




app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
