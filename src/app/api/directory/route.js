import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM directory WHERE is_active = 1 ORDER BY category, name');
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, category, phone, email, address, description, is_active } = await request.json();
    const result = await query(
      'INSERT INTO directory (name, category, phone, email, address, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category || 'General', phone, email, address, description, is_active ?? true]
    );
    return NextResponse.json({ id: result.insertId, message: 'Created' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
