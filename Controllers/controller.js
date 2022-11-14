const { fetchTopics } = require("../Models/model.js")

exports.getTopics = (req, res, next) => {
     fetchTopics().then((topics) => {
        res.send({ topics })
     })
     .catch((err) => {
        next(err);
     })
}


exports.getArticleById = (req,res,next) => {
   fetchArticleById().then((article))
}