// src/components/ProtectedRoute.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
