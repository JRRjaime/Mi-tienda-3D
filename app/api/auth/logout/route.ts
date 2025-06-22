// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// Lista tipada de los tokens que quieres borrar
const TOKENS = ['sb-access-token', 'sb-refresh-token'] as const;

export async function POST(req: NextRequest) {
  // 1. Rechaza métodos distintos de POST
  if (req.method !== 'POST') {
    return NextResponse.json(
      { message: 'Method Not Allowed' },
      { status: 405, headers: { Allow: 'POST' } },
    );
  }

  try {
    // 2. Obtiene la cookie-store (Next 15 ⇒ async)
    const store = await cookies();

    // 3. Borra cada token
    TOKENS.forEach((token) => store.delete(token));

    // 4. Respuesta OK
    return NextResponse.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('[LOGOUT]', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}