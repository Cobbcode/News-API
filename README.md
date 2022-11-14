# News API

## Setup
We'll have two databases in this project. One for real looking at dev data and another for our simpler test data.

You will need to create two .env files for your project: .env.test and .env.development. Into the test file, add ``PGDATABASE=nc_news_test``, and into the development file add ``PGDATABASE=nc_news``.