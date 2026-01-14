CREATE TABLE IF NOT EXISTS used_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(5) NOT NULL UNIQUE,
    date_used TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS wordle_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remaining_guesses INT DEFAULT 6 NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS wordle_game_guesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL,
    word VARCHAR(5) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "fk_game_id" FOREIGN KEY (game_id) REFERENCES wordle_games(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS all_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(5) NOT NULL UNIQUE
);