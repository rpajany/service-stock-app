import React from 'react';
import { POST_Api, GET_Api, DELETE_Api } from './ApiService';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { toast } from 'react-toastify';

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
    BASE_URL = baseURL;
};

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


export async function Load_RMI_Service(dateRange) {
    try {
        let url_load_RMI = BASE_URL + `/RMI/load`;
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

export async function Get_RMIByID_Service(id) {
    try {
        const url_GetRMI = BASE_URL + `/RMI/get_RMIByid/${id}`;
        const result0 = await GET_Api(url_GetRMI, '');
        console.log('2. Get RMI Service... :', result0);
        return result0;
    } catch (error) {
        console.log('Get RMI Service Error :', error);
        return false
    }
}

export async function Get_RMIStock_ByEngName_Service(Eng_Name) {
    try {
        const url_GetEng_Stock = BASE_URL + `/eng_stockDetail/get_engStock_DetailByEngName/${Eng_Name}`;
        const result0 = await GET_Api(url_GetEng_Stock, '');
        console.log('3. Get RMI Stock_ByEngName Service... :', result0);
        return result0;
    } catch (error) {
        console.log('Get RMI Stock_ByEngName Service Error :', error);
        return false
    }
}

export async function Save_RMI_Service(RMIData) {
    try {
        // 1. Insert RMI data ...
        const url_Insert_RMI = BASE_URL + `/RMI/insert`;
        const result1 = await POST_Api(url_Insert_RMI, '', RMIData);
        console.log('1. Insert RMI_Service...', result1);

        // 2. UpdateStock minus in eng_stockDetail ...
        const updateStock = (RMIData.Issue_Qty - RMIData.RMI_Qty);
        console.log('eng_stockDetail updateStock', updateStock, RMIData.Issue_Qty, RMIData.RMI_Qty)
        const url_eng_stockDetail = BASE_URL + `/eng_stockDetail/updateStock/${RMIData.Part_id}`;
        const result2 = await POST_Api(url_eng_stockDetail, '', { Eng_Name: RMIData.Eng_Name, Issue_Qty: updateStock });
        console.log('2. UpdateStock eng_stockDetail RMI_Service...', result2);

        // 3. get current stock from eng_stock ...
        const url_stock_eng_stock = BASE_URL + `/eng_stock/get_engStockByPart_id/${RMIData.Part_id}`;
        const result3 = await GET_Api(url_stock_eng_stock, '');
        console.log('3. get currentStock from eng_stock RMI_Service...', result3[0])

        // 4. stock minus in eng_stock ...
        const { Issue_Qty, Part_id, Item_Name } = result3[0];
        const newQty = (Issue_Qty - RMIData.RMI_Qty);
        console.log(newQty)

        const url_updateStock_engStock = BASE_URL + `/eng_stock/updateStock/${RMIData.Part_id}`;
        const result4 = await POST_Api(url_updateStock_engStock, '', { Issue_Qty: updateStock });
        console.log('4. UpdateStock eng_stock RMI_Service...', result4);

        toast.success('Save success...!')
        return true;

    } catch (error) {
        console.log('Insert RMI Service Error :', error);
        return false
    }
}

export async function Delete_RMI_Service(row) {

    try {

        const { id, RMI_Qty, Eng_Name, Part_id } = row;

        console.log(row.id)
        // 1. Delete from RMI ...
        const url_Delete_RMI = BASE_URL + `/RMI/delete/${id}`;
        const result1 = await DELETE_Api(url_Delete_RMI, '');
        console.log('1. Deleted RMI Details...', result1);

        // 2. Get stock from Eng_Stock_Details  By Eng_Name & Part_id  ....
        const url_getStock_EngStockDetails = BASE_URL + `/eng_stockDetail/get_stock_ByEngName_Partid/${Part_id}`;
        const result2 = await POST_Api(url_getStock_EngStockDetails, '', { Eng_Name: Eng_Name });
        console.log('2. Get stock EngStockDetails RMI Details...', result2[0]);
        const { Issue_Qty: currentStock } = result2[0];
        const updated_stock = currentStock + RMI_Qty;
        console.log('updated_stock', updated_stock)


        // 3. Update stock By Eng_Name & Part_id in Eng_Stock_Details ....
        const url_UpdateStock_EngStockDetail = BASE_URL + `/eng_stockDetail/updateStock/${Part_id}`;
        const result3 = await POST_Api(url_UpdateStock_EngStockDetail, '', { Issue_Qty: updated_stock, Eng_Name: Eng_Name });
        console.log('3. Update Stock EngStockDetail RMI Details...', result3);

        // 4. Get stock By Part_id in Eng_Stock ....
        const url_getStock_EngStock = BASE_URL + `/eng_stock/get_engStockByPart_id/${Part_id}`;
        const result4 = await GET_Api(url_getStock_EngStock, '');
        console.log('4. Get stock EngStock RMI Details...', result4[0]);
        const { Issue_Qty: oldStock } = result4[0];
        const new_stock = oldStock + RMI_Qty;
        console.log('new_stock', new_stock)

        // 5. Update stock By Part_id in Eng_Stock ....
        const url_UpdateStock_EngStock = BASE_URL + `/eng_stock/updateStock/${Part_id}`;
        const result5 = await POST_Api(url_UpdateStock_EngStock, '', { Issue_Qty: new_stock });
        console.log('5. Update Stock EngStockDetail RMI Details...', result5);

        toast.success('Delete success...!');
        return true;

    } catch (error) {
        console.log('Delete RMI Service Error :', error);
        return false
    }
}

