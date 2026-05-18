-- Reload 150 fictitious Estonia-based users for review/demo data.
-- Login password for every seed user is: password123

BEGIN;

-- Remove old seed users only. Cascades delete their profiles, bios, and hobbies.
DELETE FROM users
WHERE email LIKE 'seed%@matchme.test';

CREATE TEMP TABLE seed_data ON COMMIT DROP AS
SELECT
    n,
    'seed' || LPAD(n::TEXT, 3, '0') || '@matchme.test' AS email,
    '$2y$10$/x64YLBjPz3x48b70.313eMeFKUKFbsMdz9DuJik4m4Tvkmy1TqZq' AS password_hash,
    CASE
        WHEN n <= 54 THEN 'Tallinn'
        WHEN n <= 72 THEN 'Tartu'
        WHEN n <= 83 THEN 'Narva'
        WHEN n <= 91 THEN 'Pärnu'
        WHEN n <= 98 THEN 'Kohtla-Järve'
        WHEN n <= 103 THEN 'Viljandi'
        WHEN n <= 108 THEN 'Rakvere'
        WHEN n <= 113 THEN 'Maardu'
        WHEN n <= 117 THEN 'Kuressaare'
        WHEN n <= 121 THEN 'Võru'
        WHEN n <= 125 THEN 'Valga'
        WHEN n <= 129 THEN 'Haapsalu'
        WHEN n <= 133 THEN 'Jõhvi'
        WHEN n <= 136 THEN 'Paide'
        WHEN n <= 139 THEN 'Keila'
        WHEN n <= 142 THEN 'Sillamäe'
        WHEN n <= 144 THEN 'Rapla'
        WHEN n <= 146 THEN 'Elva'
        WHEN n <= 148 THEN 'Põlva'
        ELSE 'Türi'
    END AS city,
    (
        ARRAY[
            'Mari','Kadri','Liis','Kärt','Maarika','Triin','Anu','Eleri','Kaisa','Pille',
            'Jaan','Marten','Rasmus','Kristjan','Tanel','Andres','Sander','Ott','Priit','Siim',
            'Anna','Olga','Natalia','Irina','Jelena','Svetlana','Daria','Ksenia','Maria','Viktoria',
            'Ivan','Aleksandr','Dmitri','Sergei','Maksim','Nikita','Andrei','Pavel','Roman','Artjom',
            'Mika','Laura','Sofia','Daniel','Markus','Emma','Noah','Mia','Lucas','Eva'
        ]
    )[1 + ((n - 1) % 50)] AS first_name,
    (
        ARRAY[
            'Tamm','Saar','Sepp','Kask','Mägi','Kukk','Rebane','Ilves','Põder','Lepp',
            'Koppel','Kuusk','Raud','Kallas','Luts','Mets','Vaher','Oja','Kivi','Paju',
            'Ivanov','Petrov','Sidorov','Smirnov','Kuznetsov','Volkov','Sokolov','Popov','Orlov','Morozov',
            'Novikov','Vasiljev','Fedorov','Mihhailov','Pavlov','Aleksejev','Lebedev','Kozlov','Egorov','Stepanov',
            'Miller','Schmidt','Virtanen','Korhonen','Jensen','Nielsen','Garcia','Martin','Brown','Wilson'
        ]
    )[1 + ((n - 1) % 50)] AS last_name,
    CASE (n % 3)
        WHEN 0 THEN 'weeknights'
        WHEN 1 THEN 'weekends'
        ELSE 'flexible'
    END AS availability,
    CASE (n % 3)
        WHEN 0 THEN 'outdoor'
        WHEN 1 THEN 'indoor'
        ELSE 'both'
    END AS activity_preference,
    CASE (n % 4)
        WHEN 0 THEN 'friendship'
        WHEN 1 THEN 'date'
        WHEN 2 THEN 'activity_partner'
        ELSE 'professional'
    END AS looking_for,
    CASE
        WHEN n <= 54 THEN 20
        WHEN n <= 98 THEN 25
        ELSE 35
    END AS max_distance_km
FROM generate_series(1, 150) AS n;

ALTER TABLE seed_data ADD COLUMN user_id BIGINT;
ALTER TABLE seed_data ADD COLUMN full_name TEXT;

UPDATE seed_data
SET full_name = first_name || ' ' || last_name;

WITH inserted_users AS (
    INSERT INTO users (email, password_hash)
    SELECT email, password_hash
    FROM seed_data
    ORDER BY n
    RETURNING id, email
)
UPDATE seed_data
SET user_id = inserted_users.id
FROM inserted_users
WHERE seed_data.email = inserted_users.email;

INSERT INTO profiles (user_id, name, about_me, city, picture_link, complete)
SELECT
    user_id,
    full_name,
    'I live in ' || city || ' and I am looking for people with shared hobbies around Estonia.',
    city,
    'https://api.dicebear.com/9.x/initials/svg?seed=' || REPLACE(full_name, ' ', '%20'),
    TRUE
FROM seed_data;

INSERT INTO user_bios (
    user_id,
    max_distance_km,
    availability,
    activity_preference,
    looking_for,
    complete
)
SELECT
    user_id,
    max_distance_km,
    availability,
    activity_preference,
    looking_for,
    TRUE
FROM seed_data;

INSERT INTO user_hobbies (user_id, hobby_id)
SELECT
    seed_data.user_id,
    1 + ((seed_data.n + hobby_offsets.offset_value) % 15) AS hobby_id
FROM seed_data
CROSS JOIN (
    VALUES (0), (3), (7), (11)
) AS hobby_offsets(offset_value)
ON CONFLICT DO NOTHING;

COMMIT;
