import React from 'react'
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { toast } from 'react-toastify';

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// Hook to manage the BASE_URL
export const useBaseUrl = (baseURL) => {
  BASE_URL = baseURL;
};

export async function Load_PurchaseDetails_Service(dateRange) {
  console.log('dateRange', dateRange)
  try {
    const url_purchaseReport = BASE_URL + '/purchase_detail/load';
    const result0 = await POST_Api(url_purchaseReport, '',
      {
        StartDate: dateRange.startDate ? dateRange.startDate : '',
        EndDate: dateRange.endDate ? dateRange.endDate : '',
      }
    );

    console.log('1. Load PurchaseDetails Service... :', result0);
    return result0;

  } catch (error) {
    console.log('Load PurchaseDetails Service Error :', error);
    return false
  }
}




export async function PurchaseUpdate_Service(purchaseDetails, rowEditDataArray, purchaseList) {
  // export const useTitle = async (purchaseDetails, rowEditDataArray, purchaseList) => {
  // export const PurchaseEntryService = async ({purchaseDetails, rowEditDataArray, purchaseList}) => {
  console.log('DataArray', rowEditDataArray)
  console.log('purchaseList', purchaseList)

  let invoiceNumber = purchaseDetails.Invoice_Number;
  const param = invoiceNumber; // "BIOS/2556/24-25" new code added
  const encoded_Invoice_Number = encodeURIComponent(param); //  new code added

  // rowEditDataArray.map(async (item) => {
  for (const item of rowEditDataArray) {
    try {
      console.log('rowEditDataArray', item);

      let old_qty = item.Qty;
      let part_id = item.Part_id;



      // get current stock by Part_id
      const url_getStock = BASE_URL + `/item_master/get_item/${part_id}`
      const outputRes = await GET_Api(url_getStock, '');
      const { ModelNumber, Stock_Qty } = outputRes[0];
      let current_stock = Stock_Qty;
      let updated_stock = current_stock - old_qty; // purchase minus from stock

      console.log('current_stock, old_qty', current_stock, old_qty)

      // add delete stock to itemMaster
      const url_updateToStock = BASE_URL + `/item_master/update/${part_id}`
      const delStock = await POST_Api(url_updateToStock, '', { Stock_Qty: updated_stock });
      if (delStock) {
        console.log('old_stock minusd ...')
      }

      // StockDetail_Report ReviseStockDeleted API request
      const url_StockDetail_Report = BASE_URL + '/stockDetail_report/insert';
      const result1 = await POST_Api(url_StockDetail_Report, '', {

        Type: 'Purchase',
        Invoice_Number: purchaseDetails.Invoice_Number,
        Invoice_Date: purchaseDetails.Invoice_Date,
        Item_Name: item.Item_Name,
        PartNumber: item.PartNumber,
        ModelNumber: ModelNumber,
        Stock_Qty: current_stock,
        Transact_Qty: old_qty,
        HandStock_Qty: updated_stock,
        Remarks: 'Purchase Minus - ReviseStock on Edit',

      });
      console.log('ReviseStockDeleted - StockDetail_Report Insert :', result1);


    } catch (error) {
      console.log('1st For Loop', error)
    }
  } // end of 1st For Loop rowEditDataArray

  // delete PurchaseDetails by Invoice_Number


  const url_deletePurchaseDetails = BASE_URL + `/purchase_detail/delete/${encoded_Invoice_Number}`
  try {
    const res_0 = await DELETE_Api(url_deletePurchaseDetails, '');
    console.log('Deleted Purchase Details...', res_0);

  } catch (error) {
    console.error('Error deleting Purchase Details:', error);
  }


  // delete all purchase items by Invoice_Number
  const url_deletePurchase = BASE_URL + `/purchase/delete/${encoded_Invoice_Number}`;
  try {
    const res_1 = await DELETE_Api(url_deletePurchase, '');
    console.log('Deleted All Purchase Items...', res_1);

  } catch (error) {
    console.error('Error deleting Purchase Items:', error);
  }


  // delete all StockDetail report items by Invoice_Number
  const url_deleteStockDetail = BASE_URL + `/stockDetail_report/delete/${encoded_Invoice_Number}`
  // await DELETE_Api(url_deleteStockDetail, '').then((res_3) => {
  //     console.log('Deleted All Stock Detail Report Items...', res_3);
  // })


  // Save Purchase Details
  const url = BASE_URL + `/purchase_detail/insert`;
  try {
    const res_2 = await POST_Api(url, '', purchaseDetails);
    console.log('Save Purchase Details :', res_2);
  } catch (error) {
    console.error('Error inserting Purchase Details:', error);
  }

  // save & update modified items data in loop ...
  // Loop to save & update modified items data
  // purchaseList.forEach(async (itemX) => {
  for (const itemX of purchaseList) {
    try {
      console.log('Processing item in purchaseList:', itemX);

      const part_id = itemX.Part_id;
      const qty_StockAdd = itemX.Qty;
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
      let hand_StockQty = (Stock_Qty + qty_StockAdd); // add modified qty to stock

      // 3rd update Stock API request,
      const url_updateStock = BASE_URL + `/item_master/update/${part_id}`;
      const res_3 = await POST_Api(url_updateStock, '', { Stock_Qty: hand_StockQty });
      console.log('update Stock :', res_3);

      // 4th StockDetail_Report API request
      const url_StockDetail_Report = BASE_URL + '/stockDetail_report/insert';
      const res_4 = await POST_Api(url_StockDetail_Report, '', {

        Type: 'Purchase',
        Invoice_Number: purchaseDetails.Invoice_Number,
        Invoice_Date: purchaseDetails.Invoice_Date,
        Item_Name: itemX.Item_Name,
        PartNumber: itemX.PartNumber,
        ModelNumber: ModelNumber,
        Stock_Qty: Stock_Qty,
        Transact_Qty: itemX.Qty,
        HandStock_Qty: hand_StockQty,
        Remarks: 'Purchase Add - UpdateStock on (Edit/update)',

      });
      console.log('StockDetail_Report Insert :', res_4);

      // 5th API: Insert into Purchase item
      const url2 = process.env.REACT_APP_BACKEND_BASE_URL + '/purchase/insert';
      const res_5 = await POST_Api(url2, '', { ...itemX, Invoice_Date: purchaseDetails.Invoice_Date });
      console.log('Purchase item Insert:', res_5);

 

    } catch (error) {
      console.error('Error processing item:', itemX, error);
    }




  } // End if Update function ...


} // End Update function ....


