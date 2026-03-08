import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM contact_messages WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await query('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Marked as read' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
