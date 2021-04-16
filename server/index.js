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
    join "books" using ("bookId")
    where "isRead" = 'true'
    order by "bookId"
  `;
  } else if (list === 'readingList') {
    sql = `
    select *
    from "readingList"
    join "books" using ("bookId")
    where "isRead" = 'false'
    order by "bookId"
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
  const { title, author, bookId, coverUrl, rating, isRead } = req.body;
  if (!title || !author || !bookId) {
    throw new ClientError(401, 'invalid post');
  }
  const bookSql = `
  insert into "books" ("title", "author", "bookId", "coverUrl")
  values ($1, $2, $3, $4)
  on conflict("bookId")
  do nothing
  returning *
  `;
  const readingListSql = `
  insert into "readingList" ("title", "bookId", "rating", "isRead")
  values ($1, $2, $3, $4)
  on conflict("bookId")
  do nothing
  returning *
  `;
  const bookParams = [title, author, bookId, coverUrl];
  const listParams = [title, bookId, rating, isRead];
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

app.patch('/api/bookShelf/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  const { rating } = req.body;
  const sql = `
  update "readingList"
    set "rating" = $1
    where "bookId" = $2
    returning *
  `;
  const params = [rating, bookId];
  db.query(sql, params)
    .then(result => {
      const [entry] = result.rows;
      res.status(201).json(entry);
    })
    .catch(err => next(err));
});

app.delete('/api/bookShelf/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  const sql = `
  delete from "readingList"
    where "bookId" = $1
    returning *
  `;
  const values = [bookId];
  db.query(sql, values)
    .then(result => {
      const book = result.rows[0];
      if (!book) {
        res.status(404).json({
          error: `Cannot find book with ID of ${bookId}, please try again.`
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
