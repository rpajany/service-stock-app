import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { POST_Api, GET_Api, insert_Api } from '../services/ApiService';
import { ApiContext } from '../context/ApiProvider';
import { Modal, DataTableVIew, SalesAutoComplete, DatePicker2, ReactDateRangePicker, CustomerAutoComplete, Mail } from '../components';
import { Get_BaseUrl, SweetAlert_Delete, date_strToObject, date_objToFormat } from '../helpers/custom';
import { useBaseUrl, Load_Quote_Service, SaveQuote_Service, Get_QuoteTerms_Service, UpdateQuote_Service, DeleteQuote_Service, Update_QuoteStatus_Service, load_Customer_Service } from '../services/QuoteService';

import moment from 'moment';
import { FaEdit, FaPrint } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";


// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
const btn_Edit = 'bg-red-500 text-white py-1 px-1 rounded-full';

export const Quotation = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);
    BASE_URL = selectedApi;

    const [activeTab, setActiveTab] = useState(1);
    const [date, setDate] = useState(new Date()); // date object  
    const [tableData, setTableData] = useState([]);
    const [showTableData, setShowTableData] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [isChecked, setIsChecked] = useState(false)
    const [dateRangeNow, setDateRangeNow] = useState({});

    const [statusModel, setStatusModel] = useState(false);
    const [statusData, setStatusData] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    const [showMail, setShowMail] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null)
    const navigate = useNavigate();

    let row_id = 0;
    let totalAmount = 0.00;

    const quoteData_InitialValue = {
        id: '',
        Quot_Number: '',
        Description: '',
        HSN_Code: '',
        Qty: 1,
        Rate: 0.00,
        Amount: 0.00,
    }

    const [quoteData, setQuotData] = useState(quoteData_InitialValue);

    const quoteDetails_InitialValue = {
        Quot_Number: '',
        Date: '',
        Cust_id: "",
        Company: '',
        Address: '',
        Contact: '',
        Taxable_Amount: 0.00,
        Tax_Perc: 18,
        TaxAmount: 0.00,
        Total: 0.00,
        Status: 'OPEN',
        Model: '',
        Serial: '',
        Job_No: ''
        // Tax_Terms: '',
        // Payment_Terms: '',
        // Validity_Terms: '',
        // Delivery_Terms: '',
    }

    const [quoteDetails, setQuotDetails] = useState(quoteDetails_InitialValue);
    // const [quoteTerms, setQuoteTerms] = useState([]);

    const [customerApiData, setCustomerApiData] = useState({});
    const [rowItems, setRowItems] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState([]); // selected customer

    console.log('rowItems :', rowItems)

    useEffect(() => {
        if (selectedCustomer) {
            setQuotDetails((prev) => ({
                ...prev,
                Company: selectedCustomer.Customer_Name || "",
                Cust_id: selectedCustomer.Cust_id || "",
                Address: selectedCustomer.Address || ""
            }))
        }


    }, [selectedCustomer])

    const Load_AllCustomers = async () => {
        try {
            const result = await load_Customer_Service();
            setCustomerApiData(result);
        } catch (error) {
            console.log('Load_AllCustomers Error :', error)
        }

        // const { Cust_id } = result;
        // console.log('customer :', Cust_id)

    }




    const handleChange_checkbox = (e) => {
        setIsChecked(!isChecked);
    }


    // input QuotDetails change function ...
    const handleChange_QuotDetails = (e) => {
        const { name, value } = e.target
        setQuotDetails((preve) => {
            return { ...preve, [name]: value }
        })
    }


    // input QuotDetails change function ...
    const handleChange_QuotData = (e) => {
        const { name, value } = e.target
        setQuotData((preve) => {
            return { ...preve, [name]: value }
        })
    }

    // add button click
    const handleClick_AddItem = (e) => {


        const dataNew = {
            ...quoteData,
            id: tableData.length + 1,
            Quot_Number: quoteDetails.Quot_Number,
            Amount: (quoteData.Qty * quoteData.Rate)
        }

        setTableData(tableData.concat(dataNew)) // add row items

        setQuotData(quoteData_InitialValue);
        setShowTableData(true)
        const total = calculateTotal();
        totalAmount = total;
    }




    // console.log('tableData', tableData)
    console.log('quoteDetails', quoteDetails)
    // console.log('quoteData', quoteData)
    // console.log('type.of', typeof (tableData))


    const calculateTotal = useCallback(() => {
        let itemTotal = 0;
        tableData.forEach(item => {

            itemTotal += item.Amount;
        });

        // setQuotDetails((preve) => ({
        //     ...preve,
        //     Total: itemTotal
        // }))
        // setQuotDetails(quoteDetails => ({ ...quoteDetails, Total: itemTotal }));

        // setQuotDetails((preve) => {
        //     return {
        //         ...preve,
        //         Total: itemTotal
        //     }
        // })

        return itemTotal;
    }, [tableData])  // Only re-create calculateTotal if numbers array changes

    useEffect(() => {
        const subTotal = calculateTotal();

        let taxper = parseFloat(quoteDetails.Tax_Perc);
        let taxAmt = (subTotal * taxper / 100);
        let totalAmt = subTotal + taxAmt


        setQuotDetails((preve) => {
            return {
                ...preve,
                Date: moment(date).format('DD-MM-YYYY'),
                Taxable_Amount: subTotal,
                TaxAmount: taxAmt,
                Total: totalAmt
            }
        })
    }, [calculateTotal, date])

    const handleRowDelete = (id) => {
        const updatedQuoteList = tableData.filter((current) => current.id !== id);
        setTableData(updatedQuoteList);
    }


    async function get_QuoteUID() {
        try {

            // load Quote terms ....
            const quoteTerms = await Get_QuoteTerms_Service();



            const url_quoteUID = BASE_URL + '/uid/get_quoteUID';
            const quote_uid = await GET_Api(url_quoteUID, '');
            // console.log('Get quoteUID  :', quote_uid[0].Quotation_UID); 
            setQuotDetails((preve) => {
                return {
                    ...preve,
                    Quot_Number: (quote_uid[0].Quotation_UID + 1),
                    Not_InScope: quoteTerms[0].Not_InScope, // add all quote terms 
                    Tax_Terms: quoteTerms[0].Tax_Terms,
                    Payment_Terms: quoteTerms[0].Payment_Terms,
                    Validity_Terms: quoteTerms[0].Validity_Terms,
                    Delivery_Terms: quoteTerms[0].Delivery_Terms,
                    Scope: quoteTerms[0].Scope
                }
            })

        } catch (error) {
            console.error('Get quoteUID  :', error.message); // Handle error
        }
    }

    async function Update_QuoteUID() {
        try {
            const newUID = quoteDetails.Quot_Number;
            console.log('newUID', newUID)
            const url_updateQuoteUID = BASE_URL + `/uid/update_quoteUID/1`;
            const output = await POST_Api(url_updateQuoteUID, '', { Quotation_UID: newUID });
            console.log('Update_QuoteUID :', output);
        } catch (error) {
            console.error('Update_QuoteUID  :', error.message); // Handle error
        }
    }

    // function load data:
    async function load_Data() {
        try {
            // const url_QuoteReport = BASE_URL + '/quotation_detail/load';
            // await GET_Api(url_QuoteReport, '').then((data) => {
            //     setApiData(data);
            //     // console.log('data', data)
            // })

            if (Object.keys(dateRangeNow).length !== 0) {
                const output = await Load_Quote_Service(dateRangeNow);

                // console.log('Get Api Data :', result); // Handle success
                setApiData(output);
            }


        } catch (error) {
            console.error('Get Api Data :', error.message); // Handle error
        }
    }

    useEffect(() => {

        if (activeTab === 1) {
            load_Data();
            // clear form ...
            setQuotDetails(quoteDetails_InitialValue);
            setQuotData(quoteData_InitialValue);
            setTableData([]);
            setShowTableData(false);
            setIsChecked(false);
            setIsEdit(false);
            get_QuoteUID(); // get UID
        }

        if (activeTab === 2 && !isEdit) {
            get_QuoteUID();


        }

        if (activeTab === 2) {
            Load_AllCustomers();
        }


    }, [activeTab, isEdit, dateRangeNow])


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        try {

            if (!isEdit) {  // save function ...
                const result = await SaveQuote_Service(quoteDetails, tableData);
                if (result) {
                    await Update_QuoteUID(); // update the UID              
                    setQuotDetails(quoteDetails_InitialValue);
                    setQuotData(quoteData_InitialValue);
                    setTableData([]);
                    setShowTableData(false);
                    setIsChecked(false);
                    await get_QuoteUID(); // get UID

                }
            } else if (isEdit) {


                // delete  old Qutation Details & Data
                const result = await DeleteQuote_Service(quoteDetails); // delete Quatation details and data by Quote_Number
                console.log('1. Delate old Qutation Details & Data...', result);

                // save fresh data
                const result2 = await SaveQuote_Service(quoteDetails, tableData);
                if (result2) {

                    setQuotDetails(quoteDetails_InitialValue);
                    setQuotData(quoteData_InitialValue);
                    setTableData([]);
                    setShowTableData(false);
                    setIsChecked(false);
                    setIsEdit(false);
                    await get_QuoteUID(); // get UID

                }
            }

        } catch (error) {
            console.log('Error :', error)
        } finally {
            setIsSubmitting(false); // Unlock the form
        }

    }






    const handleEdit = async (row) => {
        setActiveTab(2);
        setIsEdit(true);
        setQuotDetails(row) // set quote details
        setDate(date_strToObject(row['Date'])); // set edit date

        try {
            let quoteNumber = row['Quot_Number'];
            console.log(quoteNumber)
            const url_getSales = BASE_URL + `/quotation/get_quotation/${quoteNumber}`;
            const result = await GET_Api(url_getSales, '');
            console.log(result)
            setTableData(result); // add items to salesContext
            setShowTableData(true)
        } catch (error) {

        }

    }

    const handleDelete = async (row) => {
        const shouldDelete = await SweetAlert_Delete();

        if (shouldDelete) {
            const result = await DeleteQuote_Service(row);
            if (result) {
                await load_Data();
            }

        }
    }

    const handlePrint = (row) => {
        navigate('/quote_print', { state: row });
    }

    // send mail
    const handleMail = (row) => {
        setSelectedQuote(row);
        setShowMail(!showMail)
    }

    const handleStatusClick = (row) => {
        console.log('handleStatusClick :', row)
        setStatusModel(true);
        setStatusData((preve) => ({
            ...preve,
            id: row.id,
            Quot_Number: row.Quot_Number


        }


        ));
    }


    // console.log('statusData', statusData)

    const handle_UpdateStatusChange = (e) => {

        setStatusData((preve) => ({
            ...preve,

            Status: e.target.value


        }
        ));
    }

    const handel_StatusFormSubmit = async (e) => {
        e.preventDefault();


        const response = await Update_QuoteStatus_Service(statusData);
        console.log('response', response);

        if (response) {
            console.log('response', response)
            setStatusModel(false);
            await load_Data();
        }

    }


    // Define table columns
    const columns = [
        {
            name: 'Quot_No',
            selector: row => row.Quot_Number,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => row.Date,
            sortable: true
        },
        {
            name: 'Company',
            selector: row => row.Company,
            sortable: true
        },
        {
            name: 'Contact',
            selector: row => row.Contact,
            sortable: true
        },
        {
            name: 'Total',
            selector: row => row.Total,
            sortable: true
        },
        {
            name: 'Job_No',
            selector: row => row.Job_No,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => <span onClick={() => handleStatusClick(row)} className={`p-4  rounded-full text-white  font-extralight hover:cursor-pointer ${row.Status === 'CLOSED' ? 'bg-green-400' :
                row.Status === 'PENDING' ? 'bg-blue-400' :
                    row.Status === 'REJECTED' ? 'bg-orange-400' :
                        row.Status === 'CANCEL' ? 'bg-yellow-400' :
                            row.Status === 'OPEN' ? 'bg-red-400' :
                                'bg-gray-400' // Default color
                }`}>{row.Status}</span>,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>
                    <button onClick={() => handlePrint(row)} className='bg-blue-300 p-2 rounded-sm mr-1' title='Print'><span><FaPrint /></span></button>
                    <button onClick={() => handleMail(row)} className='bg-green-500 p-2 rounded-sm' title='Mail'><IoMailOutline /></button>
                    <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1' title='Edit'><span><FaEdit /></span></button>
                    <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm' title='Delete'><RiDeleteBin2Line /></button>

                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowOverflow: true, // Ensure the buttons are visible
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
                        View Quot
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        Quotation
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

                            {/* {statusModel && (
                                <div className=' relative z-60'>
                                    Show MOdel
                                </div>

                            )} */}

                            <Modal isVisible={statusModel} onClose={() => setStatusModel(false)}>
                                <h2 className='bg-blue-400 text-white px-3 py-2 w-30'>Update Quatation Status</h2>
                                <div className='mt-4'>
                                    <form onSubmit={handel_StatusFormSubmit}>


                                        <div className='mt-4 mb-4'>
                                            <label htmlFor='Quot_No'>Quote No.</label>
                                            <input type="text"
                                                id="Quot_No"
                                                name="Quot_No"
                                                value={statusData.Quot_Number}
                                                required
                                                readOnly
                                                className={`${input_css} w-1/4`}
                                            />
                                        </div>

                                        <label htmlFor="Status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Change Status</label>
                                        <select
                                            id="Status"
                                            name="Status"
                                            onChange={(e) => handle_UpdateStatusChange(e)}
                                            // value={salesDetails.State}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                            <option value="">- Select -</option>
                                            <option value="CLOSED">CLOSED</option>
                                            <option value="PENDING">PENDING</option>
                                            <option value="REJECTED">REJECTED</option>
                                            <option value="CANCEL">CANCEL</option>
                                            <option value="OPEN">OPEN</option>
                                        </select>


                                        <button type="submit" class="mt-4 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Update</button>
                                    </form>
                                </div>
                            </Modal>

                            <DataTableVIew tbl_title={''} columns={columns} apiData={apiData} />
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="p-4 bg-blue-300 rounded-lg">
                            <form onSubmit={handleSubmit} className=''>
                                {/*  Content for Tab 2  */}
                                <div className='flex flex-col  items-center mb-3'>
                                    <span className='text-xl font-semibold'>Quotation Entry</span>
                                </div>
                                <hr></hr>

                                <div className='mb-4 mt-2'>
                                    <p>Search Customer</p>
                                    <CustomerAutoComplete
                                        autoCompleteData={customerApiData}

                                        setSelectedCustomer={setSelectedCustomer}
                                    />

                                </div>

                                <hr></hr>

                                <div class="columns-3 gap-8 mt-2">

                                    <div className='w-full'>
                                        <label htmlFor="Company" className={`${label_css} `}>Customer/Company</label>
                                        <input type="text"
                                            id="Company"
                                            name="Company"
                                            onChange={(e) => handleChange_QuotDetails(e)}
                                            value={quoteDetails.Company}
                                            placeholder="Enter Customer/Company Name"
                                            required
                                            className={`${input_css} w-full`} />


                                    </div>
                                    <div className=' '>
                                        <label htmlFor='' className={`${label_css} `}>Quote No:</label>
                                        <input
                                            type="text"
                                            id=""
                                            name="r"
                                            onChange={(e) => handleChange_QuotDetails(e)}
                                            value={quoteDetails.Quot_Number}
                                            placeholder=''
                                            required
                                            readOnly
                                            className={`${input_css} cursor-not-allowed w-1/2`} />
                                    </div>

                                    <div>
                                        {/* <label className={`${label_css} `}>Date:</label> */}
                                        <DatePicker2 title={'Date:'} date={date} setDate={setDate} />
                                        {/* <input
                                            type="text"
                                            id=""
                                            name=""
                                            placeholder=''
                                            className={`${input_css}`} /> */}
                                    </div>

                                </div>

                                <div className='grid grid-cols-1 mt-2'>
                                    <div className='w-1/2'>
                                        <label className={`${label_css} `}>Address</label>
                                        <textarea
                                            id="Address"
                                            name="Address"
                                            onChange={(e) => handleChange_QuotDetails(e)}
                                            value={quoteDetails.Address}
                                            rows="3"
                                            cols="85"
                                            placeholder="Enter Address"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className='flex  gap-4 mt-2'>
                                    <div className='w-1/2'>
                                        <label htmlFor="Contact" className={`${label_css} `}>Kind Attn :</label>
                                        <input type="text"
                                            id="Contact"
                                            name="Contact"
                                            onChange={(e) => handleChange_QuotDetails(e)}
                                            value={quoteDetails.Contact}
                                            placeholder="Contact Person Name"
                                            required
                                            className={`${input_css} w-full`} />
                                    </div>

                                    <div className='w-60'>
                                        <label htmlFor="Model" className={`${label_css} `}>Model No.</label>
                                        <input type="text"
                                            id="Model"
                                            name="Model"
                                            onChange={(e) => handleChange_QuotDetails(e)}
                                            value={quoteDetails.Model}
                                            placeholder="Enter Model No."
                                            required
                                            className={`${input_css} w-full`} />
                                    </div>

                                    <div className='w-60'>
                                        <label htmlFor="Serial" className={`${label_css} `}>Serial No.</label>
                                        <input type="text"
                                            id="Serial"
                                            name="Serial"
                                            onChange={(e) => handleChange_QuotDetails(e)}
                                            value={quoteDetails.Serial}
                                            placeholder="Enter Serial No."
                                            required
                                            className={`${input_css} w-full`} />
                                    </div>

                                    <div className='w-60'>
                                        <label htmlFor="Job_No" className={`${label_css} `}>Job No</label>
                                        <input type="text"
                                            id="Job_No"
                                            name="Job_No"
                                            onChange={(e) => handleChange_QuotDetails(e)}
                                            value={quoteDetails.Job_No}
                                            placeholder="Enter Job No."
                                            required
                                            className={`${input_css} w-full`} />
                                    </div>

                                </div>

                                <hr className='mt-4'></hr>

                                <div className='grid gap-8 md:grid-cols-2 mt-2'>
                                    <div className=' '>





                                        <b><h5 className='mt-3'>Add Quatation Item :</h5></b>

                                        <div className="mt-3">
                                            <label htmlFor="Description" className={`${label_css} `}>Desc</label>
                                            <textarea
                                                id="Description"
                                                name="Description"
                                                onChange={(e) => handleChange_QuotData(e)}
                                                value={quoteData.Description}
                                                placeholder="Quotation Item  Detials .."
                                                className={`${input_css} w-full`} rows="3"></textarea>
                                        </div>



                                    </div>

                                    <div className='flex         gap-4'>



                                    </div>




                                </div>



                                <div className="grid gap-4 md:grid-cols-4 mb-4">
                                    <div className="col-md-2">
                                        <label htmlFor="Qty" className={`${label_css} `}>Qty</label>
                                        <input
                                            type="number"
                                            id="Qty"
                                            name="Qty"
                                            onChange={(e) => handleChange_QuotData(e)}
                                            value={quoteData.Qty}
                                            min="1"
                                            className={`${input_css} w-full`} required="" />
                                    </div>

                                    <div className="col-md-2">
                                        <label htmlFor="Rate" className={`${label_css} `}>Rate</label>
                                        <input
                                            type="text"
                                            id="Rate"
                                            name="Rate"
                                            onChange={(e) => handleChange_QuotData(e)}
                                            value={quoteData.Rate}
                                            placeholder="0.00"
                                            className={`${input_css} w-full`} />
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor="HSN_Code" className={`${label_css} `}>HSN Code</label>
                                        <input
                                            type="text"
                                            id="HSN_Code"
                                            name="HSN_Code"
                                            onChange={(e) => handleChange_QuotData(e)}
                                            value={quoteData.HSN_Code}
                                            className={`${input_css} w-full`} />
                                    </div>


                                    <div className="col-md-3 mt-8"  >
                                        {/* <label htmlFor="txt_EntryHSNCode" className={`${label_css} `}></label> */}
                                        <button
                                            type="button"
                                            id="btn_AddItem"
                                            name="btn_AddItem"
                                            onClick={(e) => handleClick_AddItem(e)}
                                            className="bg-yellow-300 text-black px-3 py-1 rounded-xl mt- hover:bg-yellow-200"  ><i className="fa fa-plus-circle"></i> Add Items </button>
                                    </div>


                                    {/* Table add items */}

                                    {showTableData && (


                                        <div id="div_addQuatation_Items" style={{ marginTop: '10px', display: 'unset' }}>


                                            <br></br>
                                            <span><b>

                                                <h5>View Quatation Items :</h5>
                                            </b></span>

                                            <div className='mb-8'>
                                                <table className="border-2  mb-4" id="table_addQuatation_Items" width="50%">
                                                    <thead className="" style={{ backgroundColor: '#55acee', color: 'white' }}>
                                                        <tr>
                                                            <th width="5px">#</th>
                                                            <th width="400px">Description</th>
                                                            <th width="50px">HSN Code</th>
                                                            <th width="15px">Qty</th>
                                                            <th width="25px">Rate</th>
                                                            <th width="25px">Amount</th>
                                                            <th width="5px">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="www">

                                                        {tableData.length >= 1 && tableData.map((item, index) => (

                                                            <tr key={item.id} className='border-b-2 py-4 mt-2'>
                                                                <td><input id='id' name='id' value={index + 1} className={`${input_css} w-12 mr-1`} /></td>
                                                                <td><input type="text" id="txt_ItemDesc_1" name="txt_ItemDesc_1" value={item.Description} className={`${input_css}  mr-1`} readOnly="" /></td>
                                                                <td><input type="text" id="txt_HsnCode_1" name="txt_HsnCode_1" value={item.HSN_Code} className={`${input_css}  mr-1`} readOnly="" /></td>
                                                                <td><input type="text" id="txt_Qty_1" name="txt_Qty_1" value={item.Qty} className={`${input_css}  w-12  mr-1`} readOnly="" /></td>
                                                                <td><input type="text" id="txt_Rate_1" name="txt_Rate_1" value={item.Rate} className={`${input_css}  mr-1`} readOnly="" /></td>
                                                                <td><input type="text" id="txt_Amount_1" name="txt_Amount_1" value={(item.Qty * item.Rate).toFixed(2)} className={`${input_css}  mr-1`} readOnly="" /></td>
                                                                <td><button type="button" id={item.id} onClick={() => handleRowDelete(item.id)} className={`${btn_Edit} px-4 py-0`}><i className="fa fa-times">X</i></button></td>
                                                            </tr>


                                                        ))


                                                        }
                                                    </tbody>

                                                    <tbody><tr className=''>

                                                        <th colSpan="5" style={{ textAlign: 'right' }} className='pr-4 '>Taxable Amount</th>
                                                        <th>
                                                            <input type="text"
                                                                id="Taxable_Amount"
                                                                name="Taxable_Amount"

                                                                value={quoteDetails.Taxable_Amount.toFixed(2)}
                                                                readOnly
                                                                className={`${input_css} w-full `} /> </th>
                                                        <th colSpan="2">

                                                        </th>


                                                    </tr>
                                                        <tr className=' '>
                                                            <th colSpan="5" style={{ textAlign: 'right' }} className=' pr-4 text-nowrap items-center'>Tax %

                                                            </th>



                                                            <th className='flex'>
                                                                <input
                                                                    type='text'
                                                                    id="Tax_Perc"
                                                                    name="Tax_Perc"
                                                                    onChange={(e) => handleChange_QuotDetails(e)}
                                                                    value={quoteDetails.Tax_Perc}
                                                                    className={`${input_css} w-16 `}
                                                                />
                                                                <input
                                                                    type='text'
                                                                    id="TaxAmount"
                                                                    name="TaxAmount"

                                                                    value={quoteDetails.TaxAmount.toFixed(2)}
                                                                    readOnly
                                                                    className={`${input_css} w-2/3 `}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr >
                                                            <th colSpan="5" style={{ textAlign: 'right' }} className='pr-4 '>Total</th>

                                                            <th>
                                                                <input
                                                                    type='text'
                                                                    id="Total"
                                                                    name="Total"

                                                                    value={quoteDetails.Total.toFixed(2)}
                                                                    readOnly
                                                                    className={`${input_css}   `}
                                                                    style={{ width: '182px' }}
                                                                />
                                                            </th>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    )}

                                </div>

                                <hr></hr>

                                <div className="mt-3">
                                    <input
                                        type="checkbox"
                                        id="checkbox_Terms"
                                        name="checkbox_Terms"
                                        checked={isChecked}
                                        onChange={(e) => handleChange_checkbox(e)}
                                        className="icheck checkbox mr-4" />
                                    <label htmlFor="checkbox_Terms" className=''>Edit Terms
                                    </label>
                                </div>

                                <div className="mb-4 w-3/4"  >


                                    <br></br>
                                    <span><b>

                                        <h5>Not in scope :</h5>
                                    </b></span>

                                    <div className="form-group row">
                                        <label htmlFor="Not_InScope" className="col-sm-1"></label>
                                        <div className="col-sm-11">
                                            <textarea
                                                id="Not_InScope"
                                                name="Not_InScope"
                                                onChange={(e) => handleChange_QuotDetails(e)}
                                                value={!isChecked ? quoteDetails.Not_InScope : null}
                                                disabled={!isChecked ? 'disabled' : ''}
                                                // readOnly
                                                placeholder="Not in scope text.."

                                                className={`${input_css} w-full`} rows="2" ></textarea>
                                        </div>
                                    </div>
                                    <br></br>
                                    <span><b>

                                        <h5>Terms and Conditions :</h5>
                                    </b></span>

                                    <div className="form-group row">
                                        <label htmlFor="Tax_Terms" className="col-sm-1 col-form-label">Taxes :</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                id="Tax_Terms"
                                                name="Tax_Terms"
                                                onChange={(e) => handleChange_QuotDetails(e)}
                                                value={!isChecked ? quoteDetails.Tax_Terms : null}

                                                disabled={!isChecked ? 'disabled' : ''}
                                                placeholder="Tax Terms text.."
                                                className={`${input_css} w-full`} rows="2" />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="Payment_Terms" className="col-sm-1 col-form-label">Payment :</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                id="Payment_Terms"
                                                name="Payment_Terms"
                                                onChange={(e) => handleChange_QuotDetails(e)}
                                                value={!isChecked ? quoteDetails.Payment_Terms : null}

                                                disabled={!isChecked ? 'disabled' : ''}
                                                placeholder="Payment Terms text.."
                                                className={`${input_css} w-full`} rows="2" />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="Validity_Terms" className="col-sm-1 col-form-label">Validity :</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                id="Validity_Terms"
                                                name="Validity_Terms"
                                                onChange={(e) => handleChange_QuotDetails(e)}
                                                value={!isChecked ? quoteDetails.Validity_Terms : null}

                                                disabled={!isChecked ? 'disabled' : ''}
                                                placeholder="Validity Terms text.."
                                                className={`${input_css} w-full`} rows="2" />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="Delivery_Terms" className="col-sm-1 col-form-label">Delivery :</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                id="Delivery_Terms"
                                                name="Delivery_Terms"
                                                onChange={(e) => handleChange_QuotDetails(e)}
                                                value={!isChecked ? quoteDetails.Delivery_Terms : null}
                                                disabled={!isChecked ? 'disabled' : ''}
                                                placeholder="Delivery Terms text.."
                                                className={`${input_css} w-full`} rows="2" />
                                        </div>
                                    </div>
                                    <button type="submit"
                                        disabled={isSubmitting}
                                        className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-full  mt-4  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>
                                </div>

                            </form>
                        </div>

                    )}
                </div>
            </div >

            {showMail ?
                <Mail
                    showMail={showMail}
                    setShowMail={setShowMail}
                    selectedQuote={selectedQuote}
                    setSelectedQuote={setSelectedQuote}

                /> : null
            }

        </>
    )
}
