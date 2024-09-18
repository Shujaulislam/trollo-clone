// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

const LandingPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-5xl font-bold">Welcome to TaskTracker</h1>
      <p className="mb-8 text-xl">Manage your projects and tasks efficiently.</p>
      <div>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 mr-4 text-lg font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/register')}
          className="px-6 py-3 text-lg font-bold text-blue-500 bg-white border border-blue-500 rounded hover:bg-blue-50"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
