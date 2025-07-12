import React from 'react';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};

export async function load_Stock_Service() {
    try {
        const url_stockItem_master = BASE_URL + '/item_master/load';
        const data0 = await GET_Api(url_stockItem_master, '');
        // console.log('1. Load Stock Service :', data0);
        return data0
    } catch (error) {
        console.log(' Load Stock Service Error :', error);
        return false;
    }
}

export async function load_StockDetailByPartNumber_Service(PartNumber) {
    try {
        const url_stock_ByPartNumber = BASE_URL + `/stockDetail_report/stockDetail_ByPartNumber/${PartNumber}`;
        const data1 = await GET_Api(url_stock_ByPartNumber, '');
        // console.log('2. Stock By PartNUmber Service :', data1);
        return data1
    } catch (error) {
        console.log('Stock By PartNUmber Service Error :', error);
        return false;
    }
}

export async function load_StockSummary_Service(dateRange) {
    console.log('dateRange', dateRange)
    try {
        const url_stockSummary = BASE_URL + '/stockDetail_report/load';
        const data2 = await POST_Api(url_stockSummary, '', {
            StartDate: dateRange.startDate ? dateRange.startDate : '',
            EndDate: dateRange.endDate ? dateRange.endDate : '',
        }
        );

        console.log('3. StockSummary_ :', data2);
        return data2
    } catch (error) {
        console.log('load StockSummary Service Error :', error);
        return false;
    }
}