const express = require("express");

const { getTopics, getArticles, getArticleById } = require("./Controllers/controller.js");

const app = express();

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles",getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "Invalid article ID syntax - must be a number" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
});

module.exports = app;