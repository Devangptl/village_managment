import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [announcements, news, events, villageData] = await Promise.all([
      query('SELECT * FROM announcements WHERE is_active = 1 ORDER BY priority DESC, created_at DESC LIMIT 5'),
      query('SELECT * FROM news ORDER BY created_at DESC LIMIT 3'), // Or whatever logic was in home
      query('SELECT * FROM events WHERE is_published = 1 ORDER BY event_date ASC LIMIT 3'),
      query('SELECT * FROM village_data'),
    ]);
    
    const vd = {};
    if (villageData) {
      villageData.forEach((row) => { vd[row.data_key] = row.data_value; });
    }

    return NextResponse.json({ announcements, news, events, villageData: vd });
  } catch (error) {
    console.error('Error fetching home data API:', error);
    return NextResponse.json({ announcements: [], news: [], events: [], villageData: {} }, { status: 500 });
  }
}
