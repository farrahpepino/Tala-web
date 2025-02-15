import React, { useState } from 'react';
import TalaLogo from '../assets/tala/tala-darkbg.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { storeUserData } from '../utils/User/storeUserData';
import { handleReload } from '../utils/HandleReload';
const Register = () => {

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    email: ''
  })

  const [error, setError] = useState('')

  const handleChange = ({currentTarget: input}) => {
    console.log(`Input name: ${input.name}, value: ${input.value}`);
    setData({...data, [input.name]: input.value})
  }
  const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        const { data: res } = await         axios.post('http://localhost:5005/api/auth/register', data); 

        // axios.post('https://tala-web-kohl.vercel.app/api/auth/register', data); 
        storeUserData(res.token, res.user)
        window.location.href = '/home'; 
        console.log(res.message);

      }
      catch(error){
        if(error.response && 
          error.response.status >- 400 &&
          error.response.status <= 500){
            setError(error.response.data.message)
          }
      }

      
  }

  return (
    <div 
    style={{height:'90vh'}}
    className='Register'>

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-20 w-auto" src={TalaLogo} alt="Tala" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-500 text-left">
              First name
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                value={data.firstName}
                type="text"
                required
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-500 text-left">
              Last name
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                value={data.lastName}
                type="text"
                required
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>


            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500 text-left">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={data.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-500 text-left">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
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
                className="flex w-full justify-center rounded-md bg-gray-700 bg-opacity-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-100 shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Register
              </button>
            </div>
          </form>

          {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}

          <p className="mt-10 text-center text-sm text-gray-500">
            Already part of the community?{' '}
            <Link to="/login" className="font-semibold leading-6 text-gray-400 hover:text-gray-300">
              Log in
            </Link>
          </p>
          <span className='ml-2'> 💌</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
