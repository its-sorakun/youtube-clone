import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.email.trim()) {
      setStep(2);
      setError('');
    } else {
      setError('Enter a valid email or phone number');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      dispatch(loginUser({ token: res.data.token, user: res.data.user }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f4f9] flex flex-col items-center justify-center p-4 font-[Roboto]">
      <div className="bg-white rounded-[28px] w-full max-w-[1040px] flex flex-col md:flex-row p-9 md:p-12 gap-10 md:gap-16 shadow-sm min-h-[400px]">
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-start md:justify-center relative">
          {/* Top Left G Icon */}
          <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6">
            <img
              src="https://www.gstatic.com/images/branding/googleg_gradient/svg/googleg_gradient_standard_48px.svg"
              alt="Google"
              className="w-10 h-10 md:w-12 md:h-12"
            />
          </div>

          <h1 className="text-4xl font-normal text-[#1f1f1f] mb-4 mt-8 md:mt-0">
            {step === 1 ? 'Sign in' : 'Welcome'}
          </h1>
          <p className="text-base text-[#1f1f1f]">
            {step === 1 ? 'to continue to YouTube' : formData.email}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col pt-2 justify-center">
          <div>
            {error && <div className="text-[#d93025] text-sm mb-4 flex items-center gap-2">
              <svg aria-hidden="true" fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
              {error}
            </div>}

            {step === 1 ? (
              <form id="login-form-1" onSubmit={handleNext} className="flex flex-col w-full">
                <div className="relative z-0 w-full group">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="block py-4 px-4 w-full text-base text-[#1f1f1f] bg-transparent border border-gray-400 appearance-none rounded focus:outline-none focus:ring-2 focus:ring-[#0b57d0] focus:border-[#0b57d0] peer"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    autoFocus
                    required
                  />
                  <label
                    htmlFor="email"
                    className="peer-focus:font-medium absolute text-base text-[#444746] duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 bg-white px-1 left-3 peer-focus:text-[#0b57d0]"
                  >
                    Email or phone
                  </label>
                </div>
              </form>
            ) : (
              <form id="login-form-2" onSubmit={handleSubmit} className="flex flex-col w-full">
                <div className="relative z-0 w-full group">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="block py-4 px-4 w-full text-base text-[#1f1f1f] bg-transparent border border-gray-400 appearance-none rounded focus:outline-none focus:ring-2 focus:ring-[#0b57d0] focus:border-[#0b57d0] peer"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    autoFocus
                    required
                  />
                  <label
                    htmlFor="password"
                    className="peer-focus:font-medium absolute text-base text-[#444746] duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 bg-white px-1 left-3 peer-focus:text-[#0b57d0]"
                  >
                    Enter your password
                  </label>
                </div>
              </form>
            )}
          </div>

          <div className="flex justify-between items-center mt-12 pt-4">
            {step === 1 ? (
              <>
                <Link to="/register" className="text-[#0b57d0] text-sm font-medium hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">
                  Create account
                </Link>
                <button form="login-form-1" type="submit" className="bg-[#0b57d0] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors">
                  Next
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setStep(1)} className="text-[#0b57d0] text-sm font-medium hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">
                  Back
                </button>
                <button form="login-form-2" type="submit" className="bg-[#0b57d0] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors">
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
