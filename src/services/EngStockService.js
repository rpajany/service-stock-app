import React from 'react';
import { POST_Api, GET_Api, DELETE_Api } from './ApiService';
// import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { toast } from 'react-toastify';


// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};

 

export async function Load_EngStock_Service(dateRange) {
    // console.log(dateRange)
    try {
        let url_loadEngStock = BASE_URL + `/eng_stock/load`;

        const result0 = await POST_Api(url_loadEngStock, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
        );

        console.log('1. Load EngStock Service... :', result0);
        return result0;

    } catch (error) {
        console.log('Load EngStock Service Error :', error);
        return false
    }
}

export async function Load_StockByEngName_Service(dateRange) {
    // console.log(dateRange)
    try {
        let url_loadEngStock = BASE_URL + `/eng_stockDetail/load`;

        const result0 = await POST_Api(url_loadEngStock, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
        );

        console.log('2. Load Stock By Eng_Name Service... :', result0);
        return result0;

    } catch (error) {
        console.log('Load Stock By Eng_Name  Service Error :', error);
        return false
    }
}



export async function Get_EngStock_Service(id) {
    try {
        const url_GetEngStock = BASE_URL + `/eng_stock/get_engStockByid/${id}`;
        const result0 = await GET_Api(url_GetEngStock, '');
        console.log('2. Get EngStock Service... :', result0);
        return result0;
    } catch (error) {
        console.log('Get EngStock Service Error :', error);
        return false
    }
}

export async function Save_EngStock_Service(engStockData) {
    // console.log('engStockData Service', engStockData)
    try {

        // 1. check Item part_id already exist Eng_Stock table ...
        const url_CheckPartExist = BASE_URL + `/eng_stock/get_engStockByPart_id/${engStockData.Part_id}`;
        const rows = await GET_Api(url_CheckPartExist, '');
        console.log('1. CheckPart Exist Service... :', rows);



        if (rows.length >= 1) {
            // get stock from Eng_Stock ...
            const { Issue_Qty: stockQty } = rows[0];
            const updateQty = (stockQty + engStockData.Issue_Qty)

            // 2. update the existing item in engStock ...
            const url_UpdateEngStock = BASE_URL + `/eng_stock/updateStock/${engStockData.Part_id}`;
            const result1 = await POST_Api(url_UpdateEngStock, '', { Issue_Qty: updateQty });
            console.log('2. Update ByPart_id Service... :', result1);

        } else if (rows.length <= 0) {

            // 3. save the items as new item in engStock ...
            const url_InsertEngStock = BASE_URL + `/eng_stock/insert`;
            const result1 = await POST_Api(url_InsertEngStock, '', engStockData);
            console.log('2. insert EngStock Service... :', result1);
        }

        // check part exist in tbl_EngStock_Details
        const url_EngStock_Detail_CheckPartExist = BASE_URL + `/eng_stockDetail/checkPart_exist`;
        const rows1 = await POST_Api(url_EngStock_Detail_CheckPartExist, '', { Part_id: engStockData.Part_id, Eng_Name: engStockData.Eng_Name });
        console.log('3. CheckPart Exist in EngStock_Details Service... :', rows1);



        if (rows1.length >= 1) {
            // get stock from Eng_Stock ...
            const { Issue_Qty: stockQty } = rows1[0];
            const updateQty = (stockQty + engStockData.Issue_Qty)

            // 1. update the existing item in engStock_Details by Part_id & Eng_Name ...
            const url_UpdateEngStockDetail = BASE_URL + `/eng_stockDetail/updateStock/${engStockData.Part_id}`;
            const result1 = await POST_Api(url_UpdateEngStockDetail, '', { Issue_Qty: updateQty, Eng_Name: engStockData.Eng_Name });
            console.log('4. Update EngStock_DetailsByPart_id Service... :', result1);
        } else if (rows1.length <= 0) {
            // save as new item on Eng_Name
            // 2. Insert to tbl_EngStock_Details ...
            const url_InsertEngStock_Detail = BASE_URL + `/eng_stockDetail/insert`;
            const result1 = await POST_Api(url_InsertEngStock_Detail, '', engStockData);
            console.log('4. insert EngStock_Detail Service... :', result1);
        }




        // 5. Get current stock by Part_id from ItemMaster ...
        const url_getStock = BASE_URL + `/item_master/get_item/${engStockData.Part_id}`;
        const outputRes = await GET_Api(url_getStock, '');
        console.log('5. get current stock by Part_id...', outputRes);
        const { Stock_Qty } = outputRes[0];
        let current_stock = Stock_Qty;
        let updated_stock = current_stock - engStockData.Issue_Qty; // sales add old item qty to stock
        console.log('stock Minus = current_stock/old_qty', current_stock, engStockData.Issue_Qty)




        // 6. update minus stock to ItemMaster ...
        const url_updateToStock = BASE_URL + `/item_master/update/${engStockData.Part_id}`
        const updateStock = await POST_Api(url_updateToStock, '', { Stock_Qty: updated_stock });
        if (updateStock) {
            console.log('6. update minus issue qty from itemMaster...')
        }

        // 7. StockDetail_Report ReviseStockDeleted API request
        const url_StockDetail_Report = BASE_URL + '/stockDetail_report/insert';
        const StockDetail_result = await POST_Api(url_StockDetail_Report, '', {

            Type: 'Eng_StockIssue',
            Invoice_Number: '',
            Invoice_Date: engStockData.Issue_Date,
            Item_Name: engStockData.Item_Name,
            PartNumber: engStockData.PartNumber,
            ModelNumber: engStockData.ModelNumber,
            Stock_Qty: current_stock,
            Transact_Qty: engStockData.Issue_Qty,
            HandStock_Qty: updated_stock,
            Remarks: `Eng_StockIssue - Minus - ${engStockData.Eng_Name}`,

        });
        console.log('7. Eng_StockIssue - Minus - StockDetail_Report Insert :', StockDetail_result);

        toast.success('Save success...!');
        return true;

    } catch (error) {
        console.log('Save EngStock Service Error :', error);
        return false
    }
}

export async function Update_EngStock_Service(engStockData) {
    try {
        const url_updateEngStock = BASE_URL + `/eng_stock/update/${engStockData.id}`;
        const result2 = await POST_Api(url_updateEngStock, '', engStockData);
        console.log('4. Update EngStock Service... :', result2);

        toast.success('Update success...!')
        return true;

    } catch (error) {
        console.log('Update EngStock Service Error :', error);
        return false
    }
}

export async function Delete_EngStock_Service(row) {
    try {
        const { id, Issue_Qty, Item_Name, Part_id } = row;

        const url_deleteEngStock = BASE_URL + `/eng_stock/delete/${id}`;
        const res_1 = await DELETE_Api(url_deleteEngStock, '');
        console.log('5. Deleted EngStock Details...', res_1);

        toast.success('Delete success...!');
        return true;

    } catch (error) {
        console.log('Delete EngStock Service Error :', error);
        return false
    }
}


export async function Load_EngNames_Service() {
    try {
        let url_load_EngNames = BASE_URL + `/user/loadEng`;
        const result5 = await GET_Api(url_load_EngNames, '')
        // console.log('0. Load EngNames Service... :', result5);
        return result5

    } catch (error) {
        console.log('Load Load_EngNames_Service Error :', error);
        return false
    }
}






