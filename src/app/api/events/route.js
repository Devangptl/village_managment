import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM events ORDER BY event_date DESC');
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, description, image, event_date, event_time, location, is_published } = await request.json();
    const result = await query( 
      'INSERT INTO events (title, description, image, event_date, event_time, location, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, image, event_date, event_time, location, is_published ?? true]
    );
    return NextResponse.json({ id: result.insertId, message: 'Created' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
