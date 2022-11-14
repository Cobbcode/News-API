const db = require ("../db/connection.js")

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows
    })

}

exports.fetchArticles = () => {
    return db.query(`SELECT *, COUNT(article_id)::int AS comment_count
    FROM articles 
    GROUP BY article_id
    ORDER BY created_at DESC`).then((result) => {
        return result.rows
    })

}