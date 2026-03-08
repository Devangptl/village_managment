import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM village_data');
    const data = {};
    rows.forEach((r) => { data[r.data_key] = r.data_value; });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updates = await request.json();
    for (const [key, value] of Object.entries(updates)) {
      await query(
        'INSERT INTO village_data (data_key, data_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE data_value = ?',
        [key, value, value]
      );
    }
    return NextResponse.json({ message: 'Updated' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
