import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const family = searchParams.get('family') || '';

    let sql = 'SELECT * FROM people WHERE is_active = 1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR family_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (family) {
      sql += ' AND family_name = ?';
      params.push(family);
    }

    sql += ' ORDER BY family_name, name';
    const rows = await query(sql, params);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, photo, gender, birth_date, death_date, family_name, phone, occupation, bio } = await request.json();
    const result = await query(
      'INSERT INTO people (name, photo, gender, birth_date, death_date, family_name, phone, occupation, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, photo || null, gender || 'male', birth_date || null, death_date || null, family_name || null, phone || null, occupation || null, bio || null]
    );
    return NextResponse.json({ id: result.insertId, message: 'Created' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
