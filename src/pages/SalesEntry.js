import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { POST_Api, GET_Api, insert_Api } from '../services/ApiService';
import { ApiContext } from '../context/ApiProvider';
import { useSales } from '../context/salesContext';
import { DataTableVIew, SalesAutoComplete, DatePicker2, ReactDateRangePicker } from '../components';
import { SalesTableRow, CustomerAutoComplete } from '../components';
import { Get_BaseUrl, SweetAlert_Delete, date_strToObject, date_objToFormat } from '../helpers/custom';
import { useBaseUrl, Load_SalesDetails_Service, SalesUpdate_Service, SalesDelete_Service, load_Customer_Service } from '../services/SalesEntryService';

import moment from 'moment';
import { toast } from 'react-toastify';
import { FaEdit, FaPrint } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// css 
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
const tbl_thead_tr = "bg-blue-500 text-white border-r-2  border-gray-300";
const tbl_thead_th = "px-6 py-3 border-r-2  border-gray-300";

const tbl_tbody_td = "border-r-2  border-gray-300 px-1";
const tbl_input = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500";

export const SalesEntry = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);
    BASE_URL = selectedApi;

    const { salesList, addToSales, taxable_Amount, taxTotal, total, clear_SalesItems } = useSales(); // get from salesContext

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(1);
    const [date, setDate] = useState(new Date()); // date object    
    const [isEdit, setIsEdit] = useState(false);
    const [isChecked, setIsChecked] = useState(false)
    const [dateRangeNow, setDateRangeNow] = useState({});


    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

    const salesInitialValue = {
        Invoice_Number: '',
        Invoice_Date: '',    // moment(new Date()).format('DD-MM-YYYY'),
        Customer_Name: '',
        Address: '',
        GSTIN: '',
        State: '',
        Taxable_Amount: 0.00,
        SGST: 0.00,
        CGST: 0.00,
        IGST: 0.00,
        Total_Amount: 0.00,
        Amount_Paid: 0.00,
        Pay_Mode: '',
        Pay_Note: '',
        Pay_Status: '',
        Balance_Amount: 0.00,
        GST_Status: '',
        Model: '',
        Serial: '',
        Note: ''
    }

    const [salesDetails, setSalesDetails] = useState(salesInitialValue);

    const [customerApiData, setCustomerApiData] = useState({});
    const [rowItems, setRowItems] = useState([]); // selected items
    const [selectedCustomer, setSelectedCustomer] = useState([]); // selected customer
    const [apiData, setApiData] = useState([]);


    const Load_AllCustomers = async () => {
        try {
            const result = await load_Customer_Service();
            // console.log('Customer Data :', result)
            setCustomerApiData(result);
        } catch (error) {
            console.log('Error Load_AllCustomers :', error)
        }
    }

    console.log('rowItems :', rowItems);

    useEffect(() => {
        if (selectedCustomer) {
            setSalesDetails((prev) => ({
                ...prev,
                Customer_Name: selectedCustomer.Customer_Name || '',
                Address: selectedCustomer.Address || '',
                GSTIN: selectedCustomer.GSTIN || '',
                State: selectedCustomer.State || '',
            }))
        }

    }, [selectedCustomer])



    // input change function ...
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSalesDetails((preve) => {
            return {
                ...preve, [name]: value

            }
        })
    }

    // set time
    useEffect(() => {

        setSalesDetails((preve) => {
            return {
                ...preve,
                Invoice_Date: moment(date).format('DD-MM-YYYY'),
                Taxable_Amount: taxable_Amount.toFixed(2),
                SGST: salesDetails.State === 'PUDUCHERRY' ? (taxTotal / 2).toFixed(2) : (0).toFixed(2),
                CGST: salesDetails.State === 'PUDUCHERRY' ? (taxTotal / 2).toFixed(2) : (0).toFixed(2),
                IGST: salesDetails.State === 'OTHERS' ? taxTotal.toFixed(2) : (0).toFixed(2),
                Total_Amount: total.toFixed(2),
                Balance_Amount: (total - salesDetails.Amount_Paid).toFixed(2),
                Pay_Status: (total - salesDetails.Amount_Paid) <= 0 ? 'PAID' : 'NOT PAID',
                GST_Status: isChecked ? 'NON-GST' : 'GST'

            }
        })
    }, [date, isChecked, taxable_Amount, taxTotal, total, salesDetails.Amount_Paid, salesDetails.State])


    async function Update_SalesUID() {
        try {
            const newUID = salesDetails.Invoice_Number;
            // console.log('newUID', newUID)
            const url_updateSalesUID = BASE_URL + `/uid/update_salesUID/1`;
            const output = await POST_Api(url_updateSalesUID, '', { Sales_UID: newUID });
            // console.log('Update_SalesUID :', output);
        } catch (error) {
            console.error('Update_SalesUID  :', error.message); // Handle error
        }
    }

    async function Update_NonGST_SalesUID() {
        try {
            const newUID = salesDetails.Invoice_Number;
            // console.log('newUID', newUID)
            const url_updateNonGST_SalesUID = BASE_URL + `/uid/update_NonGST_salesUID/1`;
            const output2 = await POST_Api(url_updateNonGST_SalesUID, '', { NonGST_Sales_UID: newUID });
            // console.log('Update_NonGST_SalesUID :', output2);
        } catch (error) {
            console.error('Update_NonGST_SalesUID  :', error.message); // Handle error
        }
    }


    console.log('salesDetails', salesDetails)

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        if (!isEdit) {  // save function ...
            try {

                const url = BASE_URL + '/sales_detail/insert';

                await POST_Api(url, '', salesDetails).then((result1) => {
                    console.log('1st api insert :', result1);
                }).catch((error) => {
                    console.error("Error fetching data:", error);
                });

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




                // save items data in loop ...
                salesList.forEach(async (item) => {
                    const part_id = item.Part_id;
                    const Stock_Qty = item.Stock_Qty;
                    const StockMinus_Qty = item.Qty;

                    // stock Minus ...
                    let hand_StockQty = (Stock_Qty - StockMinus_Qty);

                    // 2nd updateStock _ API request,
                    const url_updateStock = BASE_URL + `/item_master/update/${part_id}`;
                    await POST_Api(url_updateStock, '', { Stock_Qty: hand_StockQty })
                        .then((result2) => {
                            console.log('2nd:- update Stock :', result2);

                        })  // end url_updateStock


                    // 3rd stockDetail_report API request...
                    const url_StockDetail_Report = BASE_URL + '/stockDetail_report/insert';
                    await POST_Api(url_StockDetail_Report, '', {
                        Type: 'Sales',
                        Invoice_Number: salesDetails.Invoice_Number,
                        Invoice_Date: salesDetails.Invoice_Date,
                        Item_Name: item.Item_Name,
                        PartNumber: item.PartNumber,
                        ModelNumber: item.ModelNumber,
                        Stock_Qty: item.Stock_Qty,
                        Transact_Qty: item.Qty,
                        HandStock_Qty: hand_StockQty,
                        Remarks: 'Sales Add - New',

                    }).then((result3) => {
                        console.log('3rd api:- StockDetail_Report Insert :', result3);
                    })

                    // update Sales UID
                    if (!isChecked) {
                        Update_SalesUID();
                    } else {
                        Update_NonGST_SalesUID();
                    }



                    // 4th API request,  
                    const url2 = BASE_URL + '/sales/insert';
                    // console.log(url2)
                    // console.log('item', { ...item, Invoice_Date: salesDetails.Invoice_Date })
                    await POST_Api(url2, '', { ...item, Invoice_Date: salesDetails.Invoice_Date })
                        .then((result4) => {
                            console.log('4th api insert :', result4);
                            // reset form values
                            setSalesDetails(salesInitialValue); // clear sales details 
                            clear_SalesItems(); // clear sales Items context

                            setIsChecked(false); // NON-GST
                            get_SalesUID();
                        })
                        .catch((error) => {
                            console.error('Error inserting data:', error);
                        });
                });


                toast.success('Save success...!')

            } catch (error) {
                console.log('Error :', error)
                toast.error(error.message)
            } finally {
                // reset form values
                // setSalesDetails(salesInitialValue); // clear sales details 
                //clear_SalesItems(); // clear sales Items context
                setIsSubmitting(false); // Unlock the form
            }
            // End save function ...
        } else if (isEdit) {
            try {
                // get old sales items ...
                let invoiceNumber = salesDetails.Invoice_Number;
                const url_getSales = BASE_URL + `/sales/get_sales/${invoiceNumber}`;
                const result_Data = await GET_Api(url_getSales, '');
                console.log('1. get old Sales items', result_Data);

                // Confirm result_Data is an array or convert it
                const Edit_DataArray = Array.isArray(result_Data) ? result_Data : Object.values(result_Data);
                console.log('Edit_DataArray', Edit_DataArray);

                const updateStatus = await SalesUpdate_Service(salesDetails, Edit_DataArray, salesList)
                // console.log('updateStatus', updateStatus);

                if (updateStatus) {
                    // reset forrm values
                    setSalesDetails(salesInitialValue);
                    clear_SalesItems();
                    setIsEdit(false);
                    setIsChecked(false); // NON-GST

                    get_SalesUID();
                }

                toast.success('Update success...!')

            } catch (error) {
                console.log('Error :', error)
                toast.error(error.message)
            } finally {

                setIsSubmitting(false); // Unlock the form
            }
        }


    }



    // -------------- View Report ----------------------------------

    // const [rowEditData, setRowEditData] = useState({});

    // const [isDelete, setIsDelete] = useState(false);
    // const [rowDeleteID, SetRowDeleteID] = useState('');

    // function load data:
    async function load_Data() {
        try {
            // const url_salesReport = BASE_URL + '/sales_detail/load';
            // await GET_Api(url_salesReport, '').then((data) => {
            //     setApiData(data);
            // })

            if (Object.keys(dateRangeNow).length !== 0) {
                const output = await Load_SalesDetails_Service(dateRangeNow);

                console.log('Get Api Data :', output); // Handle success

                // Array.isArray(output) helps prevent errors if the API returns null or an unexpected type.
                if (Array.isArray(output) && output.length >= 1) {
                    setApiData(output);
                } else {
                    setApiData([]);
                }

            }



        } catch (error) {
            console.error('Get Api Data :', error.message); // Handle error
        }
    }


    async function get_SalesUID() {
        try {
            const url_salesUID = BASE_URL + '/uid/get_salesUID';
            const sales_uid = await GET_Api(url_salesUID, '');
            console.log('Get salesUID  :', sales_uid[0].Sales_UID); // Handle success
            setSalesDetails((preve) => {
                return {
                    ...preve, Invoice_Number: (sales_uid[0].Sales_UID + 1)
                }



            })

        } catch (error) {
            console.error('Get salesUID  :', error.message); // Handle error
        }
    }

    async function get_NonGST_SalesUID() {
        try {
            const url_NonGST_salesUID = BASE_URL + '/uid/get_NonGST_salesUID';
            const NonGST_sales_uid = await GET_Api(url_NonGST_salesUID, '');
            console.log('Get NonGST_salesUID  : ', NonGST_sales_uid[0].NonGST_Sales_UID); // Handle success
            setSalesDetails((preve) => {
                return {
                    ...preve, Invoice_Number: (NonGST_sales_uid[0].NonGST_Sales_UID + 1)
                }



            })

        } catch (error) {
            console.error('Get salesUID  :', error.message); // Handle error
        }
    }






    useEffect(() => {
        if (activeTab === 1) {
            load_Data();
            // reset forrm values
            setSalesDetails(salesInitialValue);
            clear_SalesItems();
            setIsEdit(false);
            setIsChecked(false); // NON-GST
        }

        if (activeTab === 2 && !isEdit && !isChecked) {
            get_SalesUID();
        } else if (activeTab === 2 && !isEdit && isChecked) {
            get_NonGST_SalesUID();
        }

        if (activeTab === 2) {
            Load_AllCustomers();
        }

    }, [activeTab, isEdit, dateRangeNow, isChecked])

    // Handle Edit button click
    const handleEdit = async (row) => {
        setActiveTab(2);
        setIsEdit(true);


        if (row.GST_Status === 'NON-GST') {
            setIsChecked(true);
        }

        // setRowEditData(row);
        // console.log('Edit button clicked for:', row);

        setSalesDetails(row);
        setDate(date_strToObject(row['Invoice_Date'])); // set edit date

        try {
            let invoiceNumber = row['Invoice_Number'];

            const url_getSales = BASE_URL + `/sales/get_sales/${invoiceNumber}`;
            const result = await GET_Api(url_getSales, '');
            // console.log(result)
            addToSales(result); // add items to salesContext

        } catch (error) {

        }

    };

    // Handle Delete button click
    // const handleDelete = async (rowId) => {
    async function handleDelete(row) {
        // SetRowDeleteID(row)
        // setIsDelete(true);
        // const filteredData = data.filter((row) => row.Part_id !== rowId);
        // setData(filteredData);

        const shouldDelete = await SweetAlert_Delete();

        if (shouldDelete) {
            console.log('shouldDelete', shouldDelete)

            await SalesDelete_Service(row)
            setSalesDetails(salesInitialValue);
            clear_SalesItems();
            load_Data();
        }
    };


    async function handlePrint(row) {
        navigate('/sales_print', { state: row });
    }




    // Define table columns
    const columns = [
        {
            name: 'Invoice_No',
            selector: row => row.Invoice_Number,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => row.Invoice_Date,
            sortable: true
        },
        {
            name: 'Customer',
            selector: row => row.Customer_Name,
            sortable: true
        },
        {
            name: 'Address',
            selector: row => row.Address,
            sortable: true
        },
        // {
        //     name: 'GSTIN',
        //     selector: row => row.GSTIN,
        //     sortable: true
        // },
        // {
        //     name: 'Taxable_Amount',
        //     selector: row => row.Taxable_Amount,
        //     sortable: true
        // },
        // {
        //     name: 'SGST',
        //     selector: row => row.SGST,
        //     sortable: true
        // },
        // {
        //     name: 'CGST',
        //     selector: row => row.CGST,
        //     sortable: true
        // },
        // {
        //     name: 'IGST',
        //     selector: row => row.IGST,
        //     sortable: true
        // },
        {
            name: 'Total',
            selector: row => row.Total_Amount,
            sortable: true
        },
        {
            name: 'Paid',
            selector: row => row.Amount_Paid,
            sortable: true
        },
        {
            name: 'Balance',
            selector: row => row.Balance_Amount,
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
        // {
        //     name: 'Pay_Status',
        //     selector: row => <span className={`${row.Pay_Status === 'PAID' ? 'bg-green-400' : 'bg-red-500'} px-2 py-1 rounded-full text-white`}>{row.Pay_Status}</span>,
        //     sortable: true
        // },

        {
            name: 'GST_Status',
            selector: row => row.GST_Status,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>
                    <button onClick={() => handlePrint(row)} className='bg-blue-300 p-2 rounded-sm mr-1' title='Print'><span><FaPrint /></span></button>
                    <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1' title='Edit'><span><FaEdit /></span></button>
                    <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm' title='Delete'><RiDeleteBin2Line /></button>
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowOverflow: true, // Ensure the buttons are visible
            button: true, // Makes it clear they are buttons
        }
    ];

    // console.log('apiData', apiData);

    return (
        <>

            <div className="w-full mx-auto p-1">
                {/* Tab navigation */}
                <ul className="flex space-x-4 border-b-2 border-gray-200">
                    <li className={`cursor-pointer p-2 ${activeTab === 1 ? 'text-blue-600 border-blue-600 border-b-2  bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(1)}>
                        View Sales
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        Sales Bill
                    </li>
                </ul>

                {/* Tab content */}
                <div className="mt-4">
                    {activeTab === 1 && (
                        <div className="p-4 bg-green-300 rounded-lg">
                            {/* <h2 className="text-lg font-semibold">Content for Tab 1</h2> */}
                            <div className='flex mb-4'>

                                <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
                            </div>
                            <DataTableVIew tbl_title={''} columns={columns} apiData={apiData} />
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className=" bg-green-300 rounded-lg">
                            {/* <h2 className="text-lg font-semibold">Content for Tab 2</h2> */}
                            <div className='bg-green-600 text-white py-2 px-5' style={{}} >
                                <i className="fa fa-shopping-cart">Sales Entry</i>
                            </div>

                            <div className='p-4'>
                                <div className='border-2 rounded-md   border-gray-400 '>
                                    <form onSubmit={handleSubmit} className=''>

                                        <div className='mt-2 mb-2 p-2  border-b-2 border-gray-400   '>
                                            <label className={`${label_css}`}>Search Existing Customer</label>

                                            <CustomerAutoComplete
                                                autoCompleteData={customerApiData}

                                                setSelectedCustomer={setSelectedCustomer}
                                            />
                                        </div>



                                        <div className=' md:grid-cols-2 border-b-2   border-gray-400'>
                                            {/* <p>col-1</p> */}
                                            <div className=''>
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    <div className='p-2'>
                                                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bill To</label>
                                                        <input
                                                            type="text"
                                                            id="Customer_Name"
                                                            name="Customer_Name"
                                                            onChange={(e) => handleChange(e)}
                                                            value={salesDetails.Customer_Name}
                                                            placeholder="Customer Name"
                                                            required
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                    </div>

                                                    <div className='flex gap-2'>
                                                        <div className='p-2'>
                                                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Invoice Number</label>
                                                            <input
                                                                type="text"
                                                                id="Invoice_Number"
                                                                name="Invoice_Number"
                                                                onChange={(e) => handleChange(e)}
                                                                value={salesDetails.Invoice_Number}
                                                                placeholder=""
                                                                required
                                                                readOnly
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-2/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                        </div>

                                                        <div className='p-2'>
                                                            {/* <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Invoice Date</label> */}
                                                            <DatePicker2 title={'Invoice Date'} date={date} setDate={setDate} />
                                                            {/* <input
                                                    type="text"
                                                    id="first_name"
                                                    placeholder="John"
                                                    required
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-2/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" /> */}
                                                        </div>
                                                    </div>


                                                </div>

                                                <div className="grid gap-6  md:grid-cols-2">
                                                    <div className='p-2'>
                                                        <label htmlFor="Address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                                        <textarea
                                                            id="Address"
                                                            name="Address"
                                                            onChange={(e) => handleChange(e)}
                                                            value={salesDetails.Address}
                                                            rows="3"
                                                            cols="85"
                                                            placeholder="Enter Address"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        ></textarea>

                                                    </div>

                                                </div>

                                                <div className="grid gap-6  md:grid-cols-2">
                                                    <div className='p-2'>
                                                        <label htmlFor="State" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Place</label>
                                                        <select
                                                            id="State"
                                                            name="State"
                                                            onChange={(e) => handleChange(e)}
                                                            value={salesDetails.State}
                                                            required
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                                            <option value="">- Select -</option>
                                                            <option value="PUDUCHERRY">PUDUCHERRY</option>
                                                            <option value="OTHERS">OTHERS</option>
                                                        </select>

                                                    </div>

                                                </div>
                                                <div className="grid grid-cols-4 border-b-2  border-gray-400 gap-6 mb-2 md:grid-cols-4 ">
                                                    <div className='  p-2'>
                                                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">GSTIN</label>
                                                        <input
                                                            type="text"
                                                            id="GSTIN"
                                                            name="GSTIN"
                                                            onChange={(e) => handleChange(e)}
                                                            value={!isChecked ? salesDetails.GSTIN : ''}
                                                            placeholder="Enter GSTIN No."
                                                            // required
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

                                                        <div class="flex flex-nowrap mt-3">
                                                            <input
                                                                type="checkbox"
                                                                id="checkbox_GST"
                                                                name="checkbox_GST"
                                                                checked={isChecked}
                                                                onChange={(e) => setIsChecked(!isChecked)}
                                                                class="icheck checkbox mr-4" />
                                                            <label for="checkbox_GST" className="flex flex-nowrap" >NoN-GST</label>
                                                        </div>
                                                    </div>

                                                    <div className='mt-2'>
                                                        <label htmlFor="Model" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
                                                        <input
                                                            type="text"
                                                            id="Model"
                                                            name="Model"
                                                            onChange={(e) => handleChange(e)}
                                                            value={salesDetails.Model}
                                                            placeholder="Enter Model No."
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                    </div>

                                                    <div className='mt-2'>
                                                        <label htmlFor="Serial" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Serial</label>
                                                        <input
                                                            type="text"
                                                            id="Serial"
                                                            name="Serial"
                                                            onChange={(e) => handleChange(e)}
                                                            value={salesDetails.Serial}
                                                            placeholder="Enter Serial No."
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                    </div>

                                                    <div className='mt-2'>
                                                        <label htmlFor="Note" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Note</label>
                                                        <input
                                                            type="text"
                                                            id="Note"
                                                            name="Note"
                                                            onChange={(e) => handleChange(e)}
                                                            value={salesDetails.Note}
                                                            placeholder="Enter Note."
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                    </div>

                                                </div>
                                            </div>





                                            <div className='overflow-x-auto   '>
                                                <div className='flex     items-center '>
                                                    <span className='px-2 pr-2    '>Search </span>
                                                    <SalesAutoComplete
                                                        Invoice_Number={salesDetails.Invoice_Number}
                                                        setRowItems={setRowItems}
                                                        inputName="txt_ItemName_1"
                                                        txt_css={`${tbl_input} w-full`} />
                                                </div>

                                                <table className='w-full '>
                                                    <thead className={tbl_thead_tr}>
                                                        <tr>
                                                            <th className={`${tbl_thead_th} w-12`}>#</th>
                                                            <th className={`${tbl_thead_th} `}>ItemCode</th>
                                                            <th className={`${tbl_thead_th} w-full`}>ItemName</th>
                                                            <th className={`${tbl_thead_th} w-60`}>HSN</th>
                                                            <th className={`${tbl_thead_th}`}>QTY</th>
                                                            <th className={`${tbl_thead_th}`}>PRICE/ITEM</th>
                                                            <th className={`${tbl_thead_th}`}> DISCOUNT</th>
                                                            <th className={`${tbl_thead_th}`}>TAX</th>
                                                            <th className={`${tbl_thead_th}`}>AMOUNT</th>
                                                            <th className={`${tbl_thead_th}`}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            salesList.length <= 0 ?
                                                                <tr id="1" className='border-b-2 border-l-2 border-r-2 border-gray-300 '>
                                                                    <td className={`${tbl_tbody_td}`}><input type="text" id="sl" name="sl" defaultValue="1" readOnly={true} className={`${tbl_input} w-12`} autoComplete="off" /></td>
                                                                    <td className={`${tbl_tbody_td}`}><input type="text" id="ItemCode" name="ItemCode" defaultValue="" readOnly={true} className={`${tbl_input} w-full`} placeholder="Code" autoComplete="off" /></td>
                                                                    <td className={`${tbl_tbody_td}`}><input type="text" id="ItemName" name="ItemName" defaultValue="" readOnly={true} className={`${tbl_input} w-full`} placeholder="Desc." autoComplete="off" /></td>
                                                                    <td className={`${tbl_tbody_td}`}><input type="text" id="HSNcode" name="HSNcode" defaultValue="" readOnly={true} className={`${tbl_input} w-18`} placeholder="HSN Code" autoComplete="off" /></td>
                                                                    <td className={`${tbl_tbody_td}`}><input type="number" id="Qty" name="Qty" defaultValue="0" readOnly={true} className={`${tbl_input} w-16`} autoComplete="off" /></td>
                                                                    <td className={`${tbl_tbody_td}`}><input type="text" id="Price" name="Price" defaultValue="0.00" readOnly={true} className={`${tbl_input} w-24`} autoComplete="off" /></td>
                                                                    <td className={`${tbl_tbody_td}`}>
                                                                        <div className='flex '>
                                                                            <input type="text" id="DiscountPercent" name="DiscountPercent" defaultValue="0" readOnly={true} className={`${tbl_input} w-16 mr-2 mb-1`} autoComplete="off" />  %
                                                                        </div>


                                                                        <input type="text" id="DiscountAmount" name="DiscountAmount" defaultValue="0.00" readOnly="" className={`${tbl_input} w-24`} autoComplete="off" />
                                                                    </td>
                                                                    <td className={`${tbl_tbody_td}`}>
                                                                        <div className='flex '>
                                                                            <input type="text" id="TaxPer" name="TaxPer" defaultValue="0" readOnly={true} className={`${tbl_input} w-16 mr-2 mb-1`} autoComplete="off" /> %
                                                                        </div>

                                                                        <input type="text" id="TaxAmt" name="TaxAmt" defaultValue="0.00" readOnly="" className={`${tbl_input} w-24`} autoComplete="off" />
                                                                    </td>

                                                                    <td className={`${tbl_tbody_td}`}><input type="text" id="TaxAmt" name="TaxAmt" defaultValue="0.00" readOnly="" className={`${tbl_input} w-24`} autoComplete="off" /></td>
                                                                    <td className='flex flex-col text-center px-2 py-10 '><button type="button" id="1" className="bg-red-500 text-white py-1 px-1 rounded-full btn-danger disabled btn-sm btn_remove_row">X</button></td>
                                                                </tr>
                                                                :
                                                                <SalesTableRow />
                                                        }
                                                    </tbody>
                                                </table>
                                            </div >

                                            <div className=' p-1 border-gray-400'>
                                                <div className='    mt-3 grid grid-cols-3  p-3'>

                                                    <div className="col-sm-6" ></div>
                                                    <div className="col-sm-6" ></div>
                                                    <div className="w-full text-left " >
                                                        <div className=" md:flex md:items-center mb-6  ">
                                                            <div className='md:w-1/3'>
                                                                <label htmlFor="Taxable_Amount" className="mr-7">Taxable Amount</label>
                                                            </div>
                                                            <div className='md:w-2/3'>
                                                                <input type="text"
                                                                    id="Taxable_Amount"
                                                                    name="Taxable_Amount"

                                                                    onChange={(e) => handleChange(e)}
                                                                    value={salesDetails.Taxable_Amount}
                                                                    className={`${tbl_input} w-52`} required="" />
                                                            </div>

                                                        </div>


                                                        <div className="md:flex md:items-center mb-6 ">
                                                            <div className='md:w-1/3'>
                                                                <label htmlFor="SGST" className="mr-10">SGST@%</label>
                                                            </div>

                                                            <div className='md:w-2/3'>
                                                                <input type="text"
                                                                    id="SGST"
                                                                    name="SGST"
                                                                    onChange={(e) => handleChange(e)}
                                                                    value={salesDetails.SGST}
                                                                    className={`${tbl_input} w-52`} readOnly="" />
                                                            </div>

                                                        </div>


                                                        <div className="md:flex md:items-center mb-6">
                                                            <div className='md:w-1/3'>
                                                                <label htmlFor="CGST" className="col-sm-7 col-form-label">CGST@%</label>
                                                            </div>
                                                            <div className='md:w-2/3'>
                                                                <input type="text"
                                                                    id="CGST"
                                                                    name="CGST"
                                                                    onChange={(e) => handleChange(e)}
                                                                    value={salesDetails.CGST}
                                                                    className={`${tbl_input} w-52`} readOnly="" />
                                                            </div>

                                                        </div>

                                                        <div className="md:flex md:items-center mb-6">
                                                            <div className='md:w-1/3'>
                                                                <label htmlFor="IGST" className="col-sm-7 col-form-label">IGST@%</label>
                                                            </div>

                                                            <div className='md:w-2/3'>
                                                                <input type="text"
                                                                    id="IGST"
                                                                    name="IGST"
                                                                    onChange={(e) => handleChange(e)}
                                                                    value={salesDetails.IGST}
                                                                    className={`${tbl_input} w-52`} readOnly="" />
                                                            </div>
                                                        </div>

                                                        <hr style={{ borderColor: "#28a745" }} />


                                                        <div className="md:flex md:items-center mb-3 mt-3">
                                                            <div className='md:w-1/3'>
                                                                <label htmlFor="Total_Amount" className="font-bold">Total Amount</label>
                                                            </div>

                                                            <div className='md:w-2/3'>
                                                                <input type="text"
                                                                    id="Total_Amount"
                                                                    name="Total_Amount"
                                                                    onChange={(e) => handleChange(e)}
                                                                    value={salesDetails.Total_Amount}
                                                                    className={`${tbl_input} w-52`} required="" readOnly="" />
                                                            </div>

                                                        </div>

                                                        <hr style={{ borderColor: "#28a745" }} />

                                                        <div className="md:flex md:items-center mb-3 mt-3">
                                                            <div className='md:w-sm pr-6'>
                                                                <label htmlFor="Amount_Paid" className=" ">Amount Paid</label>
                                                            </div>

                                                            <div className='md:w-sm'>
                                                                <input type="text"
                                                                    id="Amount_Paid"
                                                                    name="Amount_Paid"
                                                                    onChange={(e) => handleChange(e)}
                                                                    // onBlur={(e)=>handleBlur(e)}
                                                                    value={salesDetails.Amount_Paid}
                                                                    className={`${tbl_input} w-52`} required="" />
                                                            </div>


                                                            <select id="Pay_Mode" name="Pay_Mode" value={salesDetails.Pay_Mode} onChange={(e) => handleChange(e)} className={`${tbl_input} w-42`} >
                                                                <option defaultValue="">-- Select --</option>
                                                                <option value="Cash">Cash</option>
                                                                <option value="Cheque">Cheque</option>
                                                                <option value="Online">Online</option>
                                                            </select>
                                                        </div>


                                                        <div className="md:flex md:items-center mb-3 mt-3">
                                                            <div className='md:w-sm pr-8'>
                                                                <label htmlFor="Balance_Amount" className="  text-wrap">Balance Amount</label>
                                                            </div>
                                                            <div className='w-full'>
                                                                <input type="text"
                                                                    id="Balance_Amount"
                                                                    name="Balance_Amount"
                                                                    onChange={(e) => handleChange(e)}
                                                                    value={salesDetails.Balance_Amount}
                                                                    className={`${tbl_input} w-52`} readOnly="" />
                                                            </div>

                                                            {/* <!--<i className="fas fa-rupee-sign" style="margin-top:8px;padding-right:8px;"></i>--> */}


                                                        </div>

                                                        <div className="md:flex md:items-center mb-3 mt-3">
                                                            <div className='md:w-sm pr-11'>
                                                                <label htmlFor="Pay_Note" className="col-sm-3 col-form-label">Payment Note</label>
                                                            </div>
                                                            <div className='w-full'>
                                                                <input type="text"
                                                                    id="Pay_Note"
                                                                    name="Pay_Note"
                                                                    onChange={(e) => handleChange(e)}
                                                                    value={salesDetails.Pay_Note}
                                                                    placeholder='Payment Details'
                                                                    className={`${tbl_input} w-full`} />
                                                            </div>



                                                        </div>




                                                        <div className="row nopadding">
                                                            <button type="submit"
                                                                disabled={isSubmitting}
                                                                className={` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-full  mt-4  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>

                                                            {/* <button type="submit" className="w-full bg-green-400 p-3 text-white rounded-lg hover:bg-green-600" id="btn_Save" name="btn_Save" >Save</button> */}
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div >
                                    </form >
                                </div >
                            </div>
                        </div >

                    )}
                </div>
            </div>



        </>
    )
}
