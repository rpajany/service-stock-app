import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';

// import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { ApiContext } from '../context/ApiProvider';
// import { GetBaseURL } from '../helpers/GetBaseURL';

// import Cookies from 'js-cookie';

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

const ProtectedRoute = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    BASE_URL = selectedApi;

    // const { selectedApi, setSelectedApi } = useContext(ApiContext);
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

    // BASE_URL = localStorage.getItem('selectedApi');
    // console.log('BASE_URL', BASE_URL)

    // useEffect(() => {
    //     BASE_URL = selectedApi;
    // }, [selectedApi]);


    useEffect(() => {
        // Make a request to the backend to check if the user is authenticated
        const checkAuth = async () => {
            try {
                const response = await fetch(BASE_URL + '/auth/verify', {
                    method: 'GET',
                    credentials: 'include' // This includes cookies with the request
                });

                if (response.ok) {
                    const data = await response.json();
                    // console.log('auth_data :', data)
                    setIsAuthenticated(data.isAuthenticated);
                } else {
                    setIsAuthenticated(false);
                }

                // console.log('ProtectedRoute response :', response)

                // const response = await axios.get('/auth/verify', { withCredentials: true }); // Ensure withCredentials is true
                // setIsAuthenticated(response.data.isAuthenticated);


            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Show loading state while checking auth
    if (isAuthenticated === null) return <div>Loading...</div>;

    // If authenticated, render the protected component(s)
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
