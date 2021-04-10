require('dotenv/config');
// const pg = require('pg');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const db = require('./db');

const app = express();

const jsonMiddleware = express.json();

app.use(staticMiddleware);

app.use(jsonMiddleware);

app.post('/api/bookShelf', (req, res, next) => {
  const { title, author, googleId, coverUrl } = req.body;
  if (!title || !author || !googleId) {
    throw new ClientError(401, 'invalid post');
  }
  const sql = `
  insert into "library" ("title", "author", "googleId", "coverUrl")
  values ($1, $2, $3, $4)
  returning *
  `;
  const params = [title, author, googleId, coverUrl];
  db.query(sql, params)
    .then(result => {
      const newLibraryEntry = {
        title: result.rows[0].title,
        author: result.rows[0].author,
        googleId: result.rows[0].googleId,
        coverUrl: result.rows[0].coverUrl,
        addedAt: result.rows[0].addedAt
      };
      res.status(201).json(newLibraryEntry);
    })
    .catch(err => next(err));
});
app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
