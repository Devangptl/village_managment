const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin@123',
    multipleStatements: true,
  });

  console.log('Connected to MySQL. Creating database and tables...');

  // Read and execute schema
  const fs = require('fs');
  const path = require('path');
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await connection.query(schema);
  console.log('Schema created successfully.');

  // Use the database
  await connection.query('USE `village-management`');

  // Seed admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  await connection.query(
    `INSERT IGNORE INTO admins (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)`,
    ['admin', 'admin@village.gov.in', passwordHash, 'Village Admin']
  );
  console.log('Admin user created (username: admin, password: admin123)');

  // Seed sample news
  const newsData = [
    ['New Road Construction Approved', 'new-road-construction-approved', 'The village panchayat has approved the construction of a new road connecting the east and west sectors of the village. Work will begin next month.', 'Road construction project approved for east-west connectivity.', null, true],
    ['Annual Health Camp This Weekend', 'annual-health-camp-this-weekend', 'Free health checkups and vaccinations will be available at the village community center this Saturday from 9 AM to 5 PM.', 'Free health camp at community center this Saturday.', null, true],
    ['Village Wins State Clean Village Award', 'village-wins-clean-award', 'Our village has been recognized with the State Clean Village Award for maintaining exceptional cleanliness and waste management practices.', 'Green Valley wins prestigious state-level cleanliness award.', null, true],
  ];
  for (const n of newsData) {
    await connection.query(
      `INSERT IGNORE INTO news (title, slug, content, excerpt, image, is_published) VALUES (?, ?, ?, ?, ?, ?)`,
      n
    );
  }
  console.log('Sample news created.');

  // Seed sample events
  const eventsData = [
    ['Village Republic Day Celebration', 'Grand celebration with flag hoisting, cultural programs, and sports competitions for all age groups.', null, '2026-01-26', '08:00 AM', 'Village Ground', true],
    ['Summer Festival 2026', 'Annual summer festival featuring traditional music, dance performances, food stalls, and games.', null, '2026-04-15', '05:00 PM', 'Community Center', true],
    ['Tree Plantation Drive', 'Join us in planting 1000 trees across the village to make our community greener and healthier.', null, '2026-06-05', '07:00 AM', 'Various Locations', true],
  ];
  for (const e of eventsData) {
    await connection.query(
      `INSERT IGNORE INTO events (title, description, image, event_date, event_time, location, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      e
    );
  }
  console.log('Sample events created.');

  // Seed sample services
  const servicesData = [
    ['Birth Certificate', 'Apply for birth certificate registration online or visit the village office.', '📄', 'Revenue Department', '+91 20 1234 5678', true],
    ['Death Certificate', 'Apply for death certificate. Required documents: ID proof, hospital records.', '📋', 'Revenue Department', '+91 20 1234 5678', true],
    ['Water Supply', 'New water connection application and complaint registration for water supply issues.', '💧', 'Water Department', '+91 20 2345 6789', true],
    ['Property Tax', 'Pay property tax online or check tax dues for your property.', '🏠', 'Tax Department', '+91 20 3456 7890', true],
    ['Land Records', 'Access 7/12 extracts, mutation records, and property ownership details.', '📜', 'Land Revenue', '+91 20 4567 8901', true],
    ['Street Lights', 'Report faulty street lights and request new installations.', '💡', 'Electrical Department', '+91 20 5678 9012', true],
  ];
  for (const s of servicesData) {
    await connection.query(
      `INSERT IGNORE INTO services (name, description, icon, department, contact_info, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
      s
    );
  }
  console.log('Sample services created.');

  // Seed sample directory
  const directoryData = [
    ['Village Health Center', 'Healthcare', '+91 20 1111 2222', 'health@village.gov.in', 'Main Road, Green Valley', 'Primary health center with basic medical facilities.', true],
    ['Green Valley School', 'Education', '+91 20 3333 4444', 'school@greenvalley.edu', 'School Lane, Sector 2', 'Government school providing education from Class 1 to 10.', true],
    ['Farmers Cooperative', 'Agriculture', '+91 20 5555 6666', 'coop@farmers.org', 'Market Area', 'Agricultural cooperative providing seeds, fertilizers, and market access.', true],
    ['Post Office', 'Government', '+91 20 7777 8888', null, 'Post Office Road', 'India Post branch office serving Green Valley village.', true],
  ];
  for (const d of directoryData) {
    await connection.query(
      `INSERT IGNORE INTO directory (name, category, phone, email, address, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      d
    );
  }
  console.log('Sample directory created.');

  // Seed announcements
  const announcementsData = [
    ['Water Supply Maintenance', 'Water supply will be interrupted on March 10th from 10 AM to 4 PM due to pipeline maintenance.', true, 2],
    ['Gram Sabha Meeting', 'The next Gram Sabha meeting is scheduled for March 15th at 11 AM at the Panchayat Bhavan.', true, 1],
    ['COVID Vaccination Camp', 'Free COVID booster vaccination camp at the Health Center every Wednesday.', true, 0],
  ];
  for (const a of announcementsData) {
    await connection.query(
      `INSERT IGNORE INTO announcements (title, content, is_active, priority) VALUES (?, ?, ?, ?)`,
      a
    );
  }
  console.log('Sample announcements created.');

  console.log('\n✅ Database seeded successfully!');
  console.log('Admin login: username=admin, password=admin123');
  await connection.end();
}

seed().catch(console.error);
