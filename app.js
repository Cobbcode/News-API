const express = require("express");

const { getTopics, getArticles, getArticleComments} = require("./Controllers/controller.js");


const app = express();

app.use(express.json());
app.get("/api/topics", getTopics);

app.get("/api/articles",getArticles);

app.get("/api/articles/:article_id/comments",getArticleComments)



app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
