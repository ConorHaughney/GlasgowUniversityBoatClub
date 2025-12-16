'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError('Invalid credentials');
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setSuccess('Logged in successfully. Redirecting...');
      setTimeout(() => router.push('/admin/dashboard'), 1000);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 pt-24">
      <div className="w-full max-w-md bg-[#0f0f0f] border border-[#ffdc36] rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-[#ffdc36] uppercase tracking-wide">Admin Login</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:border-[#ffdc36] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:border-[#ffdc36] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffdc36] text-black font-semibold py-2 rounded-md hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-4 text-sm text-green-400">{success}</p>}
      </div>
    </div>
  );
}