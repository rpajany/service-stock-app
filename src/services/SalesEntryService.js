import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};


export async function Load_SalesDetails_Service(dateRange) {
    // console.log('dateRange', dateRange)
    console.log('BASE_URL', BASE_URL)
    try {
        const url_SalesReport = BASE_URL + '/sales_detail/load';
        const result0 = await POST_Api(url_SalesReport, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
        );

        console.log('1. Load SalesDetails Service... :', result0);
        return result0;

    } catch (error) {
        console.log('Load SalesDetails Service Error :', error);
        return false
    }
}


export async function SalesUpdate_Service(salesDetails, Edit_DataArray, salesList) {
    console.log('Edit_DataArray', Edit_DataArray)
    console.log('salesList', salesList)

    for (const item of Edit_DataArray) {

        try {
            let old_qty = item.Qty;
            let part_id = item.Part_id;

            // get current stock by Part_id
            const url_getStock = BASE_URL + `/item_master/get_item/${part_id}`
            const outputRes = await GET_Api(url_getStock, '');
            const { ModelNumber, Stock_Qty } = outputRes[0];
            let current_stock = Stock_Qty;
            let updated_stock = current_stock + old_qty; // sales add to stock

            console.log('current_stock, old_qty', current_stock, old_qty)

            // add delete stock to itemMaster
            const url_updateToStock = BASE_URL + `/item_master/update/${part_id}`
            const addStock = await POST_Api(url_updateToStock, '', { Stock_Qty: updated_stock });
            if (addStock) {
                console.log('old_stock Added ...')
            }

            // StockDetail_Report ReviseStockDeleted API request
            const url_StockDetail_Report = BASE_URL + '/stockDetail_report/insert';
            const result1 = await POST_Api(url_StockDetail_Report, '', {

                Type: 'Sales',
                Invoice_Number: salesDetails.Invoice_Number,
                Invoice_Date: salesDetails.Invoice_Date,
                Item_Name: item.Item_Name,
                PartNumber: item.PartNumber,
                ModelNumber: ModelNumber,
                Stock_Qty: current_stock,
                Transact_Qty: old_qty,
                HandStock_Qty: updated_stock,
                Remarks: 'Purchase Add - ReviseStock on Edit',
            });
            console.log('ReviseStockDeleted - StockDetail_Report Insert :', result1);


        } catch (error) {
            console.log('1st For Loop', error)
        } // end of 1st For Loop rowEditDataArray



        // 8. delete SalsePayments  by Invoice_Number ...
        const url_SalesPayment = BASE_URL + `/sales_payment/delete/${salesDetails.Invoice_Number}`;
        try {
            const res_3 = await DELETE_Api(url_SalesPayment, '');
            console.log('8. Deleted All Sales Payments...', res_3);

        } catch (error) {
            console.error('Error deleting Sales Payments:', error);
        }

        // delete SalesDetails by Invoice_Number
        const url_deleteSalesDetails = BASE_URL + `/sales_detail/delete/${salesDetails.Invoice_Number}`
        try {
            const res_0 = await DELETE_Api(url_deleteSalesDetails, '');
            console.log('Deleted Sales Details...', res_0);

        } catch (error) {
            console.error('Error deleting Sales Details:', error);
        }

        // delete all Sales items by Invoice_Number
        const url_deleteSales = BASE_URL + `/sales/delete/${salesDetails.Invoice_Number}`;
        try {
            const res_1 = await DELETE_Api(url_deleteSales, '');
            console.log('Deleted All Sales Items...', res_1);

        } catch (error) {
            console.error('Error deleting Sales Items:', error);
        }

        // delete all StockDetail report items by Invoice_Number
        const url_deleteStockDetail = BASE_URL + `/stockDetail_report/delete/${salesDetails.Invoice_Number}`
        // await DELETE_Api(url_deleteStockDetail, '').then((res_3) => {
        //     console.log('Deleted All Stock Detail Report Items...', res_3);
        // })




        // sale payment insert
        const url_SalesPay = BASE_URL + `/sales_payment/insert`;
        const result2 = await POST_Api(url_SalesPay, '', {
            Invoice_Number: salesDetails.Invoice_Number,
            Invoice_Date: salesDetails.Invoice_Date,
            Customer_Name: salesDetails.Customer_Name,
            Amount_Recived: salesDetails.Amount_Paid,
            Balance_Amount: salesDetails.Balance_Amount,
            Pay_Mode: salesDetails.Pay_Mode,
            Pay_Note: salesDetails.Pay_Note,
            Pay_Date: salesDetails.Invoice_Date,
            Pay_Status: salesDetails.Pay_Status
        });
        console.log('3. Save SalesPayment - Insert :', result2);

        // Save Sales Details
        const url = BASE_URL + `/sales_detail/insert`;
        try {
            const res_2 = await POST_Api(url, '', salesDetails);
            console.log('Save Sales Details :', res_2);
        } catch (error) {
            console.error('Error inserting Sales Details:', error);
        }







        // save & update modified items data in loop ...
        // Loop to save & update modified items data  
        for (const itemX of salesList) {
            try {
                console.log('Processing item in salesList:', itemX);

                const part_id = itemX.Part_id;
                const qty_StockMinus = itemX.Qty;
                // const itemName = item.Item_Name;

                // 2nd get current stock API request, 
                const url_getItem = BASE_URL + `/item_master/get_item/${part_id}`;
                const output = await GET_Api(url_getItem, ' ');
                const { ModelNumber: modelNumber, Stock_Qty: stockQty } = output[0];
                // console.log('output', output)
                // console.log('Item_Name', Item_Name)
                console.log('Stock_Qty', stockQty)
                let Stock_Qty = stockQty;
                let ModelNumber = modelNumber;
                // stock add ...
                let hand_StockQty = (Stock_Qty - qty_StockMinus); // Minus modified qty to stock

                // 3rd update Stock API request,
                const url_updateStock = BASE_URL + `/item_master/update/${part_id}`;
                const res_3 = await POST_Api(url_updateStock, '', { Stock_Qty: hand_StockQty });
                console.log('update Stock :', res_3);

                // 4th StockDetail_Report API request
                const url_StockDetail_Report = BASE_URL + '/stockDetail_report/insert';
                const res_4 = await POST_Api(url_StockDetail_Report, '', {

                    Type: 'Sales',
                    Invoice_Number: salesDetails.Invoice_Number,
                    Invoice_Date: salesDetails.Invoice_Date,
                    Item_Name: itemX.Item_Name,
                    PartNumber: itemX.PartNumber,
                    ModelNumber: ModelNumber,
                    Stock_Qty: Stock_Qty,
                    Transact_Qty: itemX.Qty,
                    HandStock_Qty: hand_StockQty,
                    Remarks: 'Sales Minus- UpdateStock on (Edit/update)',

                });
                console.log('StockDetail_Report Insert :', res_4);

                // 5th API: Insert into Purchase item
                const url2 = BASE_URL + '/sales/insert';
                const res_5 = await POST_Api(url2, '', { ...itemX, Invoice_Date: salesDetails.Invoice_Date });
                console.log('Purchase item Insert:', res_5);


                //  return true; // return to clear forms

            } catch (error) {
                console.error('Error processing item:', itemX, error);
            }

        }

        return true; // return to clear forms

    }

} // End Update function ....

