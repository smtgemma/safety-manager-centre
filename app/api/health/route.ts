import { getGoogleSheetsConfig } from '@/lib/google-sheets/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Without credentials the sheets service logs a warning and returns [], which
  // renders as a silently empty hub. Surface it here so a misconfigured
  // deployment is obvious from the container healthcheck and the VPS logs.
  const config = getGoogleSheetsConfig();
  const credentials = config ? 'configured' : 'missing';

  return NextResponse.json(
    { status: 'ok', credentials },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
