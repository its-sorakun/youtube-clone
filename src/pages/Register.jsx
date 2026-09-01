import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center">Create Account</h2>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
        <input 
          type="text" 
          name="username"
          placeholder="Username" 
          value={formData.username}
          onChange={handleChange}
          required
          className="border p-2 rounded outline-none focus:border-blue-500"
        />
        
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 rounded outline-none focus:border-blue-500"
        />
        
        <input 
          type="password" 
          name="password"
          placeholder="Password" 
          value={formData.password}
          onChange={handleChange}
          required
          className="border p-2 rounded outline-none focus:border-blue-500"
        />
        
        <button type="submit" className="bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700">
          Sign Up
        </button>
        
        <p className="text-sm text-center mt-2">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
