// src/components/ProjectsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import NewProjectModal from './NewProjectModal';
import Link from 'next/link'; // Import Link from next/link

interface Project {
  id: string;
  name: string;
  description?: string;
}

const ProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    setProjects(storedProjects);
  }, []);

  const addProject = (project: Project) => {
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 mb-4 font-bold text-white bg-green-500 rounded hover:bg-green-600"
      >
        New Project
      </button>
      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onSave={addProject}
        />
      )}
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="p-4 mb-2 bg-white rounded shadow">
            <Link href={`/projects/${project.id}`}>
              <div className="cursor-pointer">
                <h2 className="text-xl font-bold">{project.name}</h2>
                <p>{project.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsTab;
