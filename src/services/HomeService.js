import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
// import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { GetBaseURL } from '../helpers/GetBaseURL';
import moment from 'moment';

// const BASE_URL = GetBaseURL();  //Get_BaseUrl();
let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};


export async function Get_TotalExpense_Service(dateRange) {

    console.log('BASE_URL', BASE_URL)
    try {
        const url_expense = BASE_URL + `/expense/Get_TotalExpense`;
        const result0 = await POST_Api(url_expense, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
        );

        // console.log('1. Get_TotalExpense_Service... :', result0);
        return result0;

    } catch (error) {
        console.log('Get_TotalExpense_Service Error :', error);
        return false
    }
}

export async function Get_TotalSales_Service(dateRange) {
    try {
        const url_expense = BASE_URL + `/sales_detail/Get_TotalSales`;
        const result1 = await POST_Api(url_expense, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
        );

        // console.log('2. Get_TotalSales_Service... :', result1);
        return result1;

    } catch (error) {
        console.log('Get_TotalExpense_Service Error :', error);
        return false
    }
}

export async function Get_TotalPurchase_Service(dateRange) {
    try {
        const url_expense = BASE_URL + `/purchase_detail/Get_TotalPurchase`;
        const result2 = await POST_Api(url_expense, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
        );

        // console.log('3. Get_TotalPurchase_Service... :', result2);
        return result2;

    } catch (error) {
        console.log('Get_TotalPurchase_Service Error :', error);
        return false
    }
}

export async function Get_Purchase_MonthWiseData_Service() {
    const Year = moment().format('YYYY');
    // console.log('Year', Year)
    try {
        const url_PurchaseData = BASE_URL + `/purchase_detail/Get_MonthWiseData/${Year}`;
        const result3 = await GET_Api(url_PurchaseData, '');
        // console.log('4. Get_Purchase_MonthWiseData_Service... :', result3);
        return result3;
    } catch (error) {
        console.log('Get_Purchase_MonthWiseData Error :', error);
        return false
    }
}

export async function Get_Expense_MonthWiseData_Service() {
    const Year = moment().format('YYYY');
    // console.log('Year', Year)
    try {
        const url_ExpenseData = BASE_URL + `/expense/Get_MonthWiseData/${Year}`;
        const result4 = await GET_Api(url_ExpenseData, '');
        // console.log('4. Get_Expense_MonthWiseData_Service... :', result4);
        return result4;
    } catch (error) {
        console.log('Get_Expense_MonthWiseData Error :', error);
        return false
    }
}

export async function Get_Sales_MonthWiseData_Service() {
    const Year = moment().format('YYYY');
    // console.log('Year', Year)
    try {
        const url_SalesData = BASE_URL + `/sales_detail/Get_MonthWiseData/${Year}`;
        const result5 = await GET_Api(url_SalesData, '');
        // console.log('5. Get_Sales_MonthWiseData_Service... :', result4);
        return result5;
    } catch (error) {
        console.log('Get_Sales_MonthWiseData Error :', error);
        return false
    }
}