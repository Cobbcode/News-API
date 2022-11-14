const { fetchTopics, fetchArticleById } = require("../Models/model.js")

exports.getTopics = (req, res, next) => {
     fetchTopics().then((topics) => {
        res.send({ topics })
     })
     .catch((err) => {
        next(err);
     })
}


exports.getArticleById = (req,res,next) => {
   const article_id = req.params.article_id;
   fetchArticleById(article_id).then((article) => {
      res.send({article})
   })
   .catch((err) => {
      next(err);
   })
}