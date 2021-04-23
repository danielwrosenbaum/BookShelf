require('dotenv/config');
const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const db = require('./db');

const app = express();

const jsonMiddleware = express.json();

app.use(staticMiddleware);

app.use(jsonMiddleware);

app.post('/api/bookShelf/:action', (req, res, next) => {
  const action = req.params.action;
  if (action === 'sign-in') {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
    const params = [username];
    db.query(sql, params)
      .then(result => {
        const [user] = result.rows;
        if (!user) {
          throw new ClientError(401, 'invalid login');
        }
        const { userId, hashedPassword } = user;
        return argon2
          .verify(hashedPassword, password)
          .then(isMatching => {
            if (!isMatching) {
              throw new ClientError(401, 'invalid login');
            }
            const payload = { userId, username };
            const token = jwt.sign(payload, process.env.TOKEN_SECRET);
            res.json({ token, user: payload });
          });
      })
      .catch(err => next(err));
  } else if (action === 'sign-up') {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    argon2
      .hash(password)
      .then(hashedPassword => {
        const sql = `
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning "userId", "username", "createdAt"
      `;
        const params = [username, hashedPassword];
        return db.query(sql, params);
      })
      .then(result => {
        const [user] = result.rows;
        res.status(201).json(user);
      })
      .catch(err => {
        if (err.code === '23505') {
          res.send(err.code);
        } else {
          next(err);
        }

      });
  }
});

app.get('/api/bookShelf/:list/:userId', (req, res, next) => {
  const list = req.params.list;
  const userId = req.params.userId;
  let sql;
  if (list === 'library') {
    sql = `
  select *
    from "readingList"
    join "books" using ("bookId")
    where "isRead" = 'true'
    and "userId" = $1
    order by "addedId"
  `;
  } else if (list === 'readingList') {
    sql = `
    select *
    from "readingList"
    join "books" using ("bookId")
    where "isRead" = 'false'
    and "userId" = $1
    order by "addedId"
    `;
  } else {
    throw new ClientError(401, `${list} is not a valid list.`);
  }
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/bookShelf/', (req, res, next) => {
  const { title, author, bookId, coverUrl, rating, isRead, userId } = req.body;
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
  insert into "readingList" ("title", "bookId", "rating", "isRead", "userId")
  values ($1, $2, $3, $4, $5)
  returning *
  `;
  const bookParams = [title, author, bookId, coverUrl];
  const listParams = [title, bookId, rating, isRead, userId];
  db.query(bookSql, bookParams)
    .then(result => {
      return db.query(readingListSql, listParams)
        .then(listResult => {
          if (listResult.rows[0]) {
            if (listResult.rows[0].isRead === true) {
              res.status(201).json(listResult.rows[0]);
            } else {
              res.status(201).json(listResult.rows[0]);
            }
          } else {
            throw new ClientError(401, 'already added!');
          }
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));

});

app.patch('/api/bookShelf/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  const { rating, userId } = req.body;
  const sql = `
  update "readingList"
    set "rating" = $1
    where "bookId" = $2
    and "userId" = $3
    returning *
  `;
  const params = [rating, bookId, userId];
  db.query(sql, params)
    .then(result => {
      const [entry] = result.rows;
      res.status(201).json(entry);
    })
    .catch(err => next(err));
});

app.delete('/api/bookShelf/:bookId/:userId', (req, res, next) => {
  const bookId = req.params.bookId;
  const userId = req.params.userId;
  const sql = `
  delete from "readingList"
    where "bookId" = $1
    and "userId" = $2
    returning *
  `;
  const values = [bookId, userId];
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
