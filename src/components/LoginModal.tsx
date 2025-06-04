'use client';

import { useEffect, useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string) => void;
}

const API_URL = 'https://6596f49e6bb4ec36ca03a219.mockapi.io/spaceomid';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  // 🔐 Check cookie on mount
  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      onAuthSuccess(token);
      onClose();
    }
  }, [onAuthSuccess, onClose]);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  };

  const setCookie = (name: string, value: string, days = 7) => {
    const expires = `max-age=${days * 24 * 60 * 60}`;
    document.cookie = `${name}=${value}; path=/; ${expires}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setError('');

    try {
      if (isRegister) {
        // REGISTER
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name: 'Anonymous',
            lastname: 'User'
          }),
        });

        if (!res.ok) throw new Error('Registration failed');

        const fakeToken = btoa(`${email}:${password}`);
        setCookie('token', fakeToken);
        onAuthSuccess(fakeToken);
        onClose();

      } else {
        // LOGIN
        const res = await fetch(API_URL);
        const users = await res.json();

        const user = users.find(
          (u: { email: string; password: string }) => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const fakeToken = btoa(`${email}:${password}`);
        setCookie('token', fakeToken);
        onAuthSuccess(fakeToken);
        onClose();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold">×</button>
        <h2 className="text-xl font-bold mb-4 text-center">{isRegister ? 'Register' : 'Login'}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsRegister(prev => !prev)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
