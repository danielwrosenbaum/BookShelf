require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const db = require('./db');

const app = express();

const jsonMiddleware = express.json();

app.use(staticMiddleware);

app.use(jsonMiddleware);

app.get('/api/bookShelf/library', (req, res, next) => {
  const sql = `
  select *
    from "library"
    order by "libraryId"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

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

app.patch('/api/bookShelf/library/:googleId', (req, res, next) => {
  const googleId = req.params.googleId;
  if (!googleId) {
    res.status(400).json({
      error: 'googleId is required'
    });
    return;
  }
  const { stars } = req.body;
  const sql = `
  update "library"
    set "stars" = $1
    where "googleId" = $2
    returning *
  `;
  const params = [stars, googleId];
  db.query(sql, params)
    .then(result => {
      const [entry] = result.rows;
      res.status(201).json(entry);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
