// src/app/projects/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import NewTaskModal from '@/components/NewTaskModal';
import { Edit2, Trash2, Plus, Calendar, User, Tag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Briefcase, ClipboardList } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Task {
  id: string;
  name: string;
  description?: string;
  status: string;
  tags: string[];
  dueDate?: string;
  assignedUser: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
}

const ProjectDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const foundProject = storedProjects.find(
      (p: Project) => p.id === params.id
    );
    if (foundProject) {
      setProject(foundProject);
    } else {
      router.push('/dashboard');
    }
  }, [params.id, router]);

  const addOrUpdateTask = (task: Task) => {
    if (project) {
      const updatedTasks = taskToEdit
        ? project.tasks.map((t) => (t.id === task.id ? task : t))
        : [...(project.tasks || []), task];

      const updatedProject = {
        ...project,
        tasks: updatedTasks,
      };
      setProject(updatedProject);

      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const projectIndex = storedProjects.findIndex(
        (p: Project) => p.id === project.id
      );
      storedProjects[projectIndex] = updatedProject;
      localStorage.setItem('projects', JSON.stringify(storedProjects));
    }
    setTaskToEdit(null);
  };

  const deleteTask = (taskId: string) => {
    if (project) {
      const updatedTasks = project.tasks.filter((t) => t.id !== taskId);
      const updatedProject = {
        ...project,
        tasks: updatedTasks,
      };
      setProject(updatedProject);

      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const projectIndex = storedProjects.findIndex(
        (p: Project) => p.id === project.id
      );
      storedProjects[projectIndex] = updatedProject;
      localStorage.setItem('projects', JSON.stringify(storedProjects));
    }
  };

  if (!project) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-x-auto">
        <header className="p-6 bg-white shadow-md flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-700">Project Details</h1>
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
        <main className="p-6 mt-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">{project.name}</h2>
            <p className="text-gray-600 mb-6">{project.description}</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 mb-6 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
            >
              <Plus size={20} className="mr-2" />
              New Task
            </button>
            {(showModal || taskToEdit) && (
              <NewTaskModal
                projectId={project.id}
                onClose={() => {
                  setShowModal(false);
                  setTaskToEdit(null);
                }}
                onSave={addOrUpdateTask}
                taskToEdit={taskToEdit as any}
              />
            )}
            <div className="space-y-4">
              {project.tasks?.map((task) => (
                <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{task.name}</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setTaskToEdit(task)}
                        className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{task.dueDate || 'No due date'}</span>
                    </div>
                    <div className="flex items-center">
                      <User size={14} className="mr-1" />
                      <span>{task.assignedUser}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag size={14} className="mr-1" />
                      <span>{task.status}</span>
                    </div>
                  </div>
                  {task.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {project.tasks.length === 0 && (
              <p className="text-center text-gray-500 mt-8">No tasks yet. Create a new task to get started!</p>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectDetailsPage;









