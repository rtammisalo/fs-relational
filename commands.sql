CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES (
    'Mikke',
    'https://mikkegoes.com/start-a-programming-blog/',
    'How To Start A Programming Blog In 2022: Step-by-Step Tutorial',
    10
);

INSERT INTO blogs (author, url, title) VALUES (
    'William Yao',
    'https://williamyaoh.com/posts/2020-01-11-road-to-proficient.html',
    'The road to proficient Haskell'
);