export async function SalesDelete_Service(rowDelete) {
    // console.log('rowDelete', rowDelete);
    let invoiceNumber = rowDelete.Invoice_Number;
    console.log('invoiceNumber', invoiceNumber);

    // 1. get old Sales items  ...
    const url_getSales = BASE_URL + `/sales/get_sales/${invoiceNumber}`;
    const result_Data = await GET_Api(url_getSales, '');
    console.log('1. get old Sales items...', result_Data);

    // 2. StockDetail_Report ReviseStockDeleted API request
    const url_delete_StockDetail = BASE_URL + `/stockDetail_report/delete/${invoiceNumber}`;
    try {
        // const res_1 = await DELETE_Api(url_delete_StockDetail, '')
        // console.log('2. Delete old purchase items from StockDetail_Report...', res_1);
    } catch (error) {
        console.log(error);
    }

    for (const item of result_Data) {
        console.log('item', item);
        try {
            let old_qty = item.Qty;
            let part_id = item.Part_id;

            // 3. get current stock by Part_id
            const url_getStock = BASE_URL + `/item_master/get_item/${part_id}`
            const outputRes = await GET_Api(url_getStock, '');
            console.log('3. get current stock by Part_id...', outputRes);
            const { ModelNumber, Stock_Qty } = outputRes[0];
            let current_stock = Stock_Qty;
            let updated_stock = current_stock + old_qty; // sales add old item qty to stock
            console.log('stock add = current_stock/old_qty', current_stock, old_qty)

            // 4. update add stock to itemMaster
            const url_updateToStock = BASE_URL + `/item_master/update/${part_id}`
            const delStock = await POST_Api(url_updateToStock, '', { Stock_Qty: updated_stock });
            if (delStock) {
                console.log('4. update add old stock to itemMaster...')
            }

            // 5. StockDetail_Report ReviseStockDeleted API request
            const url_StockDetail_Report = BASE_URL + '/stockDetail_report/insert';
            const result1 = await POST_Api(url_StockDetail_Report, '', {

                Type: 'Sales',
                Invoice_Number: rowDelete.Invoice_Number,
                Invoice_Date: rowDelete.Invoice_Date,
                Item_Name: item.Item_Name,
                PartNumber: item.PartNumber,
                ModelNumber: ModelNumber,
                Stock_Qty: current_stock,
                Transact_Qty: old_qty,
                HandStock_Qty: updated_stock,
                Remarks: 'Sales Deleted - Add - ReviseStock',

            });
            console.log('5. Deleted _ReviseStock - StockDetail_Report Insert :', result1);


        } catch (error) {

        }
    } // End of 1st For loop Purchase Items


    // 6. delete PurchaseDetails by Invoice_Number
    const url_deleteSalesDetails = BASE_URL + `/sales_detail/delete/${invoiceNumber}`;
    try {
        const res_2 = await DELETE_Api(url_deleteSalesDetails, '');
        console.log('6. Deleted Sales Details...', res_2);

    } catch (error) {
        console.error('Error deleting Sales Details:', error);
    }

    // 7. delete all purchase items by Invoice_Number
    const url_deleteSales = BASE_URL + `/sales/delete/${invoiceNumber}`;
    try {
        const res_3 = await DELETE_Api(url_deleteSales, '');
        console.log('7. Deleted All Sales Items...', res_3);

    } catch (error) {
        console.error('Error deleting Sales Items:', error);
    }

    // 8. delete SalsePayments  by Invoice_Number ...
    const url_SalesPayment = BASE_URL + `/sales_payment/delete/${invoiceNumber}`;
    try {
        const res_3 = await DELETE_Api(url_SalesPayment, '');
        console.log('8. Deleted All Sales Payments...', res_3);

    } catch (error) {
        console.error('Error deleting Sales Payments:', error);
    }

    return true; // return to clear forms
}


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