// chatGPT Update code .....
export async function chatGPT_PurchaseUpdate_Service(purchaseDetails, rowEditDataArray, purchaseList) {
  const invoiceNumber = purchaseDetails.Invoice_Number;
  const encodedInvoiceNumber = encodeURIComponent(invoiceNumber);
  if (!invoiceNumber) throw new Error("Invoice Number is missing.");

  console.log("Updating with Invoice Number:", encodedInvoiceNumber);

  // Update stock for existing items
  for (const item of rowEditDataArray) {
    try {
      const { Part_id, Qty, Item_Name, PartNumber } = item;
      if (!Part_id) throw new Error("Part ID is missing in rowEditDataArray item.");

      // Get current stock
      const stockUrl = `${BASE_URL}/item_master/get_item/${Part_id}`;
      const stockData = await GET_Api(stockUrl, "");
      const { Stock_Qty, ModelNumber } = stockData[0] || {};
      const updatedStock = (Stock_Qty || 0) - Qty;

      console.log(`Current stock: ${Stock_Qty}, Old Qty: ${Qty}, Updated Stock: ${updatedStock}`);

      // Update stock in item master
      const updateStockUrl = `${BASE_URL}/item_master/update/${Part_id}`;
      await POST_Api(updateStockUrl, "", { Stock_Qty: updatedStock });

      // Insert stock detail report
      const stockDetailUrl = `${BASE_URL}/stockDetail_report/insert`;
      await POST_Api(stockDetailUrl, "", {
        Type: "Purchase",
        Invoice_Number: invoiceNumber,
        Invoice_Date: purchaseDetails.Invoice_Date,
        Item_Name,
        PartNumber,
        ModelNumber,
        Stock_Qty: Stock_Qty,
        Transact_Qty: Qty,
        HandStock_Qty: updatedStock,
        Remarks: "Purchase Minus - ReviseStock on Edit",
      });

      console.log(`Updated stock and added stock detail report for Part ID: ${Part_id}`);
    } catch (error) {
      console.error(`Error updating stock for item: ${item.Part_id}`, error);
    }
  }

  // Delete existing purchase and stock details
  try {
    const deletePurchaseDetailsUrl = `${BASE_URL}/purchase_detail/delete/${encodedInvoiceNumber}`;
    await DELETE_Api(deletePurchaseDetailsUrl, "");
    console.log("Deleted Purchase Details.");

    const deletePurchaseUrl = `${BASE_URL}/purchase/delete/${encodedInvoiceNumber}`;
    await DELETE_Api(deletePurchaseUrl, "");
    console.log("Deleted Purchase Items.");
  } catch (error) {
    console.error("Error deleting purchase details/items:", error);
  }


  // Save Purchase Details
  const url = BASE_URL + `/purchase_detail/insert`;
  try {
    const res_2 = await POST_Api(url, '', purchaseDetails);
    console.log('Save Purchase Details :', res_2);
  } catch (error) {
    console.error('Error inserting Purchase Details:', error);
  }


  // Insert new purchase items and update stock
  for (const itemX of purchaseList) {
    try {
      const { Part_id, Qty, Item_Name, PartNumber } = itemX;
      if (!Part_id) throw new Error("Part ID is missing in purchaseList item.");

      // Get current stock
      const stockUrl = `${BASE_URL}/item_master/get_item/${Part_id}`;
      const stockData = await GET_Api(stockUrl, "");
      const { Stock_Qty, ModelNumber } = stockData[0] || {};
      const updatedStock = (Stock_Qty || 0) + Qty;

      // Update stock
      const updateStockUrl = `${BASE_URL}/item_master/update/${Part_id}`;
      await POST_Api(updateStockUrl, "", { Stock_Qty: updatedStock });

      // Insert stock detail report
      const stockDetailUrl = `${BASE_URL}/stockDetail_report/insert`;
      await POST_Api(stockDetailUrl, "", {
        Type: "Purchase",
        Invoice_Number: invoiceNumber,
        Invoice_Date: purchaseDetails.Invoice_Date,
        Item_Name,
        PartNumber,
        ModelNumber,
        Stock_Qty: Stock_Qty,
        Transact_Qty: Qty,
        HandStock_Qty: updatedStock,
        Remarks: "Purchase Add - UpdateStock on Edit/Update",
      });

      // Insert purchase item
      const purchaseInsertUrl = `${BASE_URL}/purchase/insert`;
      await POST_Api(purchaseInsertUrl, "", { ...itemX, Invoice_Date: purchaseDetails.Invoice_Date });

      console.log("Inserted purchase item and updated stock.");
    } catch (error) {
      console.error("Error inserting purchase item:", itemX, error);
    }
  }
}


