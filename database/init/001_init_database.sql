-- Create the authentication table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create one profile per registered user
CREATE TABLE IF NOT EXISTS profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT '',
    about_me TEXT NOT NULL DEFAULT '',
    city VARCHAR(100) NOT NULL DEFAULT '',
    picture_link TEXT,
    complete BOOLEAN NOT NULL DEFAULT FALSE
);

-- Hobbies available to all users
CREATE TABLE IF NOT EXISTS hobbies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE
);

-- One bio/preferences row per user
CREATE TABLE IF NOT EXISTS user_bios (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    max_distance_km INTEGER NOT NULL DEFAULT 20,
    availability VARCHAR(30) NOT NULL DEFAULT '',
    activity_preference VARCHAR(30) NOT NULL DEFAULT '',
    looking_for VARCHAR(30) NOT NULL DEFAULT '',
    complete BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT user_bios_max_distance_check CHECK (max_distance_km > 0),
    CONSTRAINT user_bios_availability_check CHECK (
        availability IN ('', 'weeknights', 'weekends', 'flexible')
    ),
    CONSTRAINT user_bios_activity_preference_check CHECK (
        activity_preference IN ('', 'outdoor', 'indoor', 'both')
    ),
    CONSTRAINT user_bios_looking_for_check CHECK (
        looking_for IN ('', 'friendship', 'date', 'activity_partner', 'professional')
    )
);

-- Connect users to their selected hobbies
CREATE TABLE IF NOT EXISTS user_hobbies (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hobby_id BIGINT NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, hobby_id)
);

-- Seed the fixed hobby list used by the bio form
INSERT INTO hobbies (id, name) VALUES
    (1, 'Sauna & cold plunge'),
    (2, 'Hiking & nature trails'),
    (3, 'Padel / Tennis'),
    (4, 'Board games & RPGs'),
    (5, 'Video games (PC/console)'),
    (6, 'Gym & fitness training'),
    (7, 'Running / Park run'),
    (8, 'Yoga & mindfulness'),
    (9, 'Cycling (urban or MTB)'),
    (10, 'Photography / Phone photography'),
    (11, 'Dancing (folk, salsa, or electro)'),
    (12, 'Live music & concerts'),
    (13, 'Cooking & meal prep'),
    (14, 'Travel & weekend trips'),
    (15, 'Volunteering / community events')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

SELECT setval('hobbies_id_seq', (SELECT MAX(id) FROM hobbies));
