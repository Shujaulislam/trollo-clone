// src/components/NewTaskModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";
import { useAuth } from '@/context/AuthContext';

interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: string;
  tags: string[];
  dueDate: string;
  assignedUser: string;
}

interface NewTaskModalProps {
  projectId: string;
  onClose: () => void;
  onSave: (task: any) => void;
  taskToEdit?: Task; // Add this line
}

const NewTaskModal = ({ projectId, onClose, onSave, taskToEdit }: NewTaskModalProps) => {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: taskToEdit?.name || '',
    description: taskToEdit?.description || '',
    status: taskToEdit?.status || '',
    tags: taskToEdit?.tags.join(', ') || '',
    dueDate: taskToEdit?.dueDate || '',
    assignedUser: taskToEdit?.assignedUser || user?.name || '',
  });
  const [errors, setErrors] = useState<string>('');

  useEffect(() => {
    const storedStatuses = JSON.parse(localStorage.getItem('statuses') || '[]');
    setStatuses(storedStatuses);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are filled
    const requiredFields = ['name', 'description', 'status', 'tags', 'dueDate', 'assignedUser'];
    const emptyFields = requiredFields.filter(field => !form[field as keyof typeof form]);

    if (emptyFields.length > 0) {
      setErrors(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      return;
    }

    const updatedTask = {
      id: taskToEdit?.id || uuidv4(),
      projectId,
      name: form.name,
      description: form.description,
      status: form.status,
      tags: form.tags.split(',').map((tag) => tag.trim()),
      dueDate: form.dueDate,
      assignedUser: form.assignedUser,
    };

    // Add the new status to the list if it doesn't exist
    if (!statuses.includes(form.status)) {
      const updatedStatuses = [...statuses, form.status];
      setStatuses(updatedStatuses);
      localStorage.setItem('statuses', JSON.stringify(updatedStatuses));
    }

    onSave(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="w-1/2 p-8 bg-white rounded shadow-md"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">
          {taskToEdit ? 'Edit Task' : 'New Task'}
        </h2>
        {errors && <p className="mb-4 text-red-500">{errors}</p>}
        <div className="mb-4">
          <label className="block mb-1">Task Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Status *</label>
          <div className="flex">
            <input
              type="text"
              name="status"
              value={form.status}
              onChange={handleChange}
              placeholder="Enter status"
              className="w-full px-3 py-2 border rounded mr-2"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Tags (comma-separated) *</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Due Date *</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Assigned User *</label>
          <input
            type="text"
            name="assignedUser"
            value={form.assignedUser}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 mr-2 font-bold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {taskToEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskModal;
