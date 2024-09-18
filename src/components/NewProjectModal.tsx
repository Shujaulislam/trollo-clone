'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

interface NewProjectModalProps {
  onClose: () => void;
  onSave: (project: any) => void;
}

const projectSchema = z.object({
  name: z.string().min(1,'Project name is required.'),
  description: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const NewProjectModal = ({ onClose, onSave }: NewProjectModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = (data: ProjectFormData) => {
    const newProject = {
      id: uuidv4(),
      ...data,
      tasks: [],
    };

    onSave(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/2 p-8 bg-white rounded shadow-md"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">New Project</h2>
        <div className="mb-4">
          <label className="block mb-1">Project Name<span className="text-red-500">*</span></label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {errors.name && (
            <p className="mt-1 text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-1">Description<span className="text-red-500">*</span></label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
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
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectModal;
