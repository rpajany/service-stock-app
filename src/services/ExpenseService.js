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


export async function Load_Expense_Service(dateRange) {
    // console.log(dateRange)
    // const StartDate = dateRange.startDate;
    // const EndDate = dateRange.endDate;
    try {
        // let url_loadExpense = BASE_URL + `/expense/load/?StartDate=${encodeURIComponent(StartDate)}&EndDate=${encodeURIComponent(EndDate)}`;
        // if (dateRange) {
        let url_loadExpense = BASE_URL + `/expense/load`;
        // } else {
        //     url_loadExpense = BASE_URL + `/expense/load`;
        // }

        // const result0 = await GET_Api(url_loadExpense, '', {
        //     params: {
        //         StartDate: dateRange.startDate,
        //         EndDate: dateRange.endDate,
        //     }
        // });



        const result0 = await POST_Api(url_loadExpense, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
        );

        // console.log('1. Load Expense Service... :', result0);
        return result0;
    } catch (error) {
        console.log('Load Expense Service Error :', error);
        return false
    }
}








export async function SaveExpense_Service(expenseData) {
    console.log('expenseData Service', expenseData)
    try {
        const url_SaveExpense = BASE_URL + `/expense/insert`;
        const result1 = await POST_Api(url_SaveExpense, '', expenseData);
        console.log('1. Save Expense Service... :', result1);

        toast.success('Save success...!')
        return true;
    } catch (error) {
        console.log('Save Expense_Service Error :', error);
        return false
    }
}

export async function UpdateExpense_Service(id, expenseData) {
    // console.log('id', id)
    // console.log('expenseData', expenseData)
    try {
        const url_updateExpense = BASE_URL + `/expense/update/${id}`;
        const result2 = await POST_Api(url_updateExpense, '', expenseData);
        console.log(' Update Expense Service... :', result2);

        toast.success('Update success...!')
        return true;
    } catch (error) {
        console.log('Update Expense_Service Error :', error);
        return false
    }
}

export async function DeleteExpense_Service(id) {
    try {
        const url_deleteExpense = BASE_URL + `/expense/delete/${id}`;
        const res_1 = await DELETE_Api(url_deleteExpense, '');
        console.log('1. Deleted Expense Details...', res_1);

        toast.success('Delete success...!');
        return true;
    } catch (error) {
        console.log('Delete Expense_Service Error :', error);
        return false
    }
}