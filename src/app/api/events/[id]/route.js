import { query, queryOne } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const row = await queryOne('SELECT * FROM events WHERE id = ?', [id]);
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, description, image, event_date, event_time, location, is_published } = await request.json();
    await query(
      'UPDATE events SET title=?, description=?, image=?, event_date=?, event_time=?, location=?, is_published=? WHERE id=?',
      [title, description, image, event_date, event_time, location, is_published, id]
    );
    return NextResponse.json({ message: 'Updated' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM events WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
