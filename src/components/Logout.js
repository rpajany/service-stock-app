import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { ApiContext } from '../context/ApiProvider';
import { useSales } from '../context/salesContext';
import { usePurchase } from '../context/purchaseContext';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';

import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

// const BASE_URL = Get_BaseUrl();

const Logout = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    const BASE_URL = selectedApi;
    const { purchaseList, clear_PurchaseItems } = usePurchase();
    // const { selectedApi } = useContext(ApiContext);
    // Set_BaseUrl(selectedApi);
    const navigate = useNavigate();
    const { authData, setAuthData, ClearAuth } = useAuth(); // AuthContext
    const { clear_SalesItems } = useSales();
    const { setSelectedApi } = useContext(ApiContext);

    // ClearAuth(); // clear AuthContext
    // setAuthData(null)
    // console.log('authData :', authData);
    // localStorage.removeItem('selectedApi');
    // localStorage.clear()

    async function API_Logout() {
        try {

            const result = await POST_Api(BASE_URL + `/logout`);
            console.log('Logout :', result);

            // clear All
            ClearAuth(); // clear AuthContext
            setAuthData([]);
            clear_PurchaseItems();
            clear_SalesItems();
            // setSelectedApi('');

            localStorage.removeItem('selectedApi');
            localStorage.clear()
            console.log('authData :', authData);



            navigate('/login');
            // return result

        } catch (error) {
            console.log('Error in Logout :', error);
        }
    }

    // console.log('purchaseList', purchaseList)

    useEffect(() => {
        // ClearAuth(); // clear AuthContext
        // setAuthData([]);

        API_Logout();


        // navigate('/login');

    }, []) // navigate

    // useEffect(() => {
    //     // Log before removal
    //     console.log("Before deletion:", Cookies.get("token"));
    //     // Clear the token from cookies
    //     // Cookies.remove("token"); // Replace with the actual token name
    //     // Cookies.remove("token", { path: '/', sameSite: 'Lax', secure: true });
    //     Cookies.remove("token", { path: '/' }); // Adjust name to "token"
    //     // Additional method to remove using document.cookie for Secure cookies
    //     // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure";
    //     // Redirect to login page after clearing the token
    //     navigate('/login');
    // }, [navigate]);

    return null; // No UI needed for this component
};

export default Logout;
