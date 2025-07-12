import React from 'react'
import { POST_Api, GET_Api, DELETE_Api } from './ApiService';

let BASE_URL = "";

export const CustomerService = () => {
    return (
        null
    )
}


// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};

export const Get_CustomerUID_Service = async () => {
    try {
        const url_customerUID = BASE_URL + '/uid/get_customerUID';
        const result1 = await GET_Api(url_customerUID, '');
        console.log('1. Get_CustomerUID_Service... :', result1);
        return result1[0];
    } catch (error) {
        console.log('Error Get CustomerData Service :', error);
        return false
    }
}

export const Save_CustomerData_Service = async (customerData) => {
    try {
        // 2. Insert Customer data ...
        const url_Insert_Customer = BASE_URL + `/customer/insert`;
        const result2 = await POST_Api(url_Insert_Customer, '', customerData);
        console.log('2. Insert CustomerData_Service...', result2);

    } catch (error) {
        console.log('Error Save_CustomerData_Service :', error);
        return false
    }
}

export const Update_CustomerData_Service = async (customerData) => {
    try {
        // 3. Update Customer data ...
        const url_Update_Customer = BASE_URL + `/customer/update/${customerData.Cust_id}`;
        const result3 = await POST_Api(url_Update_Customer, '', customerData);
        console.log('3. Update CustomerData_Service...', result3);

    } catch (error) {
        console.log('Error Update_CustomerData_Service :', error);
        return false
    }
}

export const Load_CustomerData_Service = async () => {
    try {
        const url_Load_Customer = BASE_URL + `/customer/load`;
        const result4 = await GET_Api(url_Load_Customer, '');
        console.log('4. Load_CustomerData_Service... :', result4);
        return result4;
    } catch (error) {
        console.log('Error Load_CustomerData_Service :', error);
        return false
    }
}