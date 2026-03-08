import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM complaints ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, phone, subject, description } = await request.json();
    if (!name || !subject || !description) {
      return NextResponse.json({ error: 'Name, subject, and description are required' }, { status: 400 });
    }
    const result = await query(
      'INSERT INTO complaints (name, email, phone, subject, description) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, subject, description]
    );
    return NextResponse.json({ id: result.insertId, message: 'Complaint submitted' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
