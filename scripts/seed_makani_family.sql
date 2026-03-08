-- Seed Makani Family Tree Data
USE `village-management`;

-- =============================================
-- Generation 1: Mohanbhai & Narmadaben Makani
-- =============================================
INSERT INTO people (name, gender, birth_date, death_date, family_name, occupation, bio) VALUES
('Mohanbhai Makani', 'male', NULL, '2000-01-01', 'Makani', NULL, 'Patriarch of the Makani family.'),
('Narmadaben Makani', 'female', NULL, '2000-01-01', 'Makani', NULL, 'Matriarch of the Makani family.');

-- =============================================
-- Generation 2: Sons & their wives
-- =============================================
INSERT INTO people (name, gender, birth_date, family_name, occupation, bio) VALUES
('Maheshbhai Makani', 'male', NULL, 'Makani', NULL, NULL),
('Saradaben Makani', 'female', NULL, 'Makani', NULL, NULL),
('Rameshbhai Makani', 'male', NULL, 'Makani', NULL, NULL),
('Harshaben Makani', 'female', NULL, 'Makani', NULL, NULL);

-- =============================================
-- Generation 3: Children
-- =============================================
INSERT INTO people (name, gender, birth_date, family_name, occupation, bio) VALUES
('Devang Makani', 'male', NULL, 'Makani', NULL, NULL),
('Anujaben Makani', 'female', NULL, 'Makani', NULL, NULL),
('Bhakti Makani', 'female', NULL, 'Makani', NULL, NULL),
('Het Makani', 'male', NULL, 'Makani', NULL, NULL),
('Avadh Makani', 'male', NULL, 'Makani', NULL, NULL);

-- =============================================
-- Set up variables for relationship linking
-- =============================================
SET @mohanbhai_id = (SELECT id FROM people WHERE name = 'Mohanbhai Makani' LIMIT 1);
SET @narmadaben_id = (SELECT id FROM people WHERE name = 'Narmadaben Makani' LIMIT 1);
SET @maheshbhai_id = (SELECT id FROM people WHERE name = 'Maheshbhai Makani' LIMIT 1);
SET @saradaben_id = (SELECT id FROM people WHERE name = 'Saradaben Makani' LIMIT 1);
SET @rameshbhai_id = (SELECT id FROM people WHERE name = 'Rameshbhai Makani' LIMIT 1);
SET @harshaben_id = (SELECT id FROM people WHERE name = 'Harshaben Makani' LIMIT 1);
SET @devang_id = (SELECT id FROM people WHERE name = 'Devang Makani' LIMIT 1);
SET @anujaben_id = (SELECT id FROM people WHERE name = 'Anujaben Makani' LIMIT 1);
SET @bhakti_id = (SELECT id FROM people WHERE name = 'Bhakti Makani' LIMIT 1);
SET @het_id = (SELECT id FROM people WHERE name = 'Het Makani' LIMIT 1);
SET @avadh_id = (SELECT id FROM people WHERE name = 'Avadh Makani' LIMIT 1);

-- =============================================
-- Relationships
-- =============================================
INSERT INTO relationships (person_id, related_person_id, relationship_type) VALUES
-- Spouse: Mohanbhai & Narmadaben
(@mohanbhai_id, @narmadaben_id, 'spouse'),
(@narmadaben_id, @mohanbhai_id, 'spouse'),

-- Children of Mohanbhai & Narmadaben: Maheshbhai, Rameshbhai
(@mohanbhai_id, @maheshbhai_id, 'child'),
(@narmadaben_id, @maheshbhai_id, 'child'),
(@mohanbhai_id, @rameshbhai_id, 'child'),
(@narmadaben_id, @rameshbhai_id, 'child'),

-- Spouse: Maheshbhai & Saradaben
(@maheshbhai_id, @saradaben_id, 'spouse'),
(@saradaben_id, @maheshbhai_id, 'spouse'),

-- Children of Maheshbhai & Saradaben: Devang, Anujaben, Bhakti
(@maheshbhai_id, @devang_id, 'child'),
(@saradaben_id, @devang_id, 'child'),
(@maheshbhai_id, @anujaben_id, 'child'),
(@saradaben_id, @anujaben_id, 'child'),
(@maheshbhai_id, @bhakti_id, 'child'),
(@saradaben_id, @bhakti_id, 'child'),

-- Spouse: Rameshbhai & Harshaben
(@rameshbhai_id, @harshaben_id, 'spouse'),
(@harshaben_id, @rameshbhai_id, 'spouse'),

-- Children of Rameshbhai & Harshaben: Het, Avadh
(@rameshbhai_id, @het_id, 'child'),
(@harshaben_id, @het_id, 'child'),
(@rameshbhai_id, @avadh_id, 'child'),
(@harshaben_id, @avadh_id, 'child');
