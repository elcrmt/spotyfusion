import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const sessionCookie = request.cookies.get('sf_session')?.value;

    if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    try {
        const session = JSON.parse(sessionCookie);
        return NextResponse.json({ accessToken: session.accessToken });
    } catch {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
}
