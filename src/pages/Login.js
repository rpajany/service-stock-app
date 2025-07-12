import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiContext } from '../context/ApiProvider';
import { useTitle } from '../hooks/useTitle';
// import { Set_BaseUrl } from '../helpers/custom';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { toast } from 'react-toastify';

export const Login = () => {
  useTitle('Login'); // set Title
  const { selectedApi, setSelectedApi } = useContext(ApiContext);
  // Set_BaseUrl(selectedApi); // Set base url
  const { authData, setAuthData } = useAuth();

  const navigate = useNavigate();
  const [data, setData] = useState({ username: "admin", password: "123" });
  const [error, SetError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

  const apiOptions = [
    { label: "Magnanum Systems", value: process.env.REACT_APP_BACKEND1_BASE_URL },
    { label: "Global Systems", value: process.env.REACT_APP_BACKEND2_BASE_URL },
  ];

  // const [selectedApi, setSelectedApi] = useState(apiOptions[0].value);


  console.log('selectedApi', selectedApi);


  useEffect(() => {
    setSelectedApi(apiOptions[0].value);


  }, [])

  let BASE_URL = selectedApi;

  const handleSelectApi = (e) => {

    setSelectedApi(e.target.value);
    BASE_URL = e.target.value

  }



  const handleOnChange = (e) => {
    const { name, value } = e.target // destructure

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    SetError('');

    if (data.username === "" || data.password === "") {
      return
    }

    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true); // Lock the form during submission


    try {
      const url = BASE_URL + '/user/signin';
      console.log('url', url)
      const dataResponse = await fetch(url, {
        method: 'POST',
        credentials: 'include',  // add token to client browser
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(data) // state data username & password

      })

      // console.log('Login response :', dataResponse)

      if (!dataResponse.ok) {
        throw new Error("Invalid credentials.");
      }

      const dataApi = await dataResponse.json(); // convert to json
      // console.log('dataApi :', dataApi)

      if (dataApi.success) {  // on success
        localStorage.setItem('selectedApi', selectedApi);

        const url_UserAuth = BASE_URL + `/user/user_details`;
        const res = await GET_Api(url_UserAuth, '');
        // console.log('res', res)
        if (res) {
          // console.log('user_data', res)
          // return res[0]
          setAuthData(res);
        }

        toast.success(dataApi.message)
        navigate('/')
      }

      if (dataApi.error) {  // on error
        // toast.error(dataApi.message)
        SetError(dataApi.message);
      }

    } catch (error) {
      console.log('Error :', error)
      // toast.error(error.message)
      SetError(error.messag);
    } finally {

      setIsSubmitting(false); // Unlock the form
    }



  }

  return (

    <div className='py-20 '>



      <form onSubmit={handleSubmit} className="max-w-sm mx-auto m-2 border-2  bg-green-300 border-gray-300 rounded-md p-5 ">

        <div className='flex flex-col items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-person-fill-lock border-2 rounded-full p-1 " viewBox="0 0 16 16">
            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5v-1a2 2 0 0 1 .01-.2 4.49 4.49 0 0 1 1.534-3.693Q8.844 9.002 8 9c-5 0-6 3-6 4m7 0a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
          </svg>
          <h1 className='text-gray-400  font-semibold py-1'>Login</h1>
        </div>

        <div className='w-full  text-center mt-4 mb-4'>
          {/* <label className='mr-4'>Company</label> */}
          <select id="company" name="comapany" value={selectedApi} onChange={(e) => handleSelectApi(e)} className='bg-gray-100 border-0 text-black rounded-md'>
            {apiOptions.map((api) => (
              <option key={api.value} value={api.value} >{api.label}</option>
            ))}
          </select>
        </div>




        <label htmlFor="website-admin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          </span>





          <input type="text"
            id="username"
            name="username"
            value={data.username}
            onChange={handleOnChange}
            placeholder="Enter Username"
            autoComplete='off'
            className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>

        <label htmlFor="website-admin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-key-fill" viewBox="0 0 16 16">
              <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
            </svg>
          </span>
          <input
            type="password"
            id="password"
            name="password"
            value={data.password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            autoComplete='off'
            className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>

        <div className='flex flex-col my-4'>
          <button type="submit"
            disabled={isSubmitting}
            className={` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}>Login</button>
        </div>

        {error && (
          <div className='text-red-600'>{error}</div>
        )}

      </form>

    </div>

  )
}
