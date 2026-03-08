import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM services ORDER BY department, name');
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, icon, department, contact_info, is_active } = await request.json();
    const result = await query(
      'INSERT INTO services (name, description, icon, department, contact_info, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, icon || '🏛️', department, contact_info, is_active ?? true]
    );
    return NextResponse.json({ id: result.insertId, message: 'Created' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
