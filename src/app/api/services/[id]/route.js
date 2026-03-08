import { query, queryOne } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, description, icon, department, contact_info, is_active } = await request.json();
    await query(
      'UPDATE services SET name=?, description=?, icon=?, department=?, contact_info=?, is_active=? WHERE id=?',
      [name, description, icon, department, contact_info, is_active, id]
    );
    return NextResponse.json({ message: 'Updated' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM services WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
