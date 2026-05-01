import { NextResponse } from 'next/server';
import { fetchInternal } from '@/lib/internalApi';

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await fetchInternal(`/internal/dead-letters/${id}/retry`, {
      method: 'POST',
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to retry dead letter',
        },
      },
      { status: 500 }
    );
  }
}
