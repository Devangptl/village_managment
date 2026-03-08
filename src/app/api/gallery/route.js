import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM gallery ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, image_url, category } = await request.json();
    const result = await query(
      'INSERT INTO gallery (title, image_url, category) VALUES (?, ?, ?)',
      [title, image_url, category || 'General']
    );
    return NextResponse.json({ id: result.insertId, message: 'Created' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
