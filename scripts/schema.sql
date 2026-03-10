-- Village Management Database Schema
CREATE DATABASE IF NOT EXISTS `u325246037_jantralkampa`;
USE `u325246037_jantralkampa`;

-- Admin users
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News articles
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  image VARCHAR(500),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500),
  event_date DATE NOT NULL,
  event_time VARCHAR(50),
  location VARCHAR(255),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT '🏛️',
  department VARCHAR(255),
  contact_info VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Directory entries
CREATE TABLE IF NOT EXISTS directory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaints
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
  admin_reply TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Village data (key-value store)
CREATE TABLE IF NOT EXISTS village_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_key VARCHAR(100) NOT NULL UNIQUE,
  data_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default village data
INSERT IGNORE INTO village_data (data_key, data_value) VALUES
  ('village_name', 'Jantralkampa'),
  ('village_logo', ''),
  ('show_dynamic_logo', 'true'),
  ('village_description', 'A beautiful and progressive village nestled in the heart of nature, dedicated to sustainable development and community well-being.'),
  ('village_history', 'Jantralkampa was established in 1850 and has since grown into a thriving community of over 5,000 residents. Our village is known for its rich cultural heritage, lush green landscapes, and a strong sense of community spirit.'),
  ('population', '5,200'),
  ('area', '12.5 sq km'),
  ('pincode', '411001'),
  ('state', 'Maharashtra'),
  ('district', 'Pune'),
  ('sarpanch_name', 'Shri Rajesh Kumar'),
  ('sarpanch_message', 'Welcome to our village website. We are committed to bringing transparency and digital connectivity to every household.'),
  ('village_phone', '+91 20 1234 5678'),
  ('village_email', 'contact@greenvalleyvillage.gov.in'),
  ('village_address', 'Jantralkampa, Pune District, Maharashtra, India - 411001'),
  ('map_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242117.68078944388!2d73.72287834013858!3d18.524598010498498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890');

-- People (Family Tree)
CREATE TABLE IF NOT EXISTS people (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo VARCHAR(500),
  gender ENUM('male','female','other') NOT NULL DEFAULT 'male',
  birth_date DATE,
  death_date DATE,
  family_name VARCHAR(255),
  phone VARCHAR(20),
  occupation VARCHAR(255),
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relationships (bidirectional)
CREATE TABLE IF NOT EXISTS relationships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  person_id INT NOT NULL,
  related_person_id INT NOT NULL,
  relationship_type ENUM('father','mother','spouse','child') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
  FOREIGN KEY (related_person_id) REFERENCES people(id) ON DELETE CASCADE,
  UNIQUE KEY unique_relationship (person_id, related_person_id, relationship_type)
);
