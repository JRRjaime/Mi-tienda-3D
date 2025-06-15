import { supabase } from '@/lib/supabase';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    /* 1 · Alta en Supabase Auth */
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    /* 2 · Actualiza el perfil con el nombre */
    await supabase.from('profiles').update({ name }).eq('id', data.user!.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[REGISTER]', err);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
