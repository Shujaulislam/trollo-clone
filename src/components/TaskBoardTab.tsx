// src/components/TaskBoardTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Task {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: string;
  tags: string[];
  dueDate?: string;
  assignedUser: string;
}

const TaskBoardTab = () => {
  const [tasksByStatus, setTasksByStatus] = useState<{ [key: string]: Task[] }>({});
  const [statuses, setStatuses] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const removeEmptyStatuses = useCallback((tasks: { [key: string]: Task[] }) => {
    return Object.keys(tasks).filter(status => tasks[status].length > 0);
  }, []);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const storedStatuses = JSON.parse(localStorage.getItem('statuses') || '[]');
    
    let allTasks: Task[] = [];
    storedProjects.forEach((project: any) => {
      allTasks = allTasks.concat(project.tasks || []);
    });

    const groupedTasks = storedStatuses.reduce((acc: { [key: string]: Task[] }, status: string) => {
      acc[status] = allTasks.filter((task) => task.status === status);
      return acc;
    }, {} as { [key: string]: Task[] });

    setTasksByStatus(groupedTasks);
    const nonEmptyStatuses = removeEmptyStatuses(groupedTasks);
    setStatuses(nonEmptyStatuses);

    // Update statuses in local storage
    localStorage.setItem('statuses', JSON.stringify(nonEmptyStatuses));
  }, [removeEmptyStatuses]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    setTasksByStatus(prev => {
      const newTasksByStatus = { ...prev };
      const [movedTask] = newTasksByStatus[source.droppableId].splice(source.index, 1);
      movedTask.status = destination.droppableId;
      newTasksByStatus[destination.droppableId].splice(destination.index, 0, movedTask);

      // Update task in local storage
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      storedProjects.forEach((project: any) => {
        project.tasks = project.tasks.map((task: Task) => 
          task.id === movedTask.id ? movedTask : task
        );
      });
      localStorage.setItem('projects', JSON.stringify(storedProjects));

      const newStatuses = removeEmptyStatuses(newTasksByStatus);
      setStatuses(newStatuses);
      localStorage.setItem('statuses', JSON.stringify(newStatuses));

      return newTasksByStatus;
    });
  };

  const addOrUpdateTask = (updatedTask: Task) => {
    setTasksByStatus(prev => {
      const newTasksByStatus = { ...prev };
      
      // Remove the task from its previous status if it existed
      Object.keys(newTasksByStatus).forEach(status => {
        newTasksByStatus[status] = newTasksByStatus[status].filter(task => task.id !== updatedTask.id);
      });

      // Add the task to its new status
      if (!newTasksByStatus[updatedTask.status]) {
        newTasksByStatus[updatedTask.status] = [];
      }
      newTasksByStatus[updatedTask.status].push(updatedTask);

      // Update task in local storage
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      storedProjects.forEach((project: any) => {
        const taskIndex = project.tasks.findIndex((task: Task) => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          project.tasks[taskIndex] = updatedTask;
        } else if (project.id === updatedTask.projectId) {
          project.tasks.push(updatedTask);
        }
      });
      localStorage.setItem('projects', JSON.stringify(storedProjects));

      const newStatuses = removeEmptyStatuses(newTasksByStatus);
      setStatuses(newStatuses);
      localStorage.setItem('statuses', JSON.stringify(newStatuses));

      return newTasksByStatus;
    });

    setEditingTask(null);
  };

  const deleteTask = (taskToDelete: Task) => {
    setTasksByStatus(prev => {
      const newTasksByStatus = { ...prev };
      newTasksByStatus[taskToDelete.status] = newTasksByStatus[taskToDelete.status].filter(
        task => task.id !== taskToDelete.id
      );

      // Remove task from local storage
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      storedProjects.forEach((project: any) => {
        project.tasks = project.tasks.filter((task: Task) => task.id !== taskToDelete.id);
      });
      localStorage.setItem('projects', JSON.stringify(storedProjects));

      const newStatuses = removeEmptyStatuses(newTasksByStatus);
      setStatuses(newStatuses);
      localStorage.setItem('statuses', JSON.stringify(newStatuses));

      return newTasksByStatus;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingTask(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (statuses.length === 0) {
    return (
      <div className="p-4 text-center min-w-full">
        <p>No statuses defined. Please define statuses in the settings before using the task board.</p>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 p-4 min-w-full">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="flex-shrink-0 w-80 p-2 bg-gray-200 rounded"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="mb-2 text-xl font-bold">{status}</h2>
                  {tasksByStatus[status]?.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="p-2 mb-2 bg-white rounded shadow"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold">{task.name}</h3>
                            <div>
                              <button
                                onClick={() => setEditingTask(task)}
                                className="mr-2 text-blue-500 hover:text-blue-600"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => deleteTask(task)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <p>{task.description}</p>
                          <p>{task.tags}</p>
                          <p>{task.dueDate}</p>
                          <p>{task.assignedUser}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={(e) => { e.preventDefault(); addOrUpdateTask(editingTask); }}>
              <div className="mb-4">
                <label className="block mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={editingTask.name}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={editingTask.description}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Status <span className="text-red-500">*</span></label>
                <select
                  name="status"
                  value={editingTask.status}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Select a status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Due Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="dueDate"
                  value={editingTask.dueDate}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Assigned User <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="assignedUser"
                  value={editingTask.assignedUser}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskBoardTab;
