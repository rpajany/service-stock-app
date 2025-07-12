import React, { useEffect } from 'react';
import { useSales } from '../context/salesContext';


// css 
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
const tbl_thead_tr = "bg-blue-500 text-white border-r-2  border-gray-300";
const tbl_thead_th = "px-6 py-3 border-r-2  border-gray-300";

const tbl_tbody_td = "border-r-2  border-gray-300 px-1 ";
const tbl_input = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500";

export const SalesTableRow = () => {
    const { salesList, addToSales, removeFromSales, updateFromSales } = useSales(); // get from salesContext

    let rowCount = 0;


    // remove button function ...
    const handleRemove = (item) => {
        // console.log('item', item)
      
        removeFromSales(item)
    }


   
    // console.log('rowCount', rowCount)

    // input change function ...
    const handleChange = (e, item) => {
        const { name, value } = e.target;
        let val;

        if (name === 'Item_Name') {
            val = value;
            Object.defineProperty(item, name, { value: val });
            updateFromSales(item);
        } else {
            val = parseFloat(value) || 0;
            Object.defineProperty(item, name, { value: val });
            let unitPrice = (item.Sale_Price * item.Qty);
            let discount_amount = ((unitPrice * item.Discount_Percent) / 100);
            let afterDiscount_Price = (unitPrice - discount_amount);
            const taxAmount = ((afterDiscount_Price * item.Tax_Percent) / 100);
            const itemTotal = unitPrice + taxAmount;

            const dataNew = {
                ...item,
                Discount_Amount: discount_amount,
                taxable_Amount: afterDiscount_Price,
                Tax_Amount: taxAmount,
                Total: itemTotal
            }

            updateFromSales(dataNew); // update sales context state 
        }
    }

 

    return (
        <>
            {
                salesList.map((item, index) => (
                    <tr key={item.Part_id} id={item.Part_id} className='border-b-2 border-l-2 border-r-2 border-gray-300 '>
                        <td className={`${tbl_tbody_td}`}><input type="text" id="sl" name="sl" value={index + 1} readOnly={true} className={`${tbl_input} w-12 `} autoComplete="off" /></td>
                        <td className={`${tbl_tbody_td}`}><input type="text" id="ItemCode" name="ItemCode" defaultValue={item.Part_id} className={`${tbl_input} w-full`} placeholder="Code" autoComplete="off" /></td>
                        <td className={`${tbl_tbody_td}`}><input type="text" id="ItemName" name="ItemName" defaultValue={item.Item_Name} className={`${tbl_input} w-full`} placeholder="Desc." autoComplete="off" /></td>
                        <td className={`${tbl_tbody_td}`}><input type="text" id="HSNcode" name="HSNcode" defaultValue={item.HSN_Code} className={`${tbl_input} w-18`} placeholder="HSN Code" autoComplete="off" /></td>
                        <td className={`${tbl_tbody_td}`}><input type="number" id="Qty" name="Qty" step="0.01" value={item.Qty} onChange={(e) => handleChange(e, item)} className={`${tbl_input} w-16`} autoComplete="off" /></td>
                        <td className={`${tbl_tbody_td}`}><input type="number" id="Sale_Price" name="Sale_Price" step="0.01" value={item.Sale_Price || 0.00} onChange={(e) => handleChange(e, item)} className={`${tbl_input} w-24`} autoComplete="off" /></td>
                        <td className={`${tbl_tbody_td}`}>
                            <div className='flex '>
                                <input type="number" id="Discount_Percent" name="Discount_Percent" step="0.01" onChange={(e) => handleChange(e, item)} value={item.Discount_Percent || 0} className={`${tbl_input} w-20 mr-2 mb-1`} autoComplete="off" />  %
                            </div>


                            <input type="text" id="Discount_Amount" name="Discount_Amount" value={item.Discount_Amount.toFixed(2) || 0.00} className={`${tbl_input} w-24`} autoComplete="off" />
                        </td>
                        <td className={`${tbl_tbody_td}`}>
                            <div className='flex '>
                                <input type="number" id="Tax_Percent" name="Tax_Percent" step="0.01" onChange={(e) => handleChange(e, item)} value={item.Tax_Percent} className={`${tbl_input} w-20 mr-2 mb-1`} autoComplete="off" /> %
                            </div>

                            <input type="text" id="Tax_Amount" name="Tax_Amount" onChange={(e) => handleChange(e, item)} value={item.Tax_Amount.toFixed(2) || 0.00} className={`${tbl_input} w-24`} autoComplete="off" />
                        </td>

                        <td className={`${tbl_tbody_td}`}><input type="text" id="Total" name="Total" onChange={(e) => handleChange(e, item)} value={item.Total.toFixed(2) || 0.00} className={`${tbl_input} w-24`} autoComplete="off" /></td>
                        <td className='flex flex-col text-center px-2 py-10 '><button type="button" id={item.Part_id} name={item.Part_id} onClick={() => handleRemove(item)} className="bg-red-500 text-white py-1 px-1 rounded-full btn-danger disabled btn-sm btn_remove_row">X</button></td>
                    </tr>
                ))
            }
        </>
    )
}
