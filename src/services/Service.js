import React from 'react'
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';

import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { toast } from 'react-toastify';

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// export async function get_ServiceUID_Service() {
//     try {
//         const url_serviceUID = BASE_URL + '/uid/get_serviceUID';

//         const result0 = await GET_Api(url_serviceUID, '');


//         console.log(result0[0].Service_UID + 1)

//         // console.log('1. Get ServiceUID Service... :', result0[0]["Service_UID"]);
//         return result0[0]['Service_UID'];

//     } catch (error) {
//         console.log('Get ServiceUID_Service Error :', error);
//         return false
//     }
// }

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};

export async function Load_ServiceEntry_Service(dateRange, selectedFilter) {
    // console.log('dateRange', dateRange)
    try {
        const url_SericeReport = BASE_URL + '/service/load';
        const result0 = await POST_Api(url_SericeReport, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
                Move_To: selectedFilter
            }
        );

        // console.log('1. Load Service ... :', result0);
        return result0;

    } catch (error) {
        console.log('Load Service Error :', error);
        return false
    }
}

export async function Load_ServiceByEngineer_Service(dateRange, Assign_Engineer, selectedFilter) {
    // console.log('dateRange', dateRange)
    try {
        const url_SericeReport = BASE_URL + '/service/loadByEngineer';
        const result0 = await POST_Api(url_SericeReport, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
                Assign_Engineer: Assign_Engineer,
                Move_To: selectedFilter
            }
        );

        // console.log('1. Load Service ... :', result0);
        return result0;

    } catch (error) {
        console.log('Load Service Error :', error);
        return false
    }
}


export async function Save_ServiceData_Service(customerData, serviceData) {
    try {

        const { Cust_id } = customerData;
        // 1. check customer is already exists ...
        const url_CustomerExists = BASE_URL + `/customer/get_customer/${Cust_id}`;
        const result_0 = await GET_Api(url_CustomerExists, '');
        console.log('0. check customer is already exists :', result_0);

        if (result_0 === null) {

            // 2. Insert Customer data ...
            const url_Insert_Customer = BASE_URL + `/customer/insert`;
            const result1 = await POST_Api(url_Insert_Customer, '', customerData);
            console.log('1. Insert CustomerData_Service...', result1);

        }

        // 3. Insert Service Data ...
        const url_Insert_Service = BASE_URL + `/service/insert`;
        const result2 = await POST_Api(url_Insert_Service, '', serviceData);
        console.log('2. Insert ServiceData_Service...', result2);

        return true;


    } catch (error) {
        console.log('Save ServiceData Service Error :', error);
        return false
    }
}

export async function Update_ServiceData_Service(customerData, serviceData) {
    try {

        // 1. Update Customer data ...
        const url_Update_Customer = BASE_URL + `/customer/update/${customerData.Cust_id}`;
        const result3 = await POST_Api(url_Update_Customer, '', customerData);
        console.log('1. Update CustomerData_Service...', result3);

        // 2. Update Service Data ...
        const url_Update_Service = BASE_URL + `/service/update/${serviceData.Serv_id}`;
        const result4 = await POST_Api(url_Update_Service, '', serviceData);
        console.log('2. Update ServiceData_Service...', result4);

        return true;


    } catch (error) {
        console.log('Update ServiceData Service Error :', error);
        return false
    }
}


export async function Get_CustomerData_Service(cust_id) {
    try {
        const url_Get_CustomerData = BASE_URL + `/customer/get_customer/${cust_id}`;
        const result5 = await GET_Api(url_Get_CustomerData, '');
        console.log('2. Get CustomerData Service... :', result5);
        return result5[0];
    } catch (error) {
        console.log('Get CustomerData Service Error :', error);
        return false
    }
}

export async function Get_ServiceData_Service(serv_id) {
    try {
        const url_Get_ServiceData = BASE_URL + `/service/get_service/${serv_id}`;
        const result6 = await GET_Api(url_Get_ServiceData, '');
        console.log('2. Get ServiceData Service... :', result6);
        return result6[0];
    } catch (error) {
        console.log('Get ServiceData Service Error :', error);
        return false
    }
}

export async function Load_Engineers_Service() {
    try {
        const url_Load_Engineer = BASE_URL + `/service/load_engineer`;
        const result7 = await GET_Api(url_Load_Engineer, '');
        console.log('5. Get Load_Engineer Service... :', result7);
        return result7;
    } catch (error) {
        console.log('Load Engineers Service Error :', error);
        return false
    }
}
