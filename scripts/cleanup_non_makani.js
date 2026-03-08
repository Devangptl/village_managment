const mysql = require('mysql2/promise');

async function cleanupNonMakani() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin@123',
    database: process.env.DB_NAME || 'village-management',
  });

  console.log('Connected to MySQL.');

  // 1. Show current counts
  const [allPeople] = await connection.query('SELECT COUNT(*) as count FROM people');
  const [makaniPeople] = await connection.query(
    "SELECT COUNT(*) as count FROM people WHERE family_name = 'Makani'"
  );
  const [nonMakaniPeople] = await connection.query(
    "SELECT COUNT(*) as count FROM people WHERE family_name != 'Makani' OR family_name IS NULL"
  );

  console.log(`\nCurrent state:`);
  console.log(`  Total people: ${allPeople[0].count}`);
  console.log(`  Makani family: ${makaniPeople[0].count}`);
  console.log(`  Non-Makani (to be deleted): ${nonMakaniPeople[0].count}`);

  // 2. List non-Makani people that will be removed
  const [toDelete] = await connection.query(
    "SELECT id, name, family_name FROM people WHERE family_name != 'Makani' OR family_name IS NULL"
  );

  if (toDelete.length === 0) {
    console.log('\n✅ No non-Makani family data found. Nothing to delete.');
    await connection.end();
    return;
  }

  console.log('\nPeople to be removed:');
  toDelete.forEach(p => {
    console.log(`  - [${p.id}] ${p.name} (family: ${p.family_name || 'NULL'})`);
  });

  // 3. Delete relationships involving non-Makani people first
  //    (CASCADE should handle this, but being explicit for safety)
  const nonMakaniIds = toDelete.map(p => p.id);
  const placeholders = nonMakaniIds.map(() => '?').join(',');

  const [relResult] = await connection.query(
    `DELETE FROM relationships WHERE person_id IN (${placeholders}) OR related_person_id IN (${placeholders})`,
    [...nonMakaniIds, ...nonMakaniIds]
  );
  console.log(`\n🗑️  Deleted ${relResult.affectedRows} relationships involving non-Makani people.`);

  // 4. Delete non-Makani people
  const [peopleResult] = await connection.query(
    "DELETE FROM people WHERE family_name != 'Makani' OR family_name IS NULL"
  );
  console.log(`🗑️  Deleted ${peopleResult.affectedRows} non-Makani people.`);

  // 5. Verify remaining data
  const [remaining] = await connection.query('SELECT id, name, family_name FROM people ORDER BY id');
  const [remainingRels] = await connection.query(
    `SELECT r.id, p1.name AS person, p2.name AS related_person, r.relationship_type
     FROM relationships r
     JOIN people p1 ON r.person_id = p1.id
     JOIN people p2 ON r.related_person_id = p2.id
     ORDER BY r.id`
  );

  console.log(`\n✅ Cleanup complete! Remaining data:`);
  console.log(`\nMakani family members (${remaining.length}):`);
  remaining.forEach(p => {
    console.log(`  - [${p.id}] ${p.name}`);
  });

  console.log(`\nRelationships (${remainingRels.length}):`);
  remainingRels.forEach(r => {
    console.log(`  - ${r.person} → ${r.related_person} (${r.relationship_type})`);
  });

  await connection.end();
}

cleanupNonMakani().catch(err => {
  console.error('❌ Error during cleanup:', err);
  process.exit(1);
});
