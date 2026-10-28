CREATE TABLE IF NOT EXISTS portfolio (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  document TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS media_chunks (
  media_id TEXT NOT NULL REFERENCES media(id),
  position INTEGER NOT NULL,
  bytes BLOB NOT NULL,
  PRIMARY KEY (media_id, position)
);
