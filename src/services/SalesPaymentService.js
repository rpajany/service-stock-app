import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};


export async function Load_SalesPayment_Service(dateRange) {
    try {
        let url_load_RMI = BASE_URL + `/sales_payment/load`;
        const result0 = await POST_Api(url_load_RMI, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
        );

        // console.log('1. Load RMI Service... :', result0);
        return result0;

    } catch (error) {
        console.log('Load RMI Service Error :', error);
        return false
    }
}

export async function Get_SalesDetail_Service(Invoice_Number) {
    console.log(Invoice_Number)
    try {
        let url_salesDetail = BASE_URL + `/sales_detail/get_salesDetail/${Invoice_Number}`;
        const result0 = await GET_Api(url_salesDetail, '');
        // console.log('1. Get_SalesDetail_Service... :', result0);
        return result0;
    } catch (error) {
        console.log('Get_SalesDetail_Service Error :', error);
        return false
    }
}

export async function Get_SalesPay_Service(Invoice_Number) {
    console.log(Invoice_Number)
    try {
        let url_salesPayment = BASE_URL + `/sales_payment/get_salesPayment/${Invoice_Number}`;
        const result1 = await GET_Api(url_salesPayment, '');
        console.log('2. Get_SalesPay_Service ... :', result1);
        return result1;
    } catch (error) {
        console.log('Get_SalesPay_Service Error :', error);
        return false
    }

}


export async function Save_SalesPay_Service(salesPayData) {
    try {
        const url_SalesPay = BASE_URL + `/sales_payment/insert`;
        const result2 = await POST_Api(url_SalesPay, '', salesPayData);
        console.log('3. Save SalesPay Service - Insert :', result2);


        // update SalesDetails  (Amount_Paid,Balance_Amount,Pay_Status)
        const url_Update_SalesDetails = BASE_URL + `/sales_detail/update/${salesPayData.Invoice_Number}`;

        let total_AmountPaid = parseFloat(salesPayData.Amount_Paid) + parseFloat(salesPayData.Amount_Recived)
        let balanceAmount = parseFloat(salesPayData.Invoice_Amount) - parseFloat(total_AmountPaid);

        const result3 = await POST_Api(url_Update_SalesDetails, '', {
            Amount_Paid: total_AmountPaid,
            Balance_Amount: balanceAmount,
            Pay_Status: salesPayData.Pay_Status,
        });
        console.log('4. Update_SalesDetails Service :', result3);


        return true
    } catch (error) {
        console.log('Save_SalesPay_Service Error :', error);
        return false
    }
}