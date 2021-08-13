CREATE TABLE flashcards (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    front VARCHAR(50) NOT NULL,
    back VARCHAR(50) NOT NULL
)
WITH (oids = false);

INSERT INTO flashcards (front, back) values ('א', 'a/silent');
INSERT INTO flashcards (front, back) values ('ב', 'b/v');
INSERT INTO flashcards (front, back) values ('ג', 'g');
INSERT INTO flashcards (front, back) values ('ד', 'd');
INSERT INTO flashcards (front, back) values ('ה', 'ha/ah');
INSERT INTO flashcards (front, back) values ('ו', 'v/o/u');
INSERT INTO flashcards (front, back) values ('ז', 'z');
INSERT INTO flashcards (front, back) values ('ח', 'kh');
INSERT INTO flashcards (front, back) values ('ט', 't');
INSERT INTO flashcards (front, back) values ('י', 'y/i');
INSERT INTO flashcards (front, back) values ('כ', 'k/kh');
INSERT INTO flashcards (front, back) values ('ך', 'kh (as the last letter of a word)');
INSERT INTO flashcards (front, back) values ('ל', 'L');
INSERT INTO flashcards (front, back) values ('מ', 'm');
INSERT INTO flashcards (front, back) values ('ם', 'm (as the last letter of a word)');
INSERT INTO flashcards (front, back) values ('נ', 'n');
INSERT INTO flashcards (front, back) values ('ן', 'n (as the last letter of a word)');
INSERT INTO flashcards (front, back) values ('ס', 's');
INSERT INTO flashcards (front, back) values ('ע', 'a/silent');
INSERT INTO flashcards (front, back) values ('פ', 'p/f');
INSERT INTO flashcards (front, back) values ('ף', 'f (as the last letter of a word)');
INSERT INTO flashcards (front, back) values ('צ', 'ts');
INSERT INTO flashcards (front, back) values ('ץ', 'ts (as the last letter of a word)');
INSERT INTO flashcards (front, back) values ('ק', 'k');
INSERT INTO flashcards (front, back) values ('ר', 'r');
INSERT INTO flashcards (front, back) values ('ש', 'sh/s');
INSERT INTO flashcards (front, back) values ('ת', 't');

CREATE TABLE users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    hash TEXT NOT NULL,
    difficulty int default 0,
    exp int default 0
)
WITH (oids = false);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE user_flashcard (
  user_id    int REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  flashcard_id int REFERENCES flashcards (id) ON UPDATE CASCADE,
  correctRecall int NOT NULL DEFAULT 0,
  prevInterval int default 600,
  reviewDateTime timestamptz default NOW(),

  CONSTRAINT user_flashcard_pkey PRIMARY KEY (user_id, flashcard_id)  -- explicit pk
)
WITH (oids = false);

CREATE TABLE quiz (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    heb VARCHAR(50) NOT NULL,
    eng VARCHAR(50) NOT NULL,
    difficulty VARCHAR(5) NOT NULL default 0
)
WITH (oids = false);

INSERT INTO quiz (heb, eng, difficulty) values ('מנגו', 'Mango', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('בננה', 'Banana', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('מזל טוב', 'Mazal tov', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('אפריקה', 'Africa', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('פייסבוק', 'Facebook', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('אילת', 'Eilat', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('מקסיקו', 'Mexico', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('ברזיל', 'Brazil', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('איסלנד', 'Iceland', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('בר מצווה', 'Bar Mitzvah', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('בת מצווה', 'Bat Mitzvah', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('חוצפה', 'Chutzpah', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('שבת', 'Shabbat', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('או מיי גאד', 'Oh My God', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('בלגן', 'Balagan (Mess)', 0);
INSERT INTO quiz (heb, eng, difficulty) values ('פסיפיק', 'Pacific', 0);
