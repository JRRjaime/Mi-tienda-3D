import { supabase } from '../../../../lib/supabase';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const { data, error } =
      await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json(
        { message: 'Credenciales incorrectas' },
        { status: 401 },
      );
    }

    // 1 · Crea la respuesta
    const res = NextResponse.json({ ok: true });

    // 2 · Añade cookie http-only (7 días)
    res.cookies.set({
      name   : 'sb-access-token',
      value  : data.session!.access_token,
      httpOnly: true,
      path    : '/',
      maxAge  : 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error('[LOGIN]', err);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
