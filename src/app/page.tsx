'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

const LandingPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center">
        <h1 className="mb-6 text-5xl font-bold text-indigo-900">Welcome to TaskTracker</h1>
        <p className="mb-8 text-xl text-indigo-700">Manage your projects and tasks efficiently.</p>
      </div>

      <div className="space-x-4">
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/register')}
          className="px-6 py-3 text-lg font-bold text-indigo-600 bg-white border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;













