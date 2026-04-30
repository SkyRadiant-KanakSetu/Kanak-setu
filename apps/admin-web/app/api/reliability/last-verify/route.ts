import { NextResponse } from 'next/server';
import { fetchInternal } from '@/lib/internalApi';

export async function GET() {
  try {
    const data = await fetchInternal('/internal/last-verify');
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error instanceof Error ? error.message : 'Failed to load verify snapshot' } },
      { status: 500 }
    );
  }
}

