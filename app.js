const express = require("express");
const { getTopics, getArticles } = require("./Controllers/controller.js");

const app = express();

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles",getArticles);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
