import React from 'react';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};

export async function load_Customer_Service() {
    try {
        // const url_Customer = BASE_URL + '/customer/search_load';
        const url_Customer = BASE_URL + '/customer/load';
        const data0 = await GET_Api(url_Customer, '');
        // console.log('1. Load Stock Service :', data0);
        return data0
    } catch (error) {
        console.log(' Load Stock Service Error :', error);
        return false;
    }
}

export async function Get_CustomerDevices_Service(Cust_id) {
    try {
        const url_Device = BASE_URL + `/service/get_device/${Cust_id}`;
        const data1 = await GET_Api(url_Device, '');
        // console.log('2. Get_CustomerDevices Service :', data1);
        return data1
    } catch (error) {
        console.log('Get_CustomerDevices Error :', error);
        return false;
    }
}