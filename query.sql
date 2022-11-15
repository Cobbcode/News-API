\c nc_news_test

SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.body)
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;