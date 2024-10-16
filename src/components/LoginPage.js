import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token); // Store the token in local storage
      navigate('/'); // Redirect to the home page after successful login
      window.location.reload();
    } catch (err) {
      setError(err.response.data.message || 'Login failed');
      console.error('Error during login:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-200 to-orange-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-shadow duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full transition duration-200 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full transition duration-200 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <button type="submit" className="bg-teal-600 text-white px-6 py-3 rounded-lg transition duration-300 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