export async function PurchaseDelete_Service(rowDelete) {
  // console.log('rowDelete', rowDelete);
  let invoiceNumber = rowDelete.Invoice_Number;
  console.log('invoiceNumber', invoiceNumber);


  const param = invoiceNumber; // "BIOS/2556/24-25" new code added
  const encoded_Invoice_Number = encodeURIComponent(param); //  new code added

  // 1. get old purchase items  ...
  const url_geturchase = process.env.REACT_APP_BACKEND_BASE_URL + `/purchase/get_purchase/${encoded_Invoice_Number}`;
  const result_Data = await GET_Api(url_geturchase, '');
  console.log('1. get old purchase items...', result_Data);

  // 2. StockDetail_Report ReviseStockDeleted API request
  const url_delete_StockDetail = BASE_URL + `/stockDetail_report/delete/${encoded_Invoice_Number}`;
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
      let updated_stock = current_stock - old_qty; // purchase minus from stock
      console.log('stock minus = current_stock/old_qty', current_stock, old_qty)

      // 4. update delete stock to itemMaster
      const url_updateToStock = BASE_URL + `/item_master/update/${part_id}`
      const delStock = await POST_Api(url_updateToStock, '', { Stock_Qty: updated_stock });
      if (delStock) {
        console.log('4. update deleted old stock to itemMaster...')
      }

      // 5. StockDetail_Report ReviseStockDeleted API request
      const url_StockDetail_Report = BASE_URL + '/stockDetail_report/insert';
      const result1 = await POST_Api(url_StockDetail_Report, '', {

        Type: 'Purchase',
        Invoice_Number: rowDelete.Invoice_Number,
        Invoice_Date: rowDelete.Invoice_Date,
        Item_Name: item.Item_Name,
        PartNumber: item.PartNumber,
        ModelNumber: ModelNumber,
        Stock_Qty: current_stock,
        Transact_Qty: old_qty,
        HandStock_Qty: updated_stock,
        Remarks: 'Purchase Deleted - Minus - ReviseStock',

      });
      console.log('5. Deleted _ReviseStock - StockDetail_Report Insert :', result1);


    } catch (error) {

    }
  } // End of 1st For loop Purchase Items


  // 6. delete PurchaseDetails by Invoice_Number
  const url_deletePurchaseDetails = BASE_URL + `/purchase_detail/delete/${encoded_Invoice_Number}`;
  try {
    const res_2 = await DELETE_Api(url_deletePurchaseDetails, '');
    console.log('6. Deleted Purchase Details...', res_2);

  } catch (error) {
    console.error('Error deleting Purchase Details:', error);
  }

  // 7. delete all purchase items by Invoice_Number
  const url_deletePurchase = BASE_URL + `/purchase/delete/${encoded_Invoice_Number}`;
  try {
    const res_3 = await DELETE_Api(url_deletePurchase, '');
    console.log('7. Deleted All Purchase Items...', res_3);

  } catch (error) {
    console.error('Error deleting Purchase Items:', error);
  }

  toast.success('Delete success...!')

} // End of Purchase Delete function ....