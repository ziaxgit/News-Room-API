# [News Room API](https://zia-nc-news.onrender.com/api)

A RESTful API that serves as the backend of my website [News Room](https://zias-news.netlify.app/) which is similar to Reddit in functionality. The website features a collection of articles, users, and comments, and this API allows access to these various information. User is able to filter articles by topic, sort by date, title, article ID, author, or number of votes in ascending or descending order. Additionally, you can vote on articles or comments and post/delete specific articles and the comments of an article.

## Technology Stack

Built using Node.js, Express.js for the server, and PostgreSQL for the database. 
Development tools include Husky, Nodemon, Supertest, Jest, Jest-Sorted, and Pg-Format.

## [Click here to view hosted version](https://zia-nc-news.onrender.com/api)

### Available Routes

| Endpoint                                    | Description                                                         |
| ------------------------------------------- | ------------------------------------------------------------------- |
| **GET** /api                                | Retrieve a JSON representation of all available endpoints.          |
| **GET** /api/topics                         | Retrieve an array of all topics.                                    |
| **POST** /api/topics                        | Create a new topic in the database and return the new topic.        |
| **GET** /api/articles                       | Retrieve an array of all articles.                                  |
| **POST** /api/articles                      | Create a new article in the database and return the new article.    |
| **GET** /api/articles/:article_id           | Retrieve an article object for the specified article id.            |
| **PATCH** /api/articles/:article_id         | Update the number of votes for the specified article and return it. |
| **DELETE** /api/articles/:article_id        | Delete the specified article and return with status 204.            |
| **GET** /api/articles/:article_id/comments  | Retrieve an array of comments for the specified article id.         |
| **POST** /api/articles/:article_id/comments | Add a comment to the specified article and return the new comment.  |
| **PATCH** /api/comments/:comment_id         | Update the number of votes for the specified comment and return it. |
| **DELETE** /api/comments/:comment_id        | Delete the specified comment and return with status 204.            |
| **GET** /api/users                          | Retrieve an array of all current users.                             |
| **GET** /api/users/:username                | Retrieve a user object for the specified username.                  |

### **GET** /api/articles Query Parameters
| Query   | Options                                         | Default    |
| ------- | ----------------------------------------------- | ---------- |
| sort_by | article_id, author, title, votes | created_at |
| order   | asc, desc                                       | desc       |
| topic   | coding, football, cooking                       | all topics |

## Installation requirements:
- Node.js - version 19.x
- PostgreSQL - version 14.x
## Cloning the repositry:
- In the terminal please enter:
  ```
  $ git clone https://github.com/ziaxgit/News-Room-API.git
  $ cd News-Room-API
  ```
## Installing dependencies:
- The required dependencies will be pulled from the package.json file. In the terminal please enter
  ```
  $ npm install
  ```
## Accessing the databases:
- Once the repo has been successfully cloned, in order to connect to the two databases involved in this project on your local machine you must first create the environment variables yourself.
- You will need to create two `.env` files. One named `.env.test` and another `.env.development`
- In `.env.test` you should add `PGDATABASE=nc_news_test` and in the `.env.development` you should add `PGDATABASE=nc_news`.
- You will now be able to access the two databases on your local machine when the application is run.
## Database set-up and seeding:
- Before using or testing the application, you will need to set up the database and then seed it with the data. In the terminal please enter:
  ```
  $ npm run setup-dbs
  $ npm run seed
  ```
## Testing:
- Jest is the framework used to test this application.
- To run the tests, in the terminal please enter:
  ```
  $ npm run test
  ```
- The test database will be automatically re-seeded before every test to ensure consistency of the tests especially when changing information inside database using CRUD.
## Development mode:
- To run the application in development mode, in the terminal please enter:
  ```
  $ node app.listen.js
  ```
- This will start a server. You can now make requests to your localhost on the specified port and view all of the accessible endpoints.

