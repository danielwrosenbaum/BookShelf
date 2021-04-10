set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "public"."library" (
  "libraryId"           serial,
  "title"               text          not null,
  "author"              text          not null,
  "googleId"            text          not null,
  "coverUrl"            text,
  "addedAt"             timestamptz(6) not null default now(),
  primary key ("libraryId"),
  unique ("googleId")
);
