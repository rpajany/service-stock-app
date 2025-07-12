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

export async function Load_Quote_Service(dateRange) {
    console.log('dateRange', dateRange)
    try {
        const url_purchaseReport = BASE_URL + '/quotation_detail/load';
        const result0 = await POST_Api(url_purchaseReport, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
        );

        console.log('1. Load Quote Service... :', result0);
        return result0;

    } catch (error) {
        console.log('Load Quote Service Error :', error);
        return false
    }
}

export async function Get_QuoteTerms_Service() {
    try {
        const url_quoteTerms = BASE_URL + `/quote_terms/load`;
        const result_quoteTerms = await GET_Api(url_quoteTerms, '');
        // console.log('1. GET QuoteTerms_Service :', result_quoteTerms);

        return result_quoteTerms;

    } catch (error) {
        console.log('Get_QuoteTerms_Service Error :', error);
        return false;
    }
}

export async function SaveQuote_Service(quoteDetails, tableData) {
    try {
        const url_quoteDetails = BASE_URL + `/quotation_detail/insert`;
        const result1 = await POST_Api(url_quoteDetails, '', quoteDetails);
        console.log('1. Quotation_detail Service - Insert :', result1);


        // Loop to save & update modified items data  
        const url_quoteData = BASE_URL + `/quotation/insert`;
        for (const item of tableData) {
            const result2 = await POST_Api(url_quoteData, '', item);
            console.log('2. Quotation_Data Service - Insert :', result2);
        }

        toast.success('Save success...!');

        return true

    } catch (error) {
        console.log('SaveQuote_Service Error :', error);
        return false
    }
}

export async function UpdateQuote_Service() {


}

export async function DeleteQuote_Service(row) {
    const quotNumber = row.Quot_Number;
    try {
        // 1. delete QuoteDetails by Quot_Number
        const url_deleteQuoteDetails = BASE_URL + `/quotation_detail/delete/${quotNumber}`;
        const res_1 = await DELETE_Api(url_deleteQuoteDetails, '');
        console.log('1. Deleted Quote Details...', res_1);

        // 2. delete QuoteData by Quot_Num const url_deleteQuoteDetails = BASE_URL + `/quotation_detail/delete/${quotNumber}`;
        const url_deleteQuoteData = BASE_URL + `/quotation/delete/${quotNumber}`;
        const res_2 = await DELETE_Api(url_deleteQuoteData, '');
        console.log('2. Deleted Quote Data...', res_2);

        toast.success('Delete success...!');

        return true

    } catch (error) {
        console.log('DeleteQuote_Service Error :', error);
        return false
    }
}

export async function Update_QuoteStatus_Service(statusData) {
    try {
        const url_UpdateQuoteStatus = BASE_URL + `/quotation_detail/updateStatus/${statusData.Quot_Number}`;
        const res_3 = await POST_Api(url_UpdateQuoteStatus, '', { Status: statusData.Status });
        console.log('3. Update Quote Status...', res_3);

        // toast.success('Update Quote Status success...!');

        return true
    } catch (error) {
        console.log('Update Quote Status Service Error :', error);
        return false
    }
}