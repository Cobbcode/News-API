# News API

## Introduction
This was a week-long project to build a server that allows the client to interact with a news database. It was built using Node.js, Postgres and Express, and tested using Jest.


## Link to hosted version:

## Setup instructions
To clone this repository on github, first click "Fork" on the top right. Once this fork is created on your own personal github, go into the fork, click the green "code" button and copy the link under "HTTPS".

In your terminal, type ```git clone githubLinkHere``` with the link you copied replacing githubLinkHere.

Once the repository is cloned, open it in VSCode. We'll have two databases in this project. One for real looking at the larger database and another for our simpler test data. You will first need to create two environment variables to tell Node-postgres where to access the required database. Create two new files called .env.test and .env.development. In the .env.test file, add ``PGDATABASE=nc_news_test``, and into the development file add ``PGDATABASE=nc_news``.

Next, open a new terminal and install the required dependencies by running ```npm install```. You will then need to setup the initial database by typing ```npm run setup-dbs```. This uses a script in our package.json file to create the databases. 


There are two test suites: one that tests our utility funcitons (utils.test.js) and one that tests the functionning of our endpoints (app.test.js). To run all tests, type ```npm test``` in the terminal, or to just run the endpoint tests, use ```npm test app.test.js```. The results will appear in the terminal.

So we're not modifying the database every time we run tests, there is a seed file which essentially resets the data tables inside the database each time the seed file is run. This is automatically performed each time a test is run due the the line of code in our test file ```beforeEach(() => seed(testData))```.

## Version compatibility
Note the minimum versions required are:
* Node.js: v19.0.0
* Postgres: 8.7.3



