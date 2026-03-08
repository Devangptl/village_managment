import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM announcements ORDER BY priority DESC, created_at DESC');
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, content, is_active, priority } = await request.json();
    const result = await query(
      'INSERT INTO announcements (title, content, is_active, priority) VALUES (?, ?, ?, ?)',
      [title, content, is_active ?? true, priority || 0]
    );
    return NextResponse.json({ id: result.insertId, message: 'Created' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
