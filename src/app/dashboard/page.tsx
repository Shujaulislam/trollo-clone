'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProjectsTab from '@/components/ProjectsTab';
import TaskBoardTab from '@/components/TaskBoardTab';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Briefcase, ClipboardList } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-x-auto">
        <header className="p-6 bg-white shadow-md flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-700">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <p className="font-semibold text-gray-700">Welcome, {user?.name}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center space-x-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>
        <nav className="flex bg-white shadow-sm mt-4 mx-4 rounded-lg overflow-hidden">
          <button
            className={`flex-1 p-4 flex items-center justify-center space-x-2 ${
              activeTab === 'projects'
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-700 hover:bg-indigo-100'
            } transition-colors duration-300`}
            onClick={() => setActiveTab('projects')}
          >
            <Briefcase size={18} />
            <span>Projects</span>
          </button>
          <button
            className={`flex-1 p-4 flex items-center justify-center space-x-2 ${
              activeTab === 'taskboard'
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-700 hover:bg-indigo-100'
            } transition-colors duration-300`}
            onClick={() => setActiveTab('taskboard')}
          >
            <ClipboardList size={18} />
            <span>Task Board</span>
          </button>
        </nav>
        <main className="p-6 mt-4">
          <div className="bg-white rounded-lg shadow-md p-6 min-w-max">
            {activeTab === 'projects' && <ProjectsTab />}
            {activeTab === 'taskboard' && <TaskBoardTab />}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;