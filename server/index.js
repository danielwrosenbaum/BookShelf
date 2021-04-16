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

app.get('/api/bookShelf/:table', (req, res, next) => {
  const table = req.params.table;
  let sql;
  if (table === 'library') {
    sql = `
  select *
    from "library"
    order by "libraryId"
  `;
  } else if (table === 'readingList') {
    sql = `
    select *
      from "readingList"
      order by "readingListId"
    `;
  } else {
    throw new ClientError(401, `${table} is not a valid table.`);
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
  insert into "readingList" ("googleId", "rating", "isRead")
  values ($1, $2, $3)
  on conflict("googleId")
  do nothing
  returning *
  `;
  const bookParams = [title, author, googleId, coverUrl];
  const listParams = [googleId, rating, isRead];
  db.query(bookSql, bookParams)
    .then(result => {
      // console.log(result.rows[0]);
      // const newLibraryEntry = {
      //   title: result.rows[0].title,
      //   author: result.rows[0].author,
      //   googleId: result.rows[0].googleId,
      //   coverUrl: result.rows[0].coverUrl,
      //   addedAt: result.rows[0].addedAt
      // };

      return db.query(readingListSql, listParams)
        .then(listResult => {
          // console.log(listResult.rows[0]);
          const newListEntry = {
            googleId: listResult.rows[0].googleId,
            rating: listResult.rows[0].rating,
            isRead: listResult.rows[0].isRead
          };
          res.status(201).json(newListEntry);
        });
    })
    .catch(err => next(err));

});

app.post('/api/bookShelf/readingList', (req, res, next) => {
  const { title, author, googleId, coverUrl } = req.body;
  if (!title || !author || !googleId) {
    throw new ClientError(401, 'invalid post');
  }
  const sql = `
  insert into "readingList" ("title", "author", "googleId", "coverUrl")
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

app.delete('/api/bookShelf/:table/:googleId', (req, res, next) => {
  const table = req.params.table;
  const googleId = req.params.googleId;
  let sql;
  if (table === 'library') {
    sql = `
  delete from "library"
    where "googleId" = $1
    returning *
`;
  } else if (table === 'readingList') {
    sql = `
  delete from "readingList"
    where "googleId" = $1
    returning *
  `;
  }
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
