'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Edit2, Trash2, Calendar, User, Plus } from 'lucide-react';

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
  const [newStatusName, setNewStatusName] = useState('');

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

  const addNewTask = (status: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      projectId: '', 
      name: '',
      description: '',
      status: status,
      tags: [],
      dueDate: '',
      assignedUser: '',
    };
    setEditingTask(newTask);
  };

  const addNewStatus = () => {
    if (newStatusName.trim()) {
      setStatuses(prev => [...prev, newStatusName.trim()]);
      setTasksByStatus(prev => ({ ...prev, [newStatusName.trim()]: [] }));
      localStorage.setItem('statuses', JSON.stringify([...statuses, newStatusName.trim()]));
      setNewStatusName('');
    }
  };

  const addOrUpdateTask = (updatedTask: Task) => {
    setTasksByStatus(prev => {
      const newTasksByStatus = { ...prev };
      
      Object.keys(newTasksByStatus).forEach(status => {
        newTasksByStatus[status] = newTasksByStatus[status].filter(task => task.id !== updatedTask.id);
      });

      if (!newTasksByStatus[updatedTask.status]) {
        newTasksByStatus[updatedTask.status] = [];
      }
      newTasksByStatus[updatedTask.status].push(updatedTask);

      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      let taskAdded = false;
      storedProjects.forEach((project: any) => {
        const taskIndex = project.tasks.findIndex((task: Task) => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          project.tasks[taskIndex] = updatedTask;
          taskAdded = true;
        } else if (project.id === updatedTask.projectId) {
          project.tasks.push(updatedTask);
          taskAdded = true;
        }
      });

      // If the task wasn't added to any existing project, add it to the first project
      
      if (!taskAdded && storedProjects.length > 0) {
        storedProjects[0].tasks.push(updatedTask);
      }

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
      <div className="p-8 text-center bg-gray-100 rounded-lg shadow-inner">
        <p className="text-lg text-gray-600">No statuses defined. Please define statuses in the settings before using the task board.</p>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-6 p-6 overflow-x-auto">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="flex-shrink-0 w-80 bg-gray-100 rounded-lg shadow-md"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="p-4 text-xl font-bold text-gray-700 border-b border-gray-200">{status}</h2>
                  <div className="p-4 space-y-4">
                    {tasksByStatus[status]?.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-semibold text-gray-800">{task.name}</h3>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingTask(task)}
                                  className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteTask(task)}
                                  className="text-red-500 hover:text-red-600 transition-colors duration-200"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {task.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar size={14} className="mr-1" />
                              <span>{task.dueDate}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <User size={14} className="mr-1" />
                              <span>{task.assignedUser}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <button
                      onClick={() => addNewTask(status)}
                      className="w-full p-2 text-left text-gray-600 hover:bg-gray-200 rounded transition-colors duration-200 flex items-center"
                    >
                      <Plus size={16} className="mr-2" />
                      Add a task
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
          <div className="flex-shrink-0 w-80">
            <input
              type="text"
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              placeholder="Enter list title..."
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <button
              onClick={addNewStatus}
              className="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
            >
              <Plus size={16} className="mr-2" />
              Add another list
            </button>
          </div>
        </div>
      </DragDropContext>
      
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {editingTask.id ? 'Edit Task' : 'Add New Task'}
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); addOrUpdateTask(editingTask); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={editingTask.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={editingTask.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                <select
                  name="status"
                  value={editingTask.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap items-center p-2 border border-gray-300 rounded-md">
                  {editingTask.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 m-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = editingTask.tags.filter((_, i) => i !== index);
                          setEditingTask({...editingTask, tags: newTags});
                        }}
                        className="ml-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const newTag = e.currentTarget.value.trim();
                        if (newTag && !editingTask.tags.includes(newTag)) {
                          setEditingTask({...editingTask, tags: [...editingTask.tags, newTag]});
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="flex-grow px-2 py-1 outline-none"
                    placeholder="Enter tags..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="dueDate"
                  value={editingTask.dueDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned User <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="assignedUser"
                  value={editingTask.assignedUser}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  {editingTask.id ? 'Save' : 'Add'}
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