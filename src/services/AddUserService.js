import React from 'react';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { toast } from 'react-toastify';

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};

export async function Load_User_Service() {
    try {
        let url_loadUser = BASE_URL + `/user/load`;
        const result0 = await GET_Api(url_loadUser, '');
        return result0;
    } catch (error) {
        console.log('Load User Service Error :', error);
        return false
    }
}

export async function Save_User_Service(userData) {
    console.log('userData', userData)
    try {
        const url_SaveUser = BASE_URL + `/user/signup`;
        const result1 = await POST_Api(url_SaveUser, '', userData);
        console.log('1. Save User Service... :', result1);
        if (result1) {
            toast.success('User Added..!');
        }
        return true;
    } catch (error) {
        console.log('Save User Service Error :', error);
        return false
    }
}

export async function Delete_User_Service(row) {
    // console.log(row)
    try {
        const url_DeleteUser = BASE_URL + `/user/delete/${row.user_id}`;
        const result6 = await DELETE_Api(url_DeleteUser, '');
        console.log('6. DELETE User Service... :', result6);
        if (result6) {
            toast.success('User Deleted..!');
        }
        return true;
    } catch (error) {
        console.log('Save User Service Error :', error);
        return false
    }
}