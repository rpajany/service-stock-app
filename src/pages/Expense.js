import React, { useState, useEffect, useContext } from 'react';
import { DataTableVIew, DatePicker2, ReactDateRangePicker } from '../components';
import { SweetAlert_Delete } from '../helpers/custom';
import { useBaseUrl, Load_Expense_Service, SaveExpense_Service, UpdateExpense_Service, DeleteExpense_Service } from '../services/ExpenseService';
import { ApiContext } from '../context/ApiProvider';
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

export const Expense = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);

    const [activeTab, setActiveTab] = useState(1);
    const [date, setDate] = useState(new Date()); // date object  
    const [isEdit, setIsEdit] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [dateRangeNow, setDateRangeNow] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

    const ExpenseData_InitialValue = {
        Expense: '',
        Qty: '1',
        Rate: '0.00',
        Amount: '0.00',
        Category: '',
        Expense_Date: '',
        Mode: '',
        Note: '',
        EnterBy: 'admin',
    }

    const [expenseData, setExpenseData] = useState(ExpenseData_InitialValue);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData((preve) => {
            return { ...preve, [name]: value }
        });

        // console.log('name', name)
        // if (name === 'Rate' || name === 'Qty') {
        //     console.log('event...!!!')
        //     const qty = expenseData.Qty;
        //     const rate = expenseData.Rate;
        //     const amount = rate * qty;

        //     setExpenseData((preve) => {
        //         return {
        //             ...preve, ...{
        //                 Expense_Date: moment(date).format('DD-MM-YYYY'),
        //                 Amount: amount.toFixed(2)
        //             }
        //         }
        //     });
        // }


    }




    // console.log('expenseData', expenseData)

    useEffect(() => {

        // if (expenseData.Qty >= 1 && expenseData.Rate > 0) {
        const qty = expenseData.Qty;
        const rate = expenseData.Rate;
        const amount = rate * qty;

        setExpenseData((preve) => {
            return {
                ...preve,
                Expense_Date: moment(date).format('DD-MM-YYYY'),
                ...{ Amount: amount }
            }
        });

        // }

    }, [date, expenseData.Qty, expenseData.Rate]); // [date,]


    // console.log('expenseData', expenseData)

    // console.log('dateRangeNow', dateRangeNow)
    // console.log('End dateRangeNow', dateRangeNow.endDate)

    // useEffect(() => {
    //     console.log('dateRange', dateRangeNow)
    // }, [dateRangeNow])


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        try {
            if (!isEdit) {  // save function ...
                const output = await SaveExpense_Service(expenseData);
                if (output) {
                    setExpenseData(ExpenseData_InitialValue);
                } else {
                    console.log('Error Save Expemse...!!!')
                }

            } else if (isEdit) {
                const output = await UpdateExpense_Service(expenseData.id, expenseData);
                if (output) {
                    // reset forrm values
                    setExpenseData(ExpenseData_InitialValue);
                    setIsEdit(false);
                } else {
                    console.log('Error Update Expemse...!!!')
                }
            }
        } catch (error) {
            console.log('Error :', error)
        } finally {
            setIsSubmitting(false); // Unlock the form
        }

    }

    async function load_Data() {
        // console.log(dateRangeNow)

        if (Object.keys(dateRangeNow).length !== 0) {
            const output = await Load_Expense_Service(dateRangeNow);
            // console.log(output)
            setApiData(output);
        }
    }


    useEffect(() => {


        if (activeTab === 1) {
            load_Data();
            // reset forrm values
            setExpenseData(ExpenseData_InitialValue);
            setIsEdit(false);
        }

    }, [activeTab, dateRangeNow]); // activeTab, isEdit


    const handleEdit = async (row) => {
        // console.log(row) 
        setExpenseData((preve) => {
            return { ...preve, ...row, id: row.id }
        });

        setActiveTab(2);
        setIsEdit(true); // set to edit mode ...
    }

    const handleDelete = async (row) => {
        const shouldDelete = await SweetAlert_Delete();

        if (shouldDelete) {
            const result = await DeleteExpense_Service(row.id);
            if (result) {
                await load_Data();
            }

        }
    }



    // Define table columns
    const columns = [
        {
            name: 'Expense_Date',
            selector: row => row.Expense_Date,
            sortable: true
        },
        {
            name: 'Expense',
            selector: row => row.Expense,
            sortable: true
        },
        {
            name: 'Qty',
            selector: row => row.Qty,
            sortable: true
        },
        {
            name: 'Rate',
            selector: row => row.Rate,
            sortable: true
        },
        {
            name: 'Amount',
            selector: row => row.Amount,
            sortable: true
        },
        {
            name: 'Category',
            selector: row => row.Category,
            sortable: true
        },
        {
            name: 'Mode',
            selector: row => row.Mode,
            sortable: true
        },
        {
            name: 'Note',
            selector: row => row.Note,
            sortable: true
        },
        {
            name: 'EnterBy',
            selector: row => row.EnterBy,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>

                    <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1' title='Edit'><span><FaEdit /></span></button>
                    <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm' title='Delete'><RiDeleteBin2Line /></button>
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
                        View Expense
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        Expense
                    </li>
                </ul>

                {/* Tab content */}
                <div className="mt-4">
                    {activeTab === 1 && (
                        <div className="p-4 bg-blue-300 rounded-lg">
                            {/*  Content for Tab 1  */}
                            <div className='flex mb-4'>

                                <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
                            </div>

                            <DataTableVIew tbl_title={''} columns={columns} apiData={apiData} />
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="border-2">
                            <div className="bg-green-400 text-white px-3 py-2">
                                <span>Add Expense</span>
                            </div>

                            <div className='p-3'>
                                <form onSubmit={handleSubmit}>
                                    <p className='bg-blue-100'>Expense Details :</p>
                                    <div className='grid gap-8 md:grid-cols-2 mt-4'>
                                        <div className="flex items-center">
                                            <label htmlFor="Category" className='mr-3'>Category</label>
                                            <select className={`${input_css} w-full`} id="Category" name="Category" onChange={handleChange} value={expenseData.Category} required>
                                                <option value="">- Select -</option>
                                                <option value="Others">Others</option>
                                                <option value="Tea/Snacks">Tea/Snacks</option>
                                                <option value="Salary">Salary</option>
                                                <option value="Stationery">Stationery</option>
                                                <option value="Rent">Rent</option>
                                                <option value="EB">EB</option>
                                                <option value="Water">Water</option>
                                                <option value="Car/Auto">Car/Auto</option>
                                                <option value="Courier/Parcel">Courier/Parcel</option>
                                                <option value="Pooja">Pooja</option>
                                                <option value="Spares">Spares</option>
                                                <option value="Food">Food</option>
                                                <option value="Petrol/Fuel">Petrol/Fuel</option>
                                                <option value="Travel">Travel</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center">
                                            <label htmlFor="txt_ExpenseDate" className='mr-3'>Expense Date</label>
                                            <DatePicker2 date={date} setDate={setDate} />
                                        </div>
                                    </div>


                                    <div className=' grid grid-cols-3 gap-4 mt-4'>
                                        <div className="form-group">
                                            <label htmlFor="Mode">Expense Mode</label>
                                            <select className={`${input_css} w-full`} id="Mode" name="Mode" onChange={handleChange} value={expenseData.Mode} required>
                                                <option value="">- Select -</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Card">Card</option>
                                                <option value="Online">Online</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="Note">Note:</label>
                                            <input
                                                type="text"
                                                id="Note"
                                                name="Note"
                                                onChange={handleChange}
                                                value={expenseData.Note}
                                                placeholder="Enter Expense Note."
                                                className={`${input_css} w-full`} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="EnterBy">Enter By</label>
                                            <input
                                                type="text"
                                                id="EnterBy"
                                                name="EnterBy"
                                                onChange={handleChange}
                                                value={expenseData.EnterBy}
                                                required
                                                placeholder="Name of person Entering Expense."
                                                className={`${input_css} w-full`} />
                                        </div>
                                    </div>

                                    <p className='bg-blue-100 mt-4'>Add Expense Items :</p>
                                    <div className="mt-4 border-2">
                                        <table className="w-full">
                                            <thead className='h-10' style={{ backgroundColor: '#55acee', color: 'white' }}>
                                                <tr>
                                                    <th className={`${tbl_thead_th} w-8`} >#</th>
                                                    <th className={`${tbl_thead_th} w-1/2`}>Expence Name</th>
                                                    <th className={`${tbl_thead_th} w-12`} >Qty</th>
                                                    <th className={`${tbl_thead_th} w-60`} >Rate</th>
                                                    <th >Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><input value={1} className={`${input_css} `} /></td>
                                                    <td><input
                                                        type="text"
                                                        id="Expense"
                                                        name="Expense"
                                                        onChange={handleChange}
                                                        value={expenseData.Expense}
                                                        required
                                                        placeholder="Enter Expense item describtion."
                                                        className={`${input_css} w-full border-2 border-gray-100`} /></td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            id="Qty"
                                                            name="Qty"
                                                            onChange={handleChange}
                                                            value={expenseData.Qty}
                                                            required
                                                            className={`${input_css} w-full`} />
                                                    </td>
                                                    <td className=''>
                                                        <span className="flex items-center px-2 ">₹
                                                            <input
                                                                type="text"
                                                                id="Rate"
                                                                name="Rate"
                                                                onChange={handleChange}
                                                                value={expenseData.Rate}
                                                                required
                                                                placeholder="0.00"
                                                                className={`${input_css} w-full pl-2`} />
                                                        </span>

                                                    </td>
                                                    <td>
                                                        <span className="flex items-center px-2">₹
                                                            <input
                                                                type="text"
                                                                id="Amount"
                                                                name="Amount"
                                                                onChange={handleChange}
                                                                value={expenseData.Amount}
                                                                required
                                                                placeholder="0.00"
                                                                className={`${input_css} w-full px-2`} />
                                                        </span>

                                                    </td>

                                                </tr>



                                            </tbody>

                                        </table>



                                    </div>
                                    <button type="submit"
                                        disabled={isSubmitting}
                                        className={`${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-40  mt-4  p-3  rounded-lg  ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>
                                </form>
                            </div>

                        </div>

                    )}
                </div>
            </div >
        </>
    )
}
