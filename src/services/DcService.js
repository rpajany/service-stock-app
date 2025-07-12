import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { toast } from 'react-toastify';



let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};




export async function Load_DC_Service(dateRange) {
    // console.log('dateRange', dateRange)
    try {
        const url_purchaseReport = BASE_URL + '/dc_detail/load';
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

export async function Save_DC_Service(dcDetails, tableData) {
    try {
        const url_dcDetails = BASE_URL + `/dc_detail/insert`;
        const result1 = await POST_Api(url_dcDetails, '', dcDetails);
        console.log('1. DC_detail Service - Insert :', result1);


        // Loop to save & update modified items data  
        const url_dcData = BASE_URL + `/dc/insert`;
        for (const item of tableData) {
            const result2 = await POST_Api(url_dcData, '', item);
            console.log('2. DC_Data Service - Insert :', result2);
        }

        toast.success('Save success...!');

        return true

    } catch (error) {
        console.log('Save_DC_Service Error :', error);
        return false
    }
}

export async function UpdateQuote_Service() {


}

export async function Delete_DC_Service(row) {
    const dcNumber = row.DC_Number;
    try {
        // 1. delete QuoteDetails by Quot_Number
        const url_deleteDcDetails = BASE_URL + `/dc_detail/delete/${dcNumber}`;
        const res_1 = await DELETE_Api(url_deleteDcDetails, '');
        console.log('1. Deleted DC Details...', res_1);

        // 2. delete QuoteData by Quot_Num const url_deleteQuoteDetails = BASE_URL + `/quotation_detail/delete/${quotNumber}`;
        const url_deleteDcData = BASE_URL + `/dc/delete/${dcNumber}`;
        const res_2 = await DELETE_Api(url_deleteDcData, '');
        console.log('2. Deleted DC Data...', res_2);

        toast.success('Delete success...!');

        return true

    } catch (error) {
        console.log('Delete_DC_Service Error :', error);
        return false
    }
}

export async function Update_DCstatus_Service(statusData) {
    try {
        const url_Update_DCStatus = BASE_URL + `/dc_detail/updateStatus/${statusData.DC_Number}`;
        const res_3 = await POST_Api(url_Update_DCStatus, '', { Status: statusData.Status });
        console.log('3. Update DC Status...', res_3);

        // toast.success('Update Quote Status success...!');

        return true
    } catch (error) {
        console.log('Update DC Status Service Error :', error);
        return false
    }
}