'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewProjectModal from './NewProjectModal';

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
    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
      <button
        onClick={() => setShowModal(true)}
        className="mb-6 px-4 py-2 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-800 transition duration-300 ease-in-out"
      >
        New Project
      </button>
      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onSave={addProject}
        />
      )}
      <div className="space-y-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="block p-4 bg-white rounded-md hover:bg-gray-300 transition duration-300 ease-in-out">
              <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
      {projects.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No projects yet. Create a new project to get started!</p>
      )}
    </div>
  );
};

export default ProjectsTab;





















// 'use client';

// import { useState, useEffect } from 'react';
// import NewProjectModal from './NewProjectModal';
// import Link from 'next/link'; // Import Link from next/link

// interface Project {
//   id: string;
//   name: string;
//   description?: string;
// }

// const ProjectsTab = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
//     setProjects(storedProjects);
//   }, []);

//   const addProject = (project: Project) => {
//     const updatedProjects = [...projects, project];
//     setProjects(updatedProjects);
//     localStorage.setItem('projects', JSON.stringify(updatedProjects));
//   };

//   return (
//     <div>
//       <button
//         onClick={() => setShowModal(true)}
//         className="px-4 py-2 mb-4 font-bold text-white bg-green-500 rounded hover:bg-green-600"
//       >
//         New Project
//       </button>
//       {showModal && (
//         <NewProjectModal
//           onClose={() => setShowModal(false)}
//           onSave={addProject}
//         />
//       )}
//       <ul>
//         {projects.map((project) => (
//           <li key={project.id} className="p-4 mb-2 bg-white rounded shadow">
//             <Link href={`/projects/${project.id}`}>
//               <div className="cursor-pointer">
//                 <h2 className="text-xl font-bold">{project.name}</h2>
//                 <p>{project.description}</p>
//               </div>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProjectsTab;
