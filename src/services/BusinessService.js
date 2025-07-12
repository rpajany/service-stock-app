import React from 'react';
import { POST_Api, GET_Api, DELETE_Api } from './ApiService';
// import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { GetBaseURL } from '../helpers/GetBaseURL';
import { toast } from 'react-toastify';

let BASE_URL = ""; // GetBaseURL();// Get_BaseUrl();


// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};




export async function Get_BusinessService() {

    console.log('BASE_URL', BASE_URL)
    try {
        const url_GetCompany = BASE_URL + `/business/get_business`;
        const result0 = await GET_Api(url_GetCompany, '');
        console.log('1. Get Expense Service... :', result0);
        return result0;
    } catch (error) {
        console.log('Get Company Service Error :', error);
        return false
    }
}

export async function UpdateBusiness_Service(id, businessData) {
    // console.log('Business Service', businessData)
    try {
        const url_SaveBusiness = BASE_URL + `/business/update/${id}`;
        const result1 = await POST_Api(url_SaveBusiness, '', businessData);
        console.log('1. Update Business Service... :', result1);
        if (result1) {
            toast.success('Business Updated..!');
        }
        return true;
    } catch (error) {
        console.log('Update Business Service Error :', error);
        return false
    }
}