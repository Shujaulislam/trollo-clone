// src/app/projects/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import NewTaskModal from '../../../components/NewTaskModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

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
  }, [params.id]);

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

      // Update projects in local storage
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

      // Update projects in local storage
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
    <div className="p-4">
      <h1 className="mb-4 text-3xl font-bold">{project.name}</h1>
      <p className="mb-4">{project.description}</p>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 mb-4 font-bold text-white bg-green-500 rounded hover:bg-green-600"
      >
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
      <ul>
        {project.tasks?.map((task) => (
          <li key={task.id} className="p-4 mb-2 bg-white rounded shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{task.name}</h2>
              <div>
                <button
                  onClick={() => setTaskToEdit(task)}
                  className="mr-2 text-blue-500 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p>{task.description}</p>
            {/* Additional task details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetailsPage;
