set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";


create table "public"."users" (
  "userId"              serial,
  "username"            text          not null,
  "hashedPassword"      text          not null,
  "createdAt"           timestamptz(6)  not null default now(),
  primary key ("userId"),
  unique ("username")
);

create table "public"."books" (
  "bookId"              serial,
  "title"               text          not null,
  "author"              text,
  "googleId"            text          not null,
  "coverUrl"            text,
  "addedAt"             timestamptz(6) not null default now(),
  primary key ("bookId"),
  unique ("googleId")
);

create table "public"."readingList" (
  "userId"               integer not null,
  "googleId"             text not null,
  "rating"               integer,
  "isRead"               boolean,
   primary key ("userId", "googleId"),
   foreign key ("userId")
    references "users" ("userId"),
   foreign key ("googleId")
    references "books" ("googleId")
);

-- create table "public"."readingList" (
--   "readingListId"           serial,
--   "title"               text          not null,
--   "author"              text,
--   "googleId"            text          not null,
--   "coverUrl"            text,
--   "addedAt"             timestamptz(6) not null default now(),
--   primary key ("readingListId"),
--   unique ("googleId")
-- );
