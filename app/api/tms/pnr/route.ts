import { NextResponse } from 'next/server';
import { fetchPNRStatus } from '@/lib/tms-utils';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pnr = searchParams.get('pnr');

    if (!pnr) {
        return NextResponse.json({ error: 'PNR is required' }, { status: 400 });
    }

    try {
        const data = await fetchPNRStatus(pnr);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
