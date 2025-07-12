import React, { useEffect, useState, useContext } from 'react';
import { DataTableVIew, DatePicker2, ReactDateRangePicker } from '../components';
import { ApiContext } from '../context/ApiProvider';
import { useBaseUrl, Load_SalesPayment_Service, Get_SalesDetail_Service, Get_SalesPay_Service, Save_SalesPay_Service } from '../services/SalesPaymentService';

import moment from 'moment';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-sm border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
const btn_Edit = 'bg-red-500 text-white py-1 px-1 rounded-full';
const tbl_thead_tr = "bg-blue-500 text-white border-r-2  border-gray-300";
const tbl_thead_th = "px-6 py-3 border-r-2  border-gray-300";
const tbl_tbody_td = "border-r-2  border-gray-300 px-1";
const tbl_input = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500";


export const SalesPayment = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);

    const [activeTab, setActiveTab] = useState(1);
    const [date, setDate] = useState(new Date()); // date object  
    const [isEdit, setIsEdit] = useState(false);
    const [tableData, setTableData] = useState([]);

    const [dateRangeNow, setDateRangeNow] = useState({});
    const [apiData, setApiData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

    const SalesPay_InitialValue = {
        Invoice_Number: '',
        Invoice_Date: '',
        Customer_Name: '',
        Invoice_Amount: 0.00,
        Amount_Paid: 0.00,
        Balance_Amount: 0.00,
        Pay_Mode: '',
        Pay_Note: '',
        Pay_Date: '',
        Amount_Recived: 0.00,
        Pay_Status: ''
    }

    const [salesPayData, setSalesPayData] = useState(SalesPay_InitialValue);





    const handleChange = async (e) => {
        const { name, value } = e.target
        setSalesPayData((preve) => {
            return { ...preve, [name]: value }
        });

        // if (name === 'Invoice_Number') {
        //     const result = await Get_SalesDetail_Service(value);
        //     console.log(result)

        //     const { Invoice_Date, Customer_Name, Total_Amount, Amount_Paid, Balance_Amount } = result[0];

        //     setSalesPayData((preve) => {
        //         return {
        //             ...preve,


        //             Invoice_Date: Invoice_Date,
        //             Customer_Name: Customer_Name,
        //             Invoice_Amount: Total_Amount,
        //             Amount_Paid: Amount_Paid,
        //             Balance_Amount: Balance_Amount

        //         }
        //     });

        //     const result1 = await Get_SalesPay_Service(value);

        //     setTableData(result1);
        //     console.log('tableData', tableData)

        // }

    }


    const handle_InvoiceNumber_KeyDown = async (e) => {
        if (e.key === 'Enter') {
            const { name, value } = e.target
            // console.log('value', value)

            if (name === 'Invoice_Number') {
                const result = await Get_SalesDetail_Service(value);

                if (result.length >= 1) {
                    // console.log(result)

                    const { Invoice_Date, Customer_Name, Total_Amount, Amount_Paid, Balance_Amount, Pay_Status } = result[0];

                    setSalesPayData((preve) => {
                        return {
                            ...preve,


                            Invoice_Date: Invoice_Date,
                            Customer_Name: Customer_Name,
                            Invoice_Amount: Total_Amount,
                            Amount_Paid: Amount_Paid,
                            Balance_Amount: Balance_Amount,
                            Pay_Status: Pay_Status

                        }
                    });

                    const result1 = await Get_SalesPay_Service(value);
                    // console.log('Get_SalesPay_Service', result1)
                    setTableData(result1);
                    console.log('tableData', tableData)
                } else {
                    console.log('Data Not Found !!!')
                }


            }
        }
    }

    useEffect(() => {

        let invoiceAmt = parseFloat(salesPayData.Invoice_Amount);
        let payedAmount = parseFloat(salesPayData.Amount_Paid)
        let reciveAmt = (parseFloat(salesPayData.Amount_Recived));

        let total_Recived = (payedAmount + reciveAmt)

        let balance = parseFloat(invoiceAmt - total_Recived);
        console.log(balance)

        let payStatus = "";

        if (balance <= 0) {
            payStatus = "PAID";
        } else if (balance >= 1) {
            payStatus = "NOT PAID";
        }

        setSalesPayData((preve) => {
            return {
                ...preve,
                ...{
                    Pay_Date: moment(date).format('DD-MM-YYYY'),
                    // Amount_Paid: (payedAmount + reciveAmt),
                    Balance_Amount: balance,
                    Pay_Status: payStatus
                }


            }
        });
    }, [date, salesPayData.Amount_Recived])

    console.log('salesPayData', salesPayData)


    async function load_Data() {
        // console.log(dateRangeNow)

        if (Object.keys(dateRangeNow).length !== 0) {
            const output = await Load_SalesPayment_Service(dateRangeNow);
            // console.log(output)
            setApiData(output);
        }
    }


    useEffect(() => {

        if (activeTab === 1) {
            load_Data();
            // reset forrm values
            setSalesPayData(SalesPay_InitialValue);
            setIsEdit(false);
        }

    }, [activeTab, dateRangeNow]); // activeTab, isEdit


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent submission on Enter key
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();


        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        try {
            if (!isEdit) {     // save function ...
                const result3 = await Save_SalesPay_Service(salesPayData);
                if (result3) {
                    const result1 = await Get_SalesPay_Service(salesPayData.Invoice_Number);
                    // console.log('Get_SalesPay_Service', result1)
                    setTableData(result1);

                    // clear form
                    setSalesPayData(SalesPay_InitialValue);

                }

            }
        } catch (error) {
            console.log('Error :', error)
        } finally {
            setIsSubmitting(false); // Unlock the form
        }

    }

    const handleEdit = (row) => {

    }

    const handleDelete = (row) => {

    }

    // Define table columns
    const columns = [
        {
            name: 'id',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Inv_No',
            selector: row => row.Invoice_Number,
            sortable: true
        },
        {
            name: 'Inv_Date',
            selector: row => row.Invoice_Date,
            sortable: true
        },
        {
            name: 'Customer',
            selector: row => row.Customer_Name,
            sortable: true
        },
        {
            name: 'Amount_Recived',
            selector: row => row.Amount_Recived,
            sortable: true
        },
        {
            name: 'Balance_Amount',
            selector: row => row.Balance_Amount,
            sortable: true
        },
        {
            name: 'Pay_Date',
            selector: row => row.Pay_Date,
            sortable: true
        },
        {
            name: 'Pay_Mode',
            selector: row => row.Pay_Mode,
            sortable: true
        },
        {
            name: 'Pay_Note',
            selector: row => row.Pay_Note,
            sortable: true
        },
        {
            name: 'Pay_Status',
            selector: row => row.Pay_Status,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>

                    <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1 cursor-not-allowed' title='Edit' disabled><span><FaEdit /></span></button>
                    <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm cursor-not-allowed' title='Delete' disabled><RiDeleteBin2Line /></button>
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowoverflow: true, // Ensure the buttons are visible / allowOverflow
            button: true, // Makes it clear they are buttons
        }
    ];


    return (
        <>
            <div className="w-full mx-auto p-1">
                {/* Tab navigation */}
                <ul className="flex space-x-4 border-b-2 border-gray-200">
                    <li className={`cursor-pointer p-2 ${activeTab === 1 ? 'text-blue-600 border-blue-600 border-b-2  bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(1)}>
                        View Payment
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        Sales Payment
                    </li>
                </ul>

                {/* Tab content */}
                <div className="mt-4">
                    {activeTab === 1 && (
                        <div className="p-4 bg-green-300 rounded-lg">
                            {/*  Content for Tab 1  */}
                            <div className='flex mb-4'>

                                <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
                            </div>
                            <DataTableVIew tbl_title={''} columns={columns} apiData={apiData} />
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="mt-4">
                            {/*  Content for Tab 2  */}

                            <div className='border-2     rounded-lg'>
                                <div className="bg-green-400 text-white px-3 py-2"><span>Sales Payment</span></div>

                                <div className="p-3">
                                    <form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
                                        <p className='bg-blue-100 px-2 mb-4'>Invoice Details :</p>

                                        <div className='flex space-x-40 w-full'>

                                            <div className=" flex flex-col flex-1">
                                                <label htmlFor="Invoice_Number" className={`${label_css}`}>Invoice Number</label>
                                                <input
                                                    type="text"
                                                    id="Invoice_Number"
                                                    name="Invoice_Number"
                                                    onChange={handleChange}
                                                    onKeyDown={handle_InvoiceNumber_KeyDown}
                                                    value={salesPayData.Invoice_Number}
                                                    required
                                                    placeholder="Enter Invoice Number.."
                                                    className={`${input_css} w-full `} />
                                            </div>



                                            <div className="flex flex-col flex-1">
                                                <label htmlFor="Invoice_Date" className={`${label_css}`}>Invoice Date</label>
                                                <input
                                                    type="text"
                                                    id="Invoice_Date"
                                                    name="Invoice_Date"
                                                    // onChange={handleChange}
                                                    value={salesPayData.Invoice_Date}
                                                    placeholder="Invoice Date"
                                                    readOnly
                                                    className={`${input_css} cursor-not-allowed w-full`} />
                                            </div>


                                            <div className="flex flex-col flex-1">
                                                <label htmlFor="Customer_Name" className={`${label_css}`}>Customer</label>

                                                <input
                                                    type="text"
                                                    id="Customer_Name"
                                                    name="Customer_Name"
                                                    onChange={handleChange}
                                                    value={salesPayData.Customer_Name}
                                                    readOnly
                                                    placeholder="Customer Name"
                                                    className={`${input_css} cursor-not-allowed w-full`} />

                                            </div>


                                        </div>

                                        <hr style={{ borderColor: '#28a745' }} className='mt-4 mb-4'></hr>
                                        <p className='bg-blue-100 px-2 mb-4  '>Invoice Amount Details :</p>

                                        <div className="flex space-x-40 w-full">
                                            <div className="flex flex-col flex-1">
                                                <label htmlFor="Invoice_Amount" className={`${label_css}`}>Billed Amount</label>
                                                <input
                                                    type="text"
                                                    id="Invoice_Amount"
                                                    name="Invoice_Amount"
                                                    onChange={handleChange}
                                                    value={salesPayData.Invoice_Amount}
                                                    readOnly
                                                    className={`${input_css} cursor-not-allowed w-full `} />
                                            </div>


                                            <div className="flex flex-col flex-1">
                                                <label htmlFor="Amount_Paid" className={`${label_css}`}>Amount Paid</label>
                                                <input
                                                    type="text"
                                                    id="Amount_Paid"
                                                    name="Amount_Paid"
                                                    onChange={handleChange}
                                                    value={salesPayData.Amount_Paid}
                                                    readOnly
                                                    className={`${input_css} cursor-not-allowed w-full `} />
                                            </div>

                                            <div className="flex flex-col flex-1">
                                                <label htmlFor="Balance_Amount" className={`${label_css}`}>Outstanding Amount</label>
                                                <input
                                                    type="text"
                                                    id="Balance_Amount"
                                                    name="Balance_Amount"
                                                    onChange={handleChange}
                                                    value={salesPayData.Balance_Amount}
                                                    readOnly
                                                    className={`${input_css} cursor-not-allowed w-full `} />
                                            </div>

                                        </div>
                                        <hr style={{ borderColor: '#28a745' }} className='mt-4 mb-4'></hr>
                                        <p className='bg-blue-100 px-2 mb-4'>Payment :</p>

                                        <div className='flex space-x-40 w-full'>
                                            <div className=" flex flex-col flex-1">
                                                <label htmlFor="Pay_Mode" className={`${label_css}`}>Payment Type</label>
                                                <select id="Pay_Mode" name="Pay_Mode" onChange={handleChange} value={salesPayData.Pay_Mode} className={`${input_css} w-full `}  >
                                                    <option value="" >-- Select --</option>
                                                    <option value="Cash">Cash</option>
                                                    <option value="Cheque">Cheque</option>
                                                    <option value="Online">Online</option>
                                                </select>
                                            </div>

                                            <div className="flex flex-col flex-1">
                                                <label htmlFor="Pay_Note" className={`${label_css}`}>Payment Detail</label>
                                                <input
                                                    type="text"
                                                    id="Pay_Note"
                                                    name="Pay_Note"
                                                    onChange={handleChange}
                                                    value={salesPayData.Pay_Note}
                                                    placeholder="Enter Cash/Cheque/online transcation detials."
                                                    className={`${input_css} w-full `} />
                                            </div>

                                            <div className="flex flex-col items-start flex-1 ">
                                                <label htmlFor="txt_PaymentDate" className={`${label_css}`}>Payment Date</label>
                                                <DatePicker2 date={date} setDate={setDate} />
                                                {/* <input
                                                    type="text"
                                                    id="txt_PaymentDate"
                                                    name="txt_PaymentDate"
                                                    className={`${input_css} w-full `} /> */}
                                            </div>


                                            <div className="flex flex-col flex-1">
                                                <label htmlFor="Pay_Status" className={`${label_css}`}>Pay Status</label>
                                                <input
                                                    type="text"
                                                    id="Pay_Status"
                                                    name="Pay_Status"
                                                    onChange={handleChange}
                                                    value={salesPayData.Pay_Status}
                                                    placeholder=""
                                                    className={`${input_css} w-full `} />
                                            </div>

                                        </div>

                                        <div className=' mt-4 '>
                                            <div className="flex-1">
                                                <label htmlFor="Amount_Recived" className={`${label_css}`}>Amount Recived</label>
                                                <input
                                                    type="text"
                                                    id="Amount_Recived"
                                                    name="Amount_Recived"
                                                    onChange={handleChange}
                                                    value={salesPayData.Amount_Recived}
                                                    placeholder="Enter Cash Recived."
                                                    className={`${input_css} `} style={{ width: '350px' }} />
                                            </div>
                                        </div>
                                        <button type="submit"
                                            disabled={isSubmitting}
                                            className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-40  mt-4  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>
                                    </form>

                                    <hr style={{ borderColor: '#28a745' }} className='mt-4 mb-4'></hr>
                                    <p className='mt-4 mb-2'>Payment Recived:</p>

                                    <div className="border-2 mb-4 ">
                                        <table id="table_load_InvoicePayment" className="table table-sm table-bordered" width="100%" cellSpacing="0">
                                            <thead className='bg-blue-500 text-white  '>
                                                <tr className=''>
                                                    <th className='px-2 py-1'>#</th>
                                                    <th>Date</th>
                                                    <th>Payment</th>
                                                    <th>Balance</th>
                                                    <th>Pay_Type</th>
                                                    <th>Pay_Desc.</th>
                                                    <th>Status</th>
                                                    <th className='px-2 py-1'>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>


                                                {tableData.length > 0 && tableData.map((item, index) => (
                                                    <tr id="1" className='border-b-2'>
                                                        <td className='px-2 py-1'>1</td>
                                                        <td><input type="text" id="txt_PaymentDate_1" name="txt_PaymentDate_1" value={item.Pay_Date} className="text-center" style={{ border: 'none' }} /></td>
                                                        <td><input type="text" id="txt_AmtPaid_1" name="txt_AmtPaid_1" value={item.Amount_Recived} className="text-center" style={{ border: 'none' }} /></td>
                                                        <td><input type="text" id="txt_AmountBalance_1" name="txt_AmountBalance_1" value={item.Balance_Amount} className="text-center" style={{ border: 'none' }} /></td>
                                                        <td><input type="text" id="txt_Pay_Type_1" name="txt_Pay_Type_1" value={item.Pay_Mode} className="text-center" style={{ border: 'none' }} /></td>
                                                        <td><input type="text" id="txt_Pay_Note_1" name="txt_Pay_Note_1" value={item.Pay_Note} className="text-center " style={{ border: 'none' }} /></td>
                                                        <td className=''><input type="text" id="txt_Status_1" name="txt_Status_1" value={item.Pay_Status} className="text-center " style={{ border: 'none' }} /></td>
                                                        <td className='px-2 py-1 text-center'><button type="button" id="126" name="126" className="bg-red-500 px-2 py-1 rounded-sm text-white" style={{ border: 'none' }} >X</button></td>
                                                    </tr>
                                                ))}

                                                {/*                                                 
                                                : {(<td colSpan={7} className='px-2'> No Record Found</td>)) 
                                                   
                                               } */}






                                            </tbody>
                                        </table>




                                    </div>

                                </div>












                            </div>






                        </div>
                    )}
                </div >
            </div >
        </>
    )
}
