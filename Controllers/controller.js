const { fetchTopics, fetchArticles } = require("../Models/model.js")

exports.getTopics = (req, res, next) => {
     fetchTopics().then((topics) => {
        res.send({ topics })
     })
     .catch((err) => {
        next(err);
     })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
       res.send({ articles })
    })
    .catch((err) => {
       next(err);
    })
}