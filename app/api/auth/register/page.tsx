'use client';
import { useState } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear cuenta | World 3D',
};

export default function RegisterPage() {
  const [state, setState] = useState<'idle' | 'ok' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    };

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setState(res.ok ? 'ok' : 'error');
  }

  return (
    <main className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Nombre completo"
          className="input w-full"
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          className="input w-full"
          required
        />
        <input
          name="password"
          placeholder="Contraseña (6+ caracteres)"
          type="password"
          minLength={6}
          className="input w-full"
          required
        />

        <button type="submit" className="btn w-full">
          Crear cuenta
        </button>

        {state === 'ok' && (
          <p className="text-green-600 text-center">¡Cuenta creada!</p>
        )}
        {state === 'error' && (
          <p className="text-red-600 text-center">
            Error al registrar, inténtalo de nuevo
          </p>
        )}
      </form>
    </main>
  );
}