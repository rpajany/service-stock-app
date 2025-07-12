import React from 'react';
import { AutoComplete, DatePicker2 } from '../components';
import { usePurchase } from '../context/purchaseContext';

// css properties
const tbl_thead_tr = "bg-blue-500 text-white border-r-2  border-gray-300"
const tbl_thead_th = "px-6 py-3"
const tbl_input = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"

export const PurchaseTableRow = () => {
    const { purchaseList, addToPurchase, removeFromPurchase, updateFromPurchase, taxable_Amount, total, taxTotal, updateTaxable_Amount, updateTotal } = usePurchase();
    let rowCount = 0;

    const handleRemove = (item) => {

        // rowCount = rowCount - 1;
        removeFromPurchase(item)
    }

    const handleChange = (e, item) => {
        const { name, value } = e.target;

        console.log('item :', item)
        console.log('name :', name)
        console.log('value :', value)

        let val;

        if (name === 'Item_Name') {
            val = value;
            // updateFromPurchase(item.id, name, val);
            // Object.defineProperty(item, name, { value: val });
            Object.defineProperty(item, name, { value });
            updateFromPurchase(item);

        } else {
            // val = parseFloat(value) || 0;
            // updateFromPurchase(item.id, name, val);
            // Object.defineProperty(item, name, { value: val });

            // Store raw string value to avoid cutting decimals
            Object.defineProperty(item, name, { value });

            // Safely convert to float where needed
            const qty = parseFloat(item.Qty) || 0;
            const price = parseFloat(item.Purchase_Price) || 0;
            console.log('price :', price)
            const discountPercent = parseFloat(item.Discount_Percent) || 0;
            const taxPercent = parseFloat(item.Tax_Percent) || 0;

            // let unitPrice = (item.Purchase_Price * item.Qty);          
            // let discount_amount = ((unitPrice * item.Discount_Percent) / 100);
            // let afterDiscount_Price = (unitPrice - discount_amount);
            // const taxAmount = ((afterDiscount_Price * item.Tax_Percent) / 100);           
            // const itemTotal = afterDiscount_Price + taxAmount;

            const unitPrice = qty * price;
            const discountAmount = (unitPrice * discountPercent) / 100;
            const afterDiscountPrice = unitPrice - discountAmount;
            const taxAmount = (afterDiscountPrice * taxPercent) / 100;
            const itemTotal = afterDiscountPrice + taxAmount;

            // Add a Property
            // Object.defineProperty(item, { ...item, taxAmount: taxAmount, total: taxAmount });

            // Object.defineProperty(item, "total", { value: itemTotal });

            const dataNew = {
                ...item,
                Qty: qty,
                Purchase_Price: price,
                Discount_Percent: discountPercent,
                Tax_Percent: taxPercent,
                Discount_Amount: discountAmount,
                taxable_Amount: afterDiscountPrice,
                Tax_Amount: taxAmount,

                Total: itemTotal
            }
            // console.log("dataNew", dataNew)
            updateFromPurchase(dataNew);
        }

    }

    // console.log('purchaseList', purchaseList)



    return (
        <>
            {
                purchaseList.map((item, index) => (

                    < tr key={item.Part_id} id={item.Part_id} className='border-b-2 border-l-2 border-r-2 border-gray-300 ' >
                        <td className='border-r-2  border-gray-300 px-1'><input type="text" id="txt_SL_1" name="txt_SL_1" value={index + 1} className={`${tbl_input} w-12`} placeholder="" readOnly="" /></td>
                        <td className='border-r-2  border-gray-300 px-1'><input type="text" id="txt_ItemCode_1" name="txt_ItemCode_1" defaultValue={item.Part_id} className={`${tbl_input} w-full`} placeholder="Code." autoComplete="off" /></td>
                        <td className='border-r-2  border-gray-300 px-1'><input type="text" id="txt_ItemName_1" name="txt_ItemName_1" defaultValue={item.Item_Name} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Item Desc." required="" readOnly="readonly" autoComplete="off" /></td>
                        {/* <td><AutoComplete inputName="txt_ItemName_1" txt_css={`${tbl_input} w-full`} /></td> */}
                        <td className='border-r-2  border-gray-300 px-1'><input type="text" id="txt_HSNcode_1" name="txt_HSNcode_1" defaultValue={item.HSN_Code} className={`${tbl_input} w-18`} placeholder="HSN" /></td>
                        {/* <td className='border-r-2  border-gray-300 px-1'><input type="text" className={`${tbl_input} w-24`} id="txt_MRP_1" name="txt_MRP_1" value="100000.00" placeholder="0.00" required="" /></td> */}
                        <td className='border-r-2  border-gray-300 px-1'><input type="number" id="Qty" name="Qty" step="0.01" value={item.Qty} onChange={(e) => handleChange(e, item)} className={`${tbl_input} w-full`} min="1" required="" /><input type="hidden" id="txt_StockQty_1" name="txt_StockQty_1" style={{ Display: 'none' }} /></td>
                        <td className='border-r-2  border-gray-300 px-1'>
                            <input type="number" className={`${tbl_input} w-24`} id="Purchase_Price" name="Purchase_Price" step="0.01" value={item.Purchase_Price || 0.00} onChange={(e) => handleChange(e, item)} placeholder="0.00" required="" autoComplete="off" />
                        </td>

                        <td className='border-r-2  border-gray-300 px-1'>
                            <div className='flex mb-2 items-center'>
                                <input type="number" className={`${tbl_input} w-16 mr-3`} id="Discount_Percent" name="Discount_Percent" step="0.01" onChange={(e) => handleChange(e, item)} value={item.Discount_Percent || 0} placeholder="0.00" min='0' required="" /> %
                            </div>

                            <input type="number" id="Discount_Amount" name="Discount_Amount" step="0.01" value={item.Discount_Amount.toFixed(2) || 0.00} onChange={(e) => handleChange(e, item)} className={`${tbl_input} w-24`} />
                        </td>

                        <td className='border-r-2  border-gray-300 px-1'>
                            <div className='flex mb-2 items-center'>
                                <input type="number" id="Tax_Percent" name="Tax_Percent" step="0.01" onChange={(e) => handleChange(e, item)} value={item.Tax_Percent} className={`${tbl_input} w-20 mr-3`} /><span>%</span>
                            </div>
                            <input type="text" className={`${tbl_input} w-24`} id="Tax_Amount" name="Tax_Amount" onChange={(e) => handleChange(e, item)} value={item.Tax_Amount.toFixed(2) || 0.00} />



                        </td>
                        <td className='border-r-2  border-gray-300 px-1'><input type="text" id="Total" name="Total" value={item.Total.toFixed(2) || 0.00} onChange={(e) => handleChange(e, item)} className={`${tbl_input} w-full`} placeholder="0.00" required="" autoComplete="off" readOnly="" /></td>
                        <td className='flex flex-col text-center px-2 py-10 '><button type="button" id={item.Part_id} name={item.Part_id} onClick={() => handleRemove(item)} className="bg-red-500 text-white py-1 px-1 rounded-full btn-danger disabled btn-sm btn_remove_row">X</button></td>

                    </ tr>
                ))}


        </>
    )
}
