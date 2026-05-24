-- 150 users
-- Every seed user can log in with password123

BEGIN;

-- Remove seed and test users so every seed run gives a clean demo database
DELETE FROM users
WHERE email LIKE 'seed%@matchme.test'
   OR email LIKE 'feature-test-%@matchme.test'
   OR email LIKE 'project-test-%@matchme.test'
   OR email LIKE 'project-rec-%@matchme.test'
   OR email LIKE 'recommend-%@matchme.test';

-- Seed data
CREATE TEMP TABLE seed_data (
    email TEXT,
    name TEXT,
    city TEXT,
    picture_link TEXT,
    availability TEXT,
    activity_preference TEXT,
    looking_for TEXT,
    max_distance_km INTEGER,
    hobby_1 INTEGER,
    hobby_2 INTEGER,
    hobby_3 INTEGER,
    hobby_4 INTEGER
) ON COMMIT DROP;

INSERT INTO seed_data (
    email,
    name,
    city,
    picture_link,
    availability,
    activity_preference,
    looking_for,
    max_distance_km,
    hobby_1,
    hobby_2,
    hobby_3,
    hobby_4
) VALUES
    ('seed001@matchme.test', 'Mari Tamm', 'Tallinn', 'https://randomuser.me/api/portraits/women/1.jpg', 'weekends', 'outdoor', 'friendship', 20, 1, 2, 3, 4),
    ('seed002@matchme.test', 'Jaan Tamm', 'Tallinn', 'https://randomuser.me/api/portraits/men/1.jpg', 'weekends', 'outdoor', 'friendship', 20, 1, 2, 3, 5),
    ('seed003@matchme.test', 'Kadri Saar', 'Tallinn', 'https://randomuser.me/api/portraits/women/2.jpg', 'flexible', 'both', 'activity_partner', 20, 2, 3, 4, 6),
    ('seed004@matchme.test', 'Marten Saar', 'Tallinn', 'https://randomuser.me/api/portraits/men/2.jpg', 'flexible', 'both', 'activity_partner', 20, 2, 3, 4, 7),
    ('seed005@matchme.test', 'Liis Sepp', 'Tallinn', 'https://randomuser.me/api/portraits/women/3.jpg', 'weeknights', 'indoor', 'date', 20, 4, 5, 6, 7),
    ('seed006@matchme.test', 'Rasmus Sepp', 'Tallinn', 'https://randomuser.me/api/portraits/men/3.jpg', 'weeknights', 'indoor', 'date', 20, 4, 5, 6, 8),
    ('seed007@matchme.test', 'Kaisa Kask', 'Tallinn', 'https://randomuser.me/api/portraits/women/4.jpg', 'flexible', 'outdoor', 'professional', 20, 1, 7, 8, 9),
    ('seed008@matchme.test', 'Kristjan Kask', 'Tallinn', 'https://randomuser.me/api/portraits/men/4.jpg', 'flexible', 'outdoor', 'professional', 20, 1, 7, 8, 10),
    ('seed009@matchme.test', 'Triin Magi', 'Tallinn', 'https://randomuser.me/api/portraits/women/5.jpg', 'weekends', 'both', 'friendship', 20, 2, 8, 9, 10),
    ('seed010@matchme.test', 'Tanel Magi', 'Tallinn', 'https://randomuser.me/api/portraits/men/5.jpg', 'weekends', 'both', 'friendship', 20, 2, 8, 9, 11),
    ('seed011@matchme.test', 'Anu Kukk', 'Tallinn', 'https://randomuser.me/api/portraits/women/6.jpg', 'weeknights', 'outdoor', 'activity_partner', 20, 3, 10, 11, 12),
    ('seed012@matchme.test', 'Andres Kukk', 'Tallinn', 'https://randomuser.me/api/portraits/men/6.jpg', 'weeknights', 'outdoor', 'activity_partner', 20, 3, 10, 11, 13),
    ('seed013@matchme.test', 'Eleri Rebane', 'Tallinn', 'https://randomuser.me/api/portraits/women/7.jpg', 'flexible', 'indoor', 'date', 20, 4, 11, 12, 13),
    ('seed014@matchme.test', 'Sander Rebane', 'Tallinn', 'https://randomuser.me/api/portraits/men/7.jpg', 'flexible', 'indoor', 'date', 20, 4, 11, 12, 14),
    ('seed015@matchme.test', 'Pille Ilves', 'Tallinn', 'https://randomuser.me/api/portraits/women/8.jpg', 'weekends', 'both', 'professional', 20, 5, 13, 14, 15),
    ('seed016@matchme.test', 'Ott Ilves', 'Tallinn', 'https://randomuser.me/api/portraits/men/8.jpg', 'weekends', 'both', 'professional', 20, 5, 12, 14, 15),
    ('seed017@matchme.test', 'Maarika Poder', 'Tallinn', 'https://randomuser.me/api/portraits/women/9.jpg', 'weeknights', 'outdoor', 'friendship', 20, 1, 6, 14, 15),
    ('seed018@matchme.test', 'Priit Poder', 'Tallinn', 'https://randomuser.me/api/portraits/men/9.jpg', 'weeknights', 'outdoor', 'friendship', 20, 1, 6, 13, 15),
    ('seed019@matchme.test', 'Karin Lepp', 'Tallinn', 'https://randomuser.me/api/portraits/women/10.jpg', 'weekends', 'outdoor', 'friendship', 20, 1, 2, 5, 6),
    ('seed020@matchme.test', 'Siim Lepp', 'Tallinn', 'https://randomuser.me/api/portraits/men/10.jpg', 'weekends', 'outdoor', 'friendship', 20, 1, 2, 5, 7),
    ('seed021@matchme.test', 'Helena Koppel', 'Tallinn', 'https://randomuser.me/api/portraits/women/11.jpg', 'flexible', 'both', 'activity_partner', 20, 2, 3, 6, 7),
    ('seed022@matchme.test', 'Mika Koppel', 'Tallinn', 'https://randomuser.me/api/portraits/men/11.jpg', 'flexible', 'both', 'activity_partner', 20, 2, 3, 6, 8),
    ('seed023@matchme.test', 'Laura Kuusk', 'Tallinn', 'https://randomuser.me/api/portraits/women/12.jpg', 'weeknights', 'indoor', 'date', 20, 3, 4, 7, 8),
    ('seed024@matchme.test', 'Daniel Kuusk', 'Tallinn', 'https://randomuser.me/api/portraits/men/12.jpg', 'weeknights', 'indoor', 'date', 20, 3, 4, 7, 9),
    ('seed025@matchme.test', 'Sofia Raud', 'Tallinn', 'https://randomuser.me/api/portraits/women/13.jpg', 'flexible', 'outdoor', 'professional', 20, 4, 5, 8, 9),
    ('seed026@matchme.test', 'Markus Raud', 'Tallinn', 'https://randomuser.me/api/portraits/men/13.jpg', 'flexible', 'outdoor', 'professional', 20, 4, 5, 8, 10),
    ('seed027@matchme.test', 'Emma Kallas', 'Tallinn', 'https://randomuser.me/api/portraits/women/14.jpg', 'weekends', 'both', 'friendship', 20, 5, 6, 9, 10),
    ('seed028@matchme.test', 'Noah Kallas', 'Tallinn', 'https://randomuser.me/api/portraits/men/14.jpg', 'weekends', 'both', 'friendship', 20, 5, 6, 9, 11),
    ('seed029@matchme.test', 'Eva Luts', 'Tallinn', 'https://randomuser.me/api/portraits/women/15.jpg', 'weeknights', 'outdoor', 'activity_partner', 20, 6, 7, 10, 11),
    ('seed030@matchme.test', 'Lucas Luts', 'Tallinn', 'https://randomuser.me/api/portraits/men/15.jpg', 'weeknights', 'outdoor', 'activity_partner', 20, 6, 7, 10, 12),
    ('seed031@matchme.test', 'Anna Mets', 'Tallinn', 'https://randomuser.me/api/portraits/women/16.jpg', 'flexible', 'indoor', 'date', 20, 7, 8, 11, 12),
    ('seed032@matchme.test', 'Ivan Mets', 'Tallinn', 'https://randomuser.me/api/portraits/men/16.jpg', 'flexible', 'indoor', 'date', 20, 7, 8, 11, 13),
    ('seed033@matchme.test', 'Olga Vaher', 'Tallinn', 'https://randomuser.me/api/portraits/women/17.jpg', 'weekends', 'both', 'professional', 20, 8, 9, 12, 13),
    ('seed034@matchme.test', 'Aleksandr Vaher', 'Tallinn', 'https://randomuser.me/api/portraits/men/17.jpg', 'weekends', 'both', 'professional', 20, 8, 9, 12, 14),
    ('seed035@matchme.test', 'Natalia Oja', 'Tallinn', 'https://randomuser.me/api/portraits/women/18.jpg', 'weeknights', 'outdoor', 'friendship', 20, 9, 10, 13, 14),
    ('seed036@matchme.test', 'Dmitri Oja', 'Tallinn', 'https://randomuser.me/api/portraits/men/18.jpg', 'weeknights', 'outdoor', 'friendship', 20, 9, 10, 13, 15),
    ('seed037@matchme.test', 'Irina Kivi', 'Tallinn', 'https://randomuser.me/api/portraits/women/19.jpg', 'flexible', 'both', 'activity_partner', 20, 10, 11, 14, 15),
    ('seed038@matchme.test', 'Sergei Kivi', 'Tallinn', 'https://randomuser.me/api/portraits/men/19.jpg', 'flexible', 'both', 'activity_partner', 20, 1, 10, 11, 14),
    ('seed039@matchme.test', 'Jelena Paju', 'Tallinn', 'https://randomuser.me/api/portraits/women/20.jpg', 'weekends', 'outdoor', 'friendship', 20, 1, 3, 5, 7),
    ('seed040@matchme.test', 'Maksim Paju', 'Tallinn', 'https://randomuser.me/api/portraits/men/20.jpg', 'weekends', 'outdoor', 'friendship', 20, 1, 3, 5, 8),
    ('seed041@matchme.test', 'Svetlana Ivanov', 'Tallinn', 'https://randomuser.me/api/portraits/women/21.jpg', 'weeknights', 'indoor', 'date', 20, 2, 4, 6, 8),
    ('seed042@matchme.test', 'Nikita Ivanov', 'Tallinn', 'https://randomuser.me/api/portraits/men/21.jpg', 'weeknights', 'indoor', 'date', 20, 2, 4, 6, 9),
    ('seed043@matchme.test', 'Daria Petrov', 'Tallinn', 'https://randomuser.me/api/portraits/women/22.jpg', 'flexible', 'both', 'professional', 20, 3, 5, 7, 9),
    ('seed044@matchme.test', 'Andrei Petrov', 'Tallinn', 'https://randomuser.me/api/portraits/men/22.jpg', 'flexible', 'both', 'professional', 20, 3, 5, 7, 10),
    ('seed045@matchme.test', 'Ksenia Sidorov', 'Tallinn', 'https://randomuser.me/api/portraits/women/23.jpg', 'weekends', 'outdoor', 'activity_partner', 20, 4, 6, 8, 10),
    ('seed046@matchme.test', 'Pavel Sidorov', 'Tallinn', 'https://randomuser.me/api/portraits/men/23.jpg', 'weekends', 'outdoor', 'activity_partner', 20, 4, 6, 8, 11),
    ('seed047@matchme.test', 'Maria Smirnov', 'Tallinn', 'https://randomuser.me/api/portraits/women/24.jpg', 'weeknights', 'both', 'friendship', 20, 5, 7, 9, 11),
    ('seed048@matchme.test', 'Roman Smirnov', 'Tallinn', 'https://randomuser.me/api/portraits/men/24.jpg', 'weeknights', 'both', 'friendship', 20, 5, 7, 9, 12),
    ('seed049@matchme.test', 'Viktoria Volkov', 'Tallinn', 'https://randomuser.me/api/portraits/women/25.jpg', 'flexible', 'indoor', 'date', 20, 6, 8, 10, 12),
    ('seed050@matchme.test', 'Artjom Volkov', 'Tallinn', 'https://randomuser.me/api/portraits/men/25.jpg', 'flexible', 'indoor', 'date', 20, 6, 8, 10, 13),
    ('seed051@matchme.test', 'Mia Sokolov', 'Tallinn', 'https://randomuser.me/api/portraits/women/26.jpg', 'weekends', 'outdoor', 'professional', 20, 7, 9, 11, 13),
    ('seed052@matchme.test', 'Karl Sokolov', 'Tallinn', 'https://randomuser.me/api/portraits/men/26.jpg', 'weekends', 'outdoor', 'professional', 20, 7, 9, 11, 14),
    ('seed053@matchme.test', 'Marta Popov', 'Tallinn', 'https://randomuser.me/api/portraits/women/27.jpg', 'flexible', 'both', 'activity_partner', 20, 1, 3, 4, 15),
    ('seed054@matchme.test', 'Erik Popov', 'Tallinn', 'https://randomuser.me/api/portraits/men/27.jpg', 'flexible', 'both', 'activity_partner', 20, 1, 3, 5, 15),

    ('seed055@matchme.test', 'Tuuli Kukk', 'Tartu', 'https://randomuser.me/api/portraits/women/28.jpg', 'weekends', 'outdoor', 'friendship', 25, 1, 2, 3, 4),
    ('seed056@matchme.test', 'Martin Kukk', 'Tartu', 'https://randomuser.me/api/portraits/men/28.jpg', 'weekends', 'outdoor', 'friendship', 25, 1, 2, 3, 5),
    ('seed057@matchme.test', 'Marge Rebane', 'Tartu', 'https://randomuser.me/api/portraits/women/29.jpg', 'flexible', 'both', 'activity_partner', 25, 2, 3, 4, 5),
    ('seed058@matchme.test', 'Rauno Rebane', 'Tartu', 'https://randomuser.me/api/portraits/men/29.jpg', 'flexible', 'both', 'activity_partner', 25, 2, 3, 4, 6),
    ('seed059@matchme.test', 'Airi Ilves', 'Tartu', 'https://randomuser.me/api/portraits/women/30.jpg', 'weeknights', 'indoor', 'date', 25, 3, 4, 5, 6),
    ('seed060@matchme.test', 'Toomas Ilves', 'Tartu', 'https://randomuser.me/api/portraits/men/30.jpg', 'weeknights', 'indoor', 'date', 25, 3, 4, 5, 7),
    ('seed061@matchme.test', 'Kelli Poder', 'Tartu', 'https://randomuser.me/api/portraits/women/31.jpg', 'flexible', 'outdoor', 'professional', 25, 4, 5, 6, 7),
    ('seed062@matchme.test', 'Mihkel Poder', 'Tartu', 'https://randomuser.me/api/portraits/men/31.jpg', 'flexible', 'outdoor', 'professional', 25, 4, 5, 6, 8),
    ('seed063@matchme.test', 'Nele Lepp', 'Tartu', 'https://randomuser.me/api/portraits/women/32.jpg', 'weekends', 'both', 'friendship', 25, 5, 6, 7, 8),
    ('seed064@matchme.test', 'Kaur Lepp', 'Tartu', 'https://randomuser.me/api/portraits/men/32.jpg', 'weekends', 'both', 'friendship', 25, 5, 6, 7, 9),
    ('seed065@matchme.test', 'Heli Koppel', 'Tartu', 'https://randomuser.me/api/portraits/women/33.jpg', 'weeknights', 'outdoor', 'activity_partner', 25, 6, 7, 8, 9),
    ('seed066@matchme.test', 'Argo Koppel', 'Tartu', 'https://randomuser.me/api/portraits/men/33.jpg', 'weeknights', 'outdoor', 'activity_partner', 25, 6, 7, 8, 10),
    ('seed067@matchme.test', 'Jane Kuusk', 'Tartu', 'https://randomuser.me/api/portraits/women/34.jpg', 'flexible', 'indoor', 'date', 25, 7, 8, 9, 10),
    ('seed068@matchme.test', 'Silver Kuusk', 'Tartu', 'https://randomuser.me/api/portraits/men/34.jpg', 'flexible', 'indoor', 'date', 25, 7, 8, 9, 11),
    ('seed069@matchme.test', 'Rita Raud', 'Tartu', 'https://randomuser.me/api/portraits/women/35.jpg', 'weekends', 'both', 'professional', 25, 8, 9, 10, 11),
    ('seed070@matchme.test', 'Indrek Raud', 'Tartu', 'https://randomuser.me/api/portraits/men/35.jpg', 'weekends', 'both', 'professional', 25, 8, 9, 10, 12),
    ('seed071@matchme.test', 'Ave Kallas', 'Tartu', 'https://randomuser.me/api/portraits/women/36.jpg', 'weeknights', 'outdoor', 'friendship', 25, 9, 10, 11, 12),
    ('seed072@matchme.test', 'Kaspar Kallas', 'Tartu', 'https://randomuser.me/api/portraits/men/36.jpg', 'weeknights', 'outdoor', 'friendship', 25, 9, 10, 11, 13),

    ('seed073@matchme.test', 'Marta Smirnov', 'Narva', 'https://randomuser.me/api/portraits/women/37.jpg', 'weekends', 'outdoor', 'friendship', 25, 1, 2, 3, 4),
    ('seed074@matchme.test', 'Joosep Smirnov', 'Narva', 'https://randomuser.me/api/portraits/men/37.jpg', 'weekends', 'outdoor', 'friendship', 25, 1, 2, 3, 5),
    ('seed075@matchme.test', 'Nina Volkov', 'Narva', 'https://randomuser.me/api/portraits/women/38.jpg', 'flexible', 'both', 'activity_partner', 25, 2, 3, 4, 5),
    ('seed076@matchme.test', 'Oskar Volkov', 'Narva', 'https://randomuser.me/api/portraits/men/38.jpg', 'flexible', 'both', 'activity_partner', 25, 2, 3, 4, 6),
    ('seed077@matchme.test', 'Polina Sokolov', 'Narva', 'https://randomuser.me/api/portraits/women/39.jpg', 'weeknights', 'indoor', 'date', 25, 3, 4, 5, 6),
    ('seed078@matchme.test', 'Rainer Sokolov', 'Narva', 'https://randomuser.me/api/portraits/men/39.jpg', 'weeknights', 'indoor', 'date', 25, 3, 4, 5, 7),
    ('seed079@matchme.test', 'Regina Orlov', 'Narva', 'https://randomuser.me/api/portraits/women/40.jpg', 'flexible', 'outdoor', 'professional', 25, 4, 5, 6, 7),
    ('seed080@matchme.test', 'Madis Orlov', 'Narva', 'https://randomuser.me/api/portraits/men/40.jpg', 'flexible', 'outdoor', 'professional', 25, 4, 5, 6, 8),
    ('seed081@matchme.test', 'Mona Morozov', 'Narva', 'https://randomuser.me/api/portraits/women/41.jpg', 'weekends', 'both', 'friendship', 25, 5, 6, 7, 8),
    ('seed082@matchme.test', 'Janek Morozov', 'Narva', 'https://randomuser.me/api/portraits/men/41.jpg', 'weekends', 'both', 'friendship', 25, 5, 6, 7, 9),
    ('seed083@matchme.test', 'Terje Novikov', 'Narva', 'https://randomuser.me/api/portraits/women/42.jpg', 'weeknights', 'outdoor', 'activity_partner', 25, 6, 7, 8, 9),

    ('seed084@matchme.test', 'Aivar Novikov', 'Pärnu', 'https://randomuser.me/api/portraits/men/42.jpg', 'weekends', 'outdoor', 'friendship', 25, 1, 2, 3, 4),
    ('seed085@matchme.test', 'Kristel Vasiljev', 'Pärnu', 'https://randomuser.me/api/portraits/women/43.jpg', 'weekends', 'outdoor', 'friendship', 25, 1, 2, 3, 5),
    ('seed086@matchme.test', 'Meelis Vasiljev', 'Pärnu', 'https://randomuser.me/api/portraits/men/43.jpg', 'flexible', 'both', 'activity_partner', 25, 2, 3, 4, 5),
    ('seed087@matchme.test', 'Merilin Fedorov', 'Pärnu', 'https://randomuser.me/api/portraits/women/44.jpg', 'flexible', 'both', 'activity_partner', 25, 2, 3, 4, 6),
    ('seed088@matchme.test', 'Urmas Fedorov', 'Pärnu', 'https://randomuser.me/api/portraits/men/44.jpg', 'weeknights', 'indoor', 'date', 25, 3, 4, 5, 6),
    ('seed089@matchme.test', 'Anett Mihhailov', 'Pärnu', 'https://randomuser.me/api/portraits/women/45.jpg', 'weeknights', 'indoor', 'date', 25, 3, 4, 5, 7),
    ('seed090@matchme.test', 'Peeter Mihhailov', 'Pärnu', 'https://randomuser.me/api/portraits/men/45.jpg', 'flexible', 'outdoor', 'professional', 25, 4, 5, 6, 7),
    ('seed091@matchme.test', 'Marta Pavlov', 'Pärnu', 'https://randomuser.me/api/portraits/women/46.jpg', 'flexible', 'outdoor', 'professional', 25, 4, 5, 6, 8),

    ('seed092@matchme.test', 'Mati Pavlov', 'Kohtla-Järve', 'https://randomuser.me/api/portraits/men/46.jpg', 'weekends', 'outdoor', 'friendship', 25, 1, 2, 3, 4),
    ('seed093@matchme.test', 'Nina Aleksejev', 'Kohtla-Järve', 'https://randomuser.me/api/portraits/women/47.jpg', 'weekends', 'outdoor', 'friendship', 25, 1, 2, 3, 5),
    ('seed094@matchme.test', 'Rein Aleksejev', 'Kohtla-Järve', 'https://randomuser.me/api/portraits/men/47.jpg', 'flexible', 'both', 'activity_partner', 25, 2, 3, 4, 5),
    ('seed095@matchme.test', 'Polina Lebedev', 'Kohtla-Järve', 'https://randomuser.me/api/portraits/women/48.jpg', 'flexible', 'both', 'activity_partner', 25, 2, 3, 4, 6),
    ('seed096@matchme.test', 'Viktor Lebedev', 'Kohtla-Järve', 'https://randomuser.me/api/portraits/men/48.jpg', 'weeknights', 'indoor', 'date', 25, 3, 4, 5, 6),
    ('seed097@matchme.test', 'Regina Kozlov', 'Kohtla-Järve', 'https://randomuser.me/api/portraits/women/49.jpg', 'weeknights', 'indoor', 'date', 25, 3, 4, 5, 7),
    ('seed098@matchme.test', 'Eero Kozlov', 'Kohtla-Järve', 'https://randomuser.me/api/portraits/men/49.jpg', 'flexible', 'outdoor', 'professional', 25, 4, 5, 6, 7),

    ('seed099@matchme.test', 'Mona Egorov', 'Viljandi', 'https://randomuser.me/api/portraits/women/50.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed100@matchme.test', 'Tarmo Egorov', 'Viljandi', 'https://randomuser.me/api/portraits/men/50.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed101@matchme.test', 'Terje Stepanov', 'Viljandi', 'https://randomuser.me/api/portraits/women/51.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),
    ('seed102@matchme.test', 'Alo Stepanov', 'Viljandi', 'https://randomuser.me/api/portraits/men/51.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 6),
    ('seed103@matchme.test', 'Kristel Miller', 'Viljandi', 'https://randomuser.me/api/portraits/women/52.jpg', 'weeknights', 'indoor', 'date', 35, 3, 4, 5, 6),

    ('seed104@matchme.test', 'Lauri Miller', 'Rakvere', 'https://randomuser.me/api/portraits/men/52.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed105@matchme.test', 'Merilin Schmidt', 'Rakvere', 'https://randomuser.me/api/portraits/women/53.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed106@matchme.test', 'Hannes Schmidt', 'Rakvere', 'https://randomuser.me/api/portraits/men/53.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),
    ('seed107@matchme.test', 'Anett Virtanen', 'Rakvere', 'https://randomuser.me/api/portraits/women/54.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 6),
    ('seed108@matchme.test', 'Veiko Virtanen', 'Rakvere', 'https://randomuser.me/api/portraits/men/54.jpg', 'weeknights', 'indoor', 'date', 35, 3, 4, 5, 6),

    ('seed109@matchme.test', 'Helena Korhonen', 'Maardu', 'https://randomuser.me/api/portraits/women/55.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed110@matchme.test', 'Alar Korhonen', 'Maardu', 'https://randomuser.me/api/portraits/men/55.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed111@matchme.test', 'Laura Jensen', 'Maardu', 'https://randomuser.me/api/portraits/women/56.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),
    ('seed112@matchme.test', 'Marek Jensen', 'Maardu', 'https://randomuser.me/api/portraits/men/56.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 6),
    ('seed113@matchme.test', 'Sofia Nielsen', 'Maardu', 'https://randomuser.me/api/portraits/women/57.jpg', 'weeknights', 'indoor', 'date', 35, 3, 4, 5, 6),

    ('seed114@matchme.test', 'Ivar Nielsen', 'Kuressaare', 'https://randomuser.me/api/portraits/men/57.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed115@matchme.test', 'Emma Garcia', 'Kuressaare', 'https://randomuser.me/api/portraits/women/58.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed116@matchme.test', 'Jaak Garcia', 'Kuressaare', 'https://randomuser.me/api/portraits/men/58.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),
    ('seed117@matchme.test', 'Eva Martin', 'Kuressaare', 'https://randomuser.me/api/portraits/women/59.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 6),

    ('seed118@matchme.test', 'Vallo Martin', 'Võru', 'https://randomuser.me/api/portraits/men/59.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed119@matchme.test', 'Anna Brown', 'Võru', 'https://randomuser.me/api/portraits/women/60.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed120@matchme.test', 'Sten Brown', 'Võru', 'https://randomuser.me/api/portraits/men/60.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),
    ('seed121@matchme.test', 'Olga Wilson', 'Võru', 'https://randomuser.me/api/portraits/women/61.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 6),

    ('seed122@matchme.test', 'Rene Wilson', 'Valga', 'https://randomuser.me/api/portraits/men/61.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed123@matchme.test', 'Natalia Tamm', 'Valga', 'https://randomuser.me/api/portraits/women/62.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed124@matchme.test', 'Heiki Saar', 'Valga', 'https://randomuser.me/api/portraits/men/62.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),
    ('seed125@matchme.test', 'Irina Sepp', 'Valga', 'https://randomuser.me/api/portraits/women/63.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 6),

    ('seed126@matchme.test', 'Taavi Kask', 'Haapsalu', 'https://randomuser.me/api/portraits/men/63.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed127@matchme.test', 'Jelena Magi', 'Haapsalu', 'https://randomuser.me/api/portraits/women/64.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed128@matchme.test', 'Uku Kukk', 'Haapsalu', 'https://randomuser.me/api/portraits/men/64.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),
    ('seed129@matchme.test', 'Svetlana Rebane', 'Haapsalu', 'https://randomuser.me/api/portraits/women/65.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 6),

    ('seed130@matchme.test', 'Rando Ilves', 'Jõhvi', 'https://randomuser.me/api/portraits/men/65.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed131@matchme.test', 'Daria Poder', 'Jõhvi', 'https://randomuser.me/api/portraits/women/66.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed132@matchme.test', 'Kermo Lepp', 'Jõhvi', 'https://randomuser.me/api/portraits/men/66.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),
    ('seed133@matchme.test', 'Ksenia Koppel', 'Jõhvi', 'https://randomuser.me/api/portraits/women/67.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 6),

    ('seed134@matchme.test', 'Allan Kuusk', 'Paide', 'https://randomuser.me/api/portraits/men/67.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed135@matchme.test', 'Maria Raud', 'Paide', 'https://randomuser.me/api/portraits/women/68.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed136@matchme.test', 'Armin Kallas', 'Paide', 'https://randomuser.me/api/portraits/men/68.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),

    ('seed137@matchme.test', 'Viktoria Luts', 'Keila', 'https://randomuser.me/api/portraits/women/69.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed138@matchme.test', 'Ken Mets', 'Keila', 'https://randomuser.me/api/portraits/men/69.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed139@matchme.test', 'Mia Vaher', 'Keila', 'https://randomuser.me/api/portraits/women/70.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),

    ('seed140@matchme.test', 'Kevin Oja', 'Sillamäe', 'https://randomuser.me/api/portraits/men/70.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed141@matchme.test', 'Marta Kivi', 'Sillamäe', 'https://randomuser.me/api/portraits/women/71.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),
    ('seed142@matchme.test', 'Oliver Paju', 'Sillamäe', 'https://randomuser.me/api/portraits/men/71.jpg', 'flexible', 'both', 'activity_partner', 35, 2, 3, 4, 5),

    ('seed143@matchme.test', 'Kristi Ivanov', 'Rapla', 'https://randomuser.me/api/portraits/women/72.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed144@matchme.test', 'Robin Petrov', 'Rapla', 'https://randomuser.me/api/portraits/men/72.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),

    ('seed145@matchme.test', 'Merle Sidorov', 'Elva', 'https://randomuser.me/api/portraits/women/73.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed146@matchme.test', 'Sebastian Smirnov', 'Elva', 'https://randomuser.me/api/portraits/men/73.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),

    ('seed147@matchme.test', 'Grete Volkov', 'Põlva', 'https://randomuser.me/api/portraits/women/74.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed148@matchme.test', 'Hugo Sokolov', 'Põlva', 'https://randomuser.me/api/portraits/men/74.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5),

    ('seed149@matchme.test', 'Riin Orlov', 'Türi', 'https://randomuser.me/api/portraits/women/75.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 4),
    ('seed150@matchme.test', 'Henri Morozov', 'Türi', 'https://randomuser.me/api/portraits/men/75.jpg', 'weekends', 'outdoor', 'friendship', 35, 1, 2, 3, 5);

-- Create login accounts
INSERT INTO users (email, password_hash)
SELECT
    email,
    '$2y$10$/x64YLBjPz3x48b70.313eMeFKUKFbsMdz9DuJik4m4Tvkmy1TqZq'
FROM seed_data;

-- Create one complete profile for each seed user
INSERT INTO profiles (user_id, name, about_me, city, picture_link, complete)
SELECT
    users.id,
    seed_data.name,
    'I live in ' || seed_data.city || ' and I am looking for people with shared hobbies around Estonia.',
    seed_data.city,
    seed_data.picture_link,
    TRUE
FROM seed_data
JOIN users ON users.email = seed_data.email;

-- Create one complete bio/preferences row for each seed user
INSERT INTO user_bios (
    user_id,
    max_distance_km,
    availability,
    activity_preference,
    looking_for,
    complete
)
SELECT
    users.id,
    seed_data.max_distance_km,
    seed_data.availability,
    seed_data.activity_preference,
    seed_data.looking_for,
    TRUE
FROM seed_data
JOIN users ON users.email = seed_data.email;

-- Give each seed user four hobbies
INSERT INTO user_hobbies (user_id, hobby_id)
SELECT users.id, seed_data.hobby_1
FROM seed_data
JOIN users ON users.email = seed_data.email;

INSERT INTO user_hobbies (user_id, hobby_id)
SELECT users.id, seed_data.hobby_2
FROM seed_data
JOIN users ON users.email = seed_data.email;

INSERT INTO user_hobbies (user_id, hobby_id)
SELECT users.id, seed_data.hobby_3
FROM seed_data
JOIN users ON users.email = seed_data.email;

INSERT INTO user_hobbies (user_id, hobby_id)
SELECT users.id, seed_data.hobby_4
FROM seed_data
JOIN users ON users.email = seed_data.email;

COMMIT;

-- Feature 11 bonus: give seed users GPS coordinates near their city.
ALTER TABLE user_bios ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE user_bios ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE user_bios ADD COLUMN IF NOT EXISTS gps_enabled BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE user_bios
SET
    latitude = city_coordinates.base_lat
        + (((substring(users.email from 'seed([0-9]+)')::integer % 7) - 3) * 0.006),
    longitude = city_coordinates.base_lon
        + (((substring(users.email from 'seed([0-9]+)')::integer % 11) - 5) * 0.010),
    gps_enabled = TRUE
FROM profiles
JOIN users ON users.id = profiles.user_id
JOIN (
    VALUES
        ('Tallinn', 59.4370, 24.7536),
        ('Tartu', 58.3776, 26.7290),
        ('Narva', 59.3797, 28.1791),
        ('Pärnu', 58.3859, 24.4971),
        ('Kohtla-Järve', 59.3986, 27.2731),
        ('Viljandi', 58.3639, 25.5900),
        ('Rakvere', 59.3464, 26.3558),
        ('Maardu', 59.4653, 24.9822),
        ('Kuressaare', 58.2520, 22.4869),
        ('Võru', 57.8428, 27.0194),
        ('Valga', 57.7778, 26.0473),
        ('Haapsalu', 58.9431, 23.5414),
        ('Jõhvi', 59.3592, 27.4211),
        ('Paide', 58.8856, 25.5572),
        ('Keila', 59.3036, 24.4131),
        ('Sillamäe', 59.3969, 27.7631),
        ('Rapla', 59.0072, 24.7928),
        ('Elva', 58.2225, 26.4210),
        ('Põlva', 58.0603, 27.0694),
        ('Türi', 58.8086, 25.4325)
) AS city_coordinates(city, base_lat, base_lon) ON city_coordinates.city = profiles.city
WHERE profiles.user_id = user_bios.user_id
  AND users.email LIKE 'seed%.test';
