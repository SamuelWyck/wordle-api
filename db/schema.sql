CREATE TABLE IF NOT EXISTS used_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(5) NOT NULL UNIQUE,
    day_used TIMESTAMP NOT NULL
);