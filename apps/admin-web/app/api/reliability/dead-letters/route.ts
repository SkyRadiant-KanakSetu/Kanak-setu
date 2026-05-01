import { NextResponse } from 'next/server';
import { fetchInternal } from '@/lib/internalApi';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitRaw = Number(url.searchParams.get('limit') || 20);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 20;
    const data = await fetchInternal(`/internal/dead-letters?limit=${limit}`);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to load dead letters',
        },
      },
      { status: 500 }
    );
  }
}
