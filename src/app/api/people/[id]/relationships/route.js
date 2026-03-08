import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// Inverse relationship map for bidirectional storage
const inverseMap = {
  father: 'child',
  mother: 'child',
  child: null, // determined by related person's gender
  spouse: 'spouse',
};

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { related_person_id, relationship_type } = await request.json();

    if (String(id) === String(related_person_id)) {
      return NextResponse.json({ error: 'Cannot create a relationship with oneself' }, { status: 400 });
    }

    // Insert forward relationship
    await query(
      'INSERT IGNORE INTO relationships (person_id, related_person_id, relationship_type) VALUES (?, ?, ?)',
      [id, related_person_id, relationship_type]
    );

    // Determine and insert inverse relationship
    let inverseType = inverseMap[relationship_type];
    if (relationship_type === 'child') {
      // If I say "person A's child is B", then B's relation to A is father/mother based on A's gender
      const parent = await query('SELECT gender FROM people WHERE id = ?', [id]);
      inverseType = parent[0]?.gender === 'female' ? 'mother' : 'father';
    }

    if (inverseType) {
      await query(
        'INSERT IGNORE INTO relationships (person_id, related_person_id, relationship_type) VALUES (?, ?, ?)',
        [related_person_id, id, inverseType]
      );
    }

    return NextResponse.json({ message: 'Relationship added' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const relationshipId = searchParams.get('relationshipId');

    if (!relationshipId) {
      return NextResponse.json({ error: 'relationshipId required' }, { status: 400 });
    }

    // Get the relationship to find the inverse
    const rel = await query('SELECT * FROM relationships WHERE id = ?', [relationshipId]);
    if (rel.length > 0) {
      const { person_id, related_person_id, relationship_type } = rel[0];

      // Delete the forward relationship
      await query('DELETE FROM relationships WHERE id = ?', [relationshipId]);

      // Determine inverse type and delete it too
      let inverseType = inverseMap[relationship_type];
      if (relationship_type === 'child') {
        const parent = await query('SELECT gender FROM people WHERE id = ?', [person_id]);
        inverseType = parent[0]?.gender === 'female' ? 'mother' : 'father';
      }

      if (inverseType) {
        await query(
          'DELETE FROM relationships WHERE person_id = ? AND related_person_id = ? AND relationship_type = ?',
          [related_person_id, person_id, inverseType]
        );
      }
    }

    return NextResponse.json({ message: 'Relationship removed' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
