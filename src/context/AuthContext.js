import React, { createContext, useContext, useState, useEffect } from "react";
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { ApiContext } from '../context/ApiProvider';

// const BASE_URL = Get_BaseUrl();

function getCookieValue(cookieName) {

    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return decodeURIComponent(value);
        }
    }
    return null; // Cookie not found
}






// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


    const [authData, setAuthData] = useState(null);

    const ClearAuth = () => {

        console.log('Clear Called.. !')
        setAuthData("")
    }

    useEffect(() => {
        // const authCookie = getCookieValue('token');

        // console.log(authCookie);

        // if (authCookie) {
        //     try {
        //         const parsedData = JSON.parse(authCookie);
        //         setAuthData(parsedData);
        //     } catch (error) {
        //         console.error('Failed to parse auth_data:', error);
        //     }
        // }



        // async function Get_userAuthData() {

        //     const url_UserAuth = BASE_URL + `/user/user_details`;
        //     const res = await GET_Api(url_UserAuth, '');
        //     console.log('res', res)
        //     if (res.length > 0) {
        //         // console.log('user_data', res[0])
        //         // return res[0]
        //         setAuthData(res[0]);
        //     }


        // }

        // Get_userAuthData();




    }, []);

    // console.log('authData', authData)

    // const value = {
    //     authData,
    //     setAuthData,
    //     ClearAuth
    // }

    return (
        <AuthContext.Provider value={{
            authData,
            setAuthData,
            ClearAuth
        }}>
            {children}
        </AuthContext.Provider>
    );


}

export const useAuth = () => useContext(AuthContext);