import { NextResponse } from 'next/server';
import { fetchInternal } from '@/lib/internalApi';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const take = Number(url.searchParams.get('take') || 10);
    const safeTake = Number.isFinite(take) && take > 0 ? Math.min(take, 50) : 10;
    const data = await fetchInternal(`/internal/deploy-telemetry?limit=${safeTake}`);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error instanceof Error ? error.message : 'Failed to load deploy telemetry' } },
      { status: 500 }
    );
  }
}

