'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //  Form validation
    if (!form.email || !form.password) {
      setErrors('Email and password are required.');
      return;
    }

    // Authenticate user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u: any) => u.email === form.email && u.password === form.password
    );

    if (user) {
      login(user);
      router.push('/dashboard');
    } else {
      setErrors('Invalid credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded shadow-md w-96"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
        {errors && <p className="mb-4 text-red-500">{errors}</p>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="mt-4 text-center">
        Don&apos;t have an account?{' '}
         <button
           type="button"
           onClick={() => router.push('/register')}
           className="font-bold text-blue-500 hover:underline"
         >
           Register here
         </button>
       </p>
      </form>
    </div>
  );
};

export default LoginPage;
