// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProjectsTab from '@/components/ProjectsTab';
import TaskBoardTab from '@/components/TaskBoardTab';
import { useAuth } from '@/context/AuthContext';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'taskboard'>('projects');
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 overflow-x-auto">
        <header className="p-4 bg-white shadow flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center">
            <div className="mr-4 text-sm">
              <p>Welcome, {user?.name}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>
        <div className="flex min-w-max">
          <button
            className={`w-1/2 p-4 ${
              activeTab === 'projects' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={`w-1/2 p-4 ${
              activeTab === 'taskboard' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('taskboard')}
          >
            Task Board
          </button>
        </div>
        <main className="p-4 min-w-max">
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'taskboard' && <TaskBoardTab />}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;



