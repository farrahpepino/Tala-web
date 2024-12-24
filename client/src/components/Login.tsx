import React, { useState } from 'react';
import TalaLogo from '../assets/tala/tala-darkbg.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { storeUserData } from '../utils/User/storeUserData';
const Login = () => {
  const [data, setData] = useState({ password: '', email: '' });
  const [error, setError] = useState('');

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(
        '/api/auth/login',
        {
            email: data.email, // Ensure correct fields
            password: data.password,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
      storeUserData(res.token, res.user)
      window.location.href = 'home'

    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="Login">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-20 w-auto" src={TalaLogo} alt="Tala" />
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500">Email address</label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={data.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-500">Password</label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={data.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-gray-700 bg-opacity-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-100 shadow-sm hover:bg-gray-600"
              >
                Sign in
              </button>
            </div>
          </form>
          {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
          <p className="mt-10 text-center text-sm text-gray-500">
            Ready to connect with your friends?{' '}
            <Link to="/register" className="font-semibold leading-6 text-gray-400 hover:text-gray-300">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
