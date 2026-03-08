const mysql = require('mysql2/promise');

async function seedMakaniFamily() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin@123',
    database: process.env.DB_NAME || 'village-management',
    multipleStatements: true,
  });

  console.log('Connected to MySQL. Seeding Makani family data...');

  // =============================================
  // Generation 1: Mohanbhai & Narmadaben (deceased)
  // =============================================
  await connection.query(
    `INSERT INTO people (name, gender, death_date, family_name, bio) VALUES
     ('Mohanbhai Makani', 'male', '2000-01-01', 'Makani', 'Patriarch of the Makani family.'),
     ('Narmadaben Makani', 'female', '2000-01-01', 'Makani', 'Matriarch of the Makani family.')`
  );
  console.log('✅ Generation 1 added: Mohanbhai & Narmadaben Makani (deceased)');

  // =============================================
  // Generation 2: Sons & their wives
  // =============================================
  await connection.query(
    `INSERT INTO people (name, gender, family_name) VALUES
     ('Maheshbhai Makani', 'male', 'Makani'),
     ('Saradaben Makani', 'female', 'Makani'),
     ('Rameshbhai Makani', 'male', 'Makani'),
     ('Harshaben Makani', 'female', 'Makani')`
  );
  console.log('✅ Generation 2 added: Maheshbhai, Saradaben, Rameshbhai, Harshaben');

  // =============================================
  // Generation 3: Children
  // =============================================
  await connection.query(
    `INSERT INTO people (name, gender, family_name) VALUES
     ('Devang Makani', 'male', 'Makani'),
     ('Anujaben Makani', 'female', 'Makani'),
     ('Bhakti Makani', 'female', 'Makani'),
     ('Het Makani', 'male', 'Makani'),
     ('Avadh Makani', 'male', 'Makani')`
  );
  console.log('✅ Generation 3 added: Devang, Anujaben, Bhakti, Het, Avadh');

  // =============================================
  // Get IDs for relationship linking
  // =============================================
  const [people] = await connection.query(
    `SELECT id, name FROM people WHERE family_name = 'Makani'`
  );

  const ids = {};
  people.forEach(p => { ids[p.name] = p.id; });

  const mohanbhai = ids['Mohanbhai Makani'];
  const narmadaben = ids['Narmadaben Makani'];
  const maheshbhai = ids['Maheshbhai Makani'];
  const saradaben = ids['Saradaben Makani'];
  const rameshbhai = ids['Rameshbhai Makani'];
  const harshaben = ids['Harshaben Makani'];
  const devang = ids['Devang Makani'];
  const anujaben = ids['Anujaben Makani'];
  const bhakti = ids['Bhakti Makani'];
  const het = ids['Het Makani'];
  const avadh = ids['Avadh Makani'];

  // =============================================
  // Insert Relationships
  // =============================================
  const relationships = [
    // Spouse: Mohanbhai & Narmadaben
    [mohanbhai, narmadaben, 'spouse'],
    [narmadaben, mohanbhai, 'spouse'],

    // Children of Mohanbhai & Narmadaben: Maheshbhai, Rameshbhai
    [mohanbhai, maheshbhai, 'child'],
    [narmadaben, maheshbhai, 'child'],
    [mohanbhai, rameshbhai, 'child'],
    [narmadaben, rameshbhai, 'child'],

    // Spouse: Maheshbhai & Saradaben
    [maheshbhai, saradaben, 'spouse'],
    [saradaben, maheshbhai, 'spouse'],

    // Children of Maheshbhai & Saradaben: Devang, Anujaben, Bhakti
    [maheshbhai, devang, 'child'],
    [saradaben, devang, 'child'],
    [maheshbhai, anujaben, 'child'],
    [saradaben, anujaben, 'child'],
    [maheshbhai, bhakti, 'child'],
    [saradaben, bhakti, 'child'],

    // Spouse: Rameshbhai & Harshaben
    [rameshbhai, harshaben, 'spouse'],
    [harshaben, rameshbhai, 'spouse'],

    // Children of Rameshbhai & Harshaben: Het, Avadh
    [rameshbhai, het, 'child'],
    [harshaben, het, 'child'],
    [rameshbhai, avadh, 'child'],
    [harshaben, avadh, 'child'],
  ];

  for (const [personId, relatedId, type] of relationships) {
    await connection.query(
      `INSERT INTO relationships (person_id, related_person_id, relationship_type) VALUES (?, ?, ?)`,
      [personId, relatedId, type]
    );
  }
  console.log('✅ All relationships created (22 records)');

  console.log('\n🎉 Makani family tree seeded successfully!');
  console.log('Family structure:');
  console.log('  Mohanbhai Makani (†) + Narmadaben Makani (†)');
  console.log('  ├── Maheshbhai Makani + Saradaben Makani');
  console.log('  │   ├── Devang Makani');
  console.log('  │   ├── Anujaben Makani');
  console.log('  │   └── Bhakti Makani');
  console.log('  └── Rameshbhai Makani + Harshaben Makani');
  console.log('      ├── Het Makani');
  console.log('      └── Avadh Makani');

  await connection.end();
}

seedMakaniFamily().catch(err => {
  console.error('❌ Error seeding Makani family:', err);
  process.exit(1);
});
