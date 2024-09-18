'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple form validation
    if (!form.name || !form.email || !form.password) {
      setErrors('All fields are required.');
      return;
    }

    // Get existing users from local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exists
    const emailExists = users.some((user: any) => user.email === form.email);
    if (emailExists) {
      setErrors('Email is already registered.');
      return;
    }

    // Save user to local storage
    users.push(form);
    localStorage.setItem('users', JSON.stringify(users));

    setSuccessMessage('Registration successful! Redirecting to login page...');
 
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded shadow-md w-96"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Register</h2>
        {successMessage && (
         <p className="mb-4 text-green-500">{successMessage}</p>
       )}
        {errors && <p className="mb-4 text-red-500">{errors}</p>}
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Register
        </button>
        <p className="mt-4 text-center">
         Already have an account?{' '}
         <button
          type="button"
          onClick={() => router.push('/login')}
           className="font-bold text-blue-500 hover:underline"
         >
           Login here
         </button>
       </p>
      </form>
    </div>
  );
};

export default RegisterPage;
