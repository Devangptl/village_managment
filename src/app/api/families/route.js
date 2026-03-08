import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const families = await query(
      'SELECT DISTINCT family_name FROM people WHERE is_active = 1 AND family_name IS NOT NULL AND family_name != "" ORDER BY family_name'
    );
    
    return NextResponse.json({
      success: true,
      data: families.map(f => f.family_name)
    });
  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch families' },
      { status: 500 }
    );
  }
}
