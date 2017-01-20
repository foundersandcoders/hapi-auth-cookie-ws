BEGIN;

DROP TABLE IF EXISTS users, topics, type, resources, reviews;

CREATE TABLE IF NOT EXISTS users (
    id          SERIAL     PRIMARY KEY,
    name        TEXT       NOT NULL,
    password    TEXT       NOT NULL
);

INSERT INTO users(name, password) VALUES
  ('William', 'password')

COMMIT;
