import { query, queryOne } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const person = await queryOne('SELECT * FROM people WHERE id = ?', [id]);
    if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const relationships = await query(
      `SELECT r.id as relationship_id, r.relationship_type, p.id, p.name, p.photo, p.gender, p.family_name
       FROM relationships r
       JOIN people p ON p.id = r.related_person_id
       WHERE r.person_id = ?`,
      [id]
    );

    return NextResponse.json({ ...person, relationships });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, photo, gender, birth_date, death_date, family_name, phone, occupation, bio } = await request.json();
    await query(
      'UPDATE people SET name=?, photo=?, gender=?, birth_date=?, death_date=?, family_name=?, phone=?, occupation=?, bio=? WHERE id=?',
      [name, photo || null, gender, birth_date || null, death_date || null, family_name || null, phone || null, occupation || null, bio || null, id]
    );
    return NextResponse.json({ message: 'Updated' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM relationships WHERE person_id = ? OR related_person_id = ?', [id, id]);
    await query('DELETE FROM people WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
