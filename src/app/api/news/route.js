import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM news ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, slug, content, excerpt, image, is_published } = await request.json();
    const result = await query(
      'INSERT INTO news (title, slug, content, excerpt, image, is_published) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), content, excerpt, image, is_published ?? true]
    );
    return NextResponse.json({ id: result.insertId, message: 'Created' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
