import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, content, is_active, priority } = await request.json();
    await query(
      'UPDATE announcements SET title=?, content=?, is_active=?, priority=? WHERE id=?',
      [title, content, is_active, priority, id]
    );
    return NextResponse.json({ message: 'Updated' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM announcements WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
