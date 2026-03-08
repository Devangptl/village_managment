-- Seed dummy data for Family Tree
USE `village-management`;

-- First, let's clear existing data to have a clean start (Optional, but better for demonstration)
-- DELETE FROM relationships;
-- DELETE FROM people;

-- INSERT Sharma Family (3 generations)
INSERT INTO people (name, gender, birth_date, family_name, occupation, bio) VALUES
('Ram Sharma', 'male', '1945-05-10', 'Sharma', 'Retired Teacher', 'Elder of the Sharma family, loves gardening.'),
('Sita Sharma', 'female', '1950-08-15', 'Sharma', 'Homemaker', 'Known for her traditional recipes.'),
('Rajesh Sharma', 'male', '1975-03-20', 'Sharma', 'Software Engineer', 'Working in the city, frequently visits the village.'),
('Meena Sharma', 'female', '1978-11-05', 'Sharma', 'Doctor', 'Village health consultant.'),
('Sunita Sharma', 'female', '1980-06-12', 'Sharma', 'Artist', 'Passionate about folk art.'),
('Ankit Sharma', 'male', '2005-01-25', 'Sharma', 'Student', 'Studying Architecture.'),
('Priya Sharma', 'female', '2008-09-30', 'Sharma', 'Student', 'High school student, loves music.');

-- Relationships for Sharma Family
-- Get IDs (we'll assume they're inserted in order if the table was empty, 
-- but it's safer to use subqueries or variables if we don't clear the table)
SET @ram_id = (SELECT id FROM people WHERE name = 'Ram Sharma' LIMIT 1);
SET @sita_id = (SELECT id FROM people WHERE name = 'Sita Sharma' LIMIT 1);
SET @rajesh_id = (SELECT id FROM people WHERE name = 'Rajesh Sharma' LIMIT 1);
SET @meena_id = (SELECT id FROM people WHERE name = 'Meena Sharma' LIMIT 1);
SET @sunita_id = (SELECT id FROM people WHERE name = 'Sunita Sharma' LIMIT 1);
SET @ankit_id = (SELECT id FROM people WHERE name = 'Ankit Sharma' LIMIT 1);
SET @priya_id = (SELECT id FROM people WHERE name = 'Priya Sharma' LIMIT 1);

INSERT INTO relationships (person_id, related_person_id, relationship_type) VALUES
-- Spouse: Ram & Sita
(@ram_id, @sita_id, 'spouse'),
(@sita_id, @ram_id, 'spouse'),
-- Children of Ram & Sita: Rajesh & Sunita
(@ram_id, @rajesh_id, 'child'),
(@sita_id, @rajesh_id, 'child'),
(@ram_id, @sunita_id, 'child'),
(@sita_id, @sunita_id, 'child'),
-- Spouse: Rajesh & Meena
(@rajesh_id, @meena_id, 'spouse'),
(@meena_id, @rajesh_id, 'spouse'),
-- Children of Rajesh & Meena: Ankit & Priya
(@rajesh_id, @ankit_id, 'child'),
(@meena_id, @ankit_id, 'child'),
(@rajesh_id, @priya_id, 'child'),
(@meena_id, @priya_id, 'child');

-- INSERT Patel Family (2 generations)
INSERT INTO people (name, gender, birth_date, family_name, occupation, bio) VALUES
('Vikram Patel', 'male', '1965-12-10', 'Patel', 'Farmer', 'Modern farming enthusiast.'),
('Kavita Patel', 'female', '1970-02-14', 'Patel', 'Social Worker', 'Active in village development groups.'),
('Amit Patel', 'male', '1995-10-22', 'Patel', 'Bank Manager', 'Helping village people with financial literacy.');

-- Relationships for Patel Family
SET @vikram_id = (SELECT id FROM people WHERE name = 'Vikram Patel' LIMIT 1);
SET @kavita_id = (SELECT id FROM people WHERE name = 'Kavita Patel' LIMIT 1);
SET @amit_id = (SELECT id FROM people WHERE name = 'Amit Patel' LIMIT 1);

INSERT INTO relationships (person_id, related_person_id, relationship_type) VALUES
-- Spouse: Vikram & Kavita
(@vikram_id, @kavita_id, 'spouse'),
(@kavita_id, @vikram_id, 'spouse'),
-- Child of Vikram & Kavita: Amit
(@vikram_id, @amit_id, 'child'),
(@kavita_id, @amit_id, 'child');

-- INSERT Gupta Family
INSERT INTO people (name, gender, birth_date, family_name, occupation, bio) VALUES
('Sanjay Gupta', 'male', '1985-07-07', 'Gupta', 'Scientist', 'Researching sustainable energy.');
