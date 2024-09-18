// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProjectsTab from '@/components/ProjectsTab';
import TaskBoardTab from '@/components/TaskBoardTab';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'taskboard'>(
    'projects'
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 overflow-x-auto">
        <header className="p-4 bg-white shadow">
          <h1 className="text-2xl font-bold">Dashboard</h1>
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
