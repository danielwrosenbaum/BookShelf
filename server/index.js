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

app.get('/api/bookShelf/:list', (req, res, next) => {
  const list = req.params.list;
  let sql;
  if (list === 'library') {
    sql = `
  select *
    from "readingList"
    join "books" using ("googleId")
    where "isRead" = 'true'
    order by "googleId"
  `;
  } else if (list === 'readingList') {
    sql = `
    select *
    from "readingList"
    join "books" using ("googleId")
    where "isRead" = 'false'
    order by "googleId"
    `;
  } else {
    throw new ClientError(401, `${list} is not a valid list.`);
  }

  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/bookShelf/', (req, res, next) => {
  const { title, author, googleId, coverUrl, rating, isRead } = req.body;
  if (!title || !author || !googleId) {
    throw new ClientError(401, 'invalid post');
  }
  const bookSql = `
  insert into "books" ("title", "author", "googleId", "coverUrl")
  values ($1, $2, $3, $4)
  on conflict("googleId")
  do nothing
  returning *
  `;
  const readingListSql = `
  insert into "readingList" ("title", "googleId", "rating", "isRead")
  values ($1, $2, $3, $4)
  on conflict("googleId")
  do nothing
  returning *
  `;
  const bookParams = [title, author, googleId, coverUrl];
  const listParams = [title, googleId, rating, isRead];
  db.query(bookSql, bookParams)
    .then(result => {
      return db.query(readingListSql, listParams)
        .then(listResult => {
          if (listResult.rows[0]) {
            if (listResult.rows[0].isRead === true) {
              res.status(201).json(listResult.rows[0]);
            } else {
              res.status(204).json(listResult.rows[0]);
            }
          } else {
            throw new ClientError(401, 'already added!');
          }
        });
    })
    .catch(err => next(err));

});

app.patch('/api/bookShelf/:googleId', (req, res, next) => {
  const googleId = req.params.googleId;
  const { rating } = req.body;
  const sql = `
  update "readingList"
    set "rating" = $1
    where "googleId" = $2
    returning *
  `;
  const params = [rating, googleId];
  db.query(sql, params)
    .then(result => {
      const [entry] = result.rows;
      res.status(201).json(entry);
    })
    .catch(err => next(err));
});

app.delete('/api/bookShelf/:googleId', (req, res, next) => {
  const googleId = req.params.googleId;
  const sql = `
  delete from "readingList"
    where "googleId" = $1
    returning *
  `;
  const values = [googleId];
  db.query(sql, values)
    .then(result => {
      const book = result.rows[0];
      if (!book) {
        res.status(404).json({
          error: `Cannot find book with ID of ${googleId}, please try again.`
        });
      } else {
        res.status(204).json(book);
      }
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
