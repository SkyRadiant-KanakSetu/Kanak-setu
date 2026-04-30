import { NextResponse } from 'next/server';
import { fetchInternal } from '@/lib/internalApi';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const daysRaw = Number(url.searchParams.get('days') || 14);
    const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.min(daysRaw, 30) : 14;
    const data = await fetchInternal(`/internal/operator-activity?days=${days}`);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to load operator activity',
        },
      },
      { status: 500 }
    );
  }
}

