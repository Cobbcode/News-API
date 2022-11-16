const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchArticleComments,
  insertCommentOnArticle,
  updateArticle,
} = require("../Models/model.js");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
   const article_id = req.params.article_id;
   fetchArticleComments(article_id).then((comments) => {
      res.send({comments})
   })
   .catch((err) => {
      next(err);
   })
}
exports.postCommentOnArticle = (req, res, next) => {
   const article_id = req.params.article_id;
   const newComment = req.body;
   insertCommentOnArticle(article_id, newComment)
     .then((comment) => {
       res.status(201).send({ comment });
     })
     .catch((err) => {
       next(err);
     });
 };
exports.patchArticle = (req, res, next) => {
   const article_id = req.params.article_id;
   const newArticleInfo = req.body;
   updateArticle(article_id,newArticleInfo).then((newArticleInfo) => {
      res.send({article: newArticleInfo})
   })
   .catch((err) => {
      next(err);
   })
}
