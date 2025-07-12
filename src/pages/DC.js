import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { POST_Api, GET_Api, insert_Api } from '../services/ApiService';
import { ApiContext } from '../context/ApiProvider';
import { Modal, RadioButton, DataTableVIew, SalesAutoComplete, DatePicker2, ReactDateRangePicker } from '../components';
import { Get_BaseUrl, SweetAlert_Delete, date_strToObject, date_objToFormat } from '../helpers/custom';
import { useBaseUrl, Load_DC_Service, Save_DC_Service, Get_QuoteTerms_Service, UpdateQuote_Service, Delete_DC_Service, Update_DCstatus_Service } from '../services/DcService';
import moment from 'moment';
import { FaEdit, FaPrint } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
const btn_Edit = 'bg-red-500 text-white py-1 px-1 rounded-full';

export const DC = () => {
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

    const navigate = useNavigate();

    let row_id = 0;
    let totalAmount = 0.00;

    const DC_InitialValue = {
        id: '',
        DC_Number: '',
        Description: '',
        Serial: '',
        HSN_Code: '',
        Qty: 1,
        Rate: 0.00,
        Amount: 0.00,
    }

    const [DcData, setDcData] = useState(DC_InitialValue);

    const DcDetails_InitialValue = {
        DC_Number: '',
        Date: '',
        Company: '',
        Address: '',
        GSTIN: '',
        Contact: '',

        Taxable_Amount: 0.00,
        Tax_Perc: 18,
        TaxAmount: 0.00,
        Total: 0.00,
        Status: 'OPEN',
        Type: 'Non-Returnable',
        Reference: '',
        Delivery_Mode: '',
        DC_Remarks: '',
        // Payment_Terms: '',
        // Validity_Terms: '',
        // Delivery_Terms: '',
    }

    const [DcDetails, setDcDetails] = useState(DcDetails_InitialValue);
    // const [quoteTerms, setQuoteTerms] = useState([]);

    const type_Array = ['Non-Returnable', 'Returnable'];
    const [typeOption, setTypeOption] = useState(type_Array[0]);






    const handleChange_checkbox = (e) => {
        setIsChecked(!isChecked);
    }


    // input QuotDetails change function ...
    const handleChange_DcDetails = (e) => {
        const { name, value } = e.target
        setDcDetails((preve) => {
            return { ...preve, [name]: value }
        })
    }


    // input QuotDetails change function ...
    const handleChange_DcData = (e) => {
        const { name, value } = e.target
        setDcData((preve) => {
            return { ...preve, [name]: value }
        })
    }

    // add button click
    const handleClick_AddItem = (e) => {


        const dataNew = {
            ...DcData,
            id: tableData.length + 1,
            DC_Number: DcDetails.DC_Number,
            Amount: (DcData.Qty * DcData.Rate)
        }

        setTableData(tableData.concat(dataNew)) // add row items

        setDcData(DC_InitialValue);
        setShowTableData(true)
        const total = calculateTotal();
        totalAmount = total;
    }




    console.log('tableData', tableData)
    console.log(' DcDetails', DcDetails)
    console.log('DcData', DcData)
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
        // setQuotDetails( DcDetails => ({ ... DcDetails, Total: itemTotal }));

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

        // let taxper = parseFloat(DcDetails.Tax_Perc);
        // let taxAmt = (subTotal * taxper / 100);
        let totalAmt = subTotal;// + taxAmt


        setDcDetails((preve) => {
            return {
                ...preve,
                Date: moment(date).format('DD-MM-YYYY'),
                Type: typeOption,
                // Taxable_Amount: subTotal,
                // TaxAmount: taxAmt,
                Total: totalAmt
            }
        })
    }, [calculateTotal, date, typeOption])

    const handleRowDelete = (id) => {
        const updatedDcList = tableData.filter((current) => current.id !== id);
        setTableData(updatedDcList);
    }


    async function get_DC_UID() {
        try {

            // load Quote terms ....
            // const quoteTerms = await Get_QuoteTerms_Service();



            const url_dcUID = BASE_URL + '/uid/get_dcUID';
            const dc_uid = await GET_Api(url_dcUID, '');
            // console.log('Get quoteUID  :', quote_uid[0].Quotation_UID); 
            setDcDetails((preve) => {
                return {
                    ...preve,
                    DC_Number: (dc_uid[0].DC_UID + 1),
                    // Not_InScope: quoteTerms[0].Not_InScope, // add all quote terms 
                    // Tax_Terms: quoteTerms[0].Tax_Terms,
                    // Payment_Terms: quoteTerms[0].Payment_Terms,
                    // Validity_Terms: quoteTerms[0].Validity_Terms,
                    // Delivery_Terms: quoteTerms[0].Delivery_Terms,
                    // Scope: quoteTerms[0].Scope
                }
            })

        } catch (error) {
            console.error('Get quoteUID  :', error.message); // Handle error
        }
    }

    async function Update_Dc_UID() {
        try {
            const newUID = DcDetails.DC_Number;
            // console.log('newUID', newUID)
            const url_updateDcUID = BASE_URL + `/uid/update_dcUID/1`;
            const output = await POST_Api(url_updateDcUID, '', { DC_UID: newUID });
            // console.log('Update_QuoteUID :', output);
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
                const output = await Load_DC_Service(dateRangeNow);

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
            setDcDetails(DcDetails_InitialValue);
            setDcData(DC_InitialValue);
            setTableData([]);
            setShowTableData(false);
            setIsChecked(false);
            setIsEdit(false);
            setTypeOption(type_Array[0]);

            // get_DC_UID(); // get UID
        }

        if (activeTab === 2 && !isEdit) {
            get_DC_UID();

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
                const result = await Save_DC_Service(DcDetails, tableData);
                if (result) {
                    await Update_Dc_UID(); // update the UID              
                    setDcDetails(DcDetails_InitialValue);
                    setDcData(DC_InitialValue);
                    setTableData([]);
                    setShowTableData(false);
                    setIsChecked(false);
                    setTypeOption(type_Array[0]);
                    await get_DC_UID(); // get UID

                }
            } else if (isEdit) {


                // delete  old Qutation Details & Data
                const result = await Delete_DC_Service(DcDetails); // delete Quatation details and data by Quote_Number
                console.log('1. Delate old Qutation Details & Data...', result);

                // save fresh data
                const result2 = await Save_DC_Service(DcDetails, tableData);
                if (result2) {

                    setDcDetails(DcDetails_InitialValue);
                    setDcData(DC_InitialValue);
                    setTableData([]);
                    setShowTableData(false);
                    setIsChecked(false);
                    setIsEdit(false);
                    await get_DC_UID(); // get UID

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
        setDcDetails(row) // set quote details
        setDate(date_strToObject(row['Date'])); // set edit date

        try {
            let dcNumber = row['DC_Number'];
            console.log(dcNumber)
            const url_getDC = BASE_URL + `/dc/get_dc/${dcNumber}`;
            const result = await GET_Api(url_getDC, '');
            console.log(result)
            setTableData(result); // add items to salesContext
            setShowTableData(true)
        } catch (error) {

        }

    }

    const handleDelete = async (row) => {
        const shouldDelete = await SweetAlert_Delete();

        if (shouldDelete) {
            const result = await Delete_DC_Service(row);
            if (result) {
                await load_Data();
            }

        }
    }

    const handlePrint = (row) => {
        navigate('/dc_print', { state: row });
    }


    const handleStatusClick = (row) => {
        console.log('handleStatusClick :', row)
        setStatusModel(true);
        setStatusData((preve) => ({
            ...preve,
            id: row.id,
            DC_Number: row.DC_Number


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


        const response = await Update_DCstatus_Service(statusData);
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
            name: 'DC_Number',
            selector: row => row.DC_Number,
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
                        View
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        DC
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
                                <h2 className='bg-blue-400 text-white px-3 py-2 w-30'>Update DC Status</h2>
                                <div className='mt-4'>
                                    <form onSubmit={handel_StatusFormSubmit}>


                                        <div className='mt-4 mb-4'>
                                            <label htmlFor='DC_No'>DC No.</label>
                                            <input type="text"
                                                id="DC_No"
                                                name="DC_No"
                                                value={statusData.DC_Number}
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
                                    <span className='text-xl font-semibold'>DELIVERY - CHALLAN</span>
                                </div>
                                <hr></hr>


                                <div className='grid grid-cols-4 gap-4 mt-4' >
                                    <div className='w-full'>
                                        <label htmlFor="Company" className={`${label_css} `}>Customer/Company</label>
                                        <input type="text"
                                            id="Company"
                                            name="Company"
                                            onChange={(e) => handleChange_DcDetails(e)}
                                            value={DcDetails.Company}
                                            placeholder="Enter Customer/Company Name"
                                            required
                                            className={`${input_css} w-full`} />
                                    </div>

                                    <div className=' '>
                                        <label className={`${label_css} `}>DC No:</label>
                                        <input
                                            type="text"
                                            id=""
                                            name=""
                                            onChange={(e) => handleChange_DcDetails(e)}
                                            value={DcDetails.DC_Number}
                                            placeholder=''
                                            required
                                            readOnly
                                            className={`${input_css} cursor-not-allowed`} />
                                    </div>

                                    <div>
                                        {/* <label className={`${label_css} `}>Date:</label> */}
                                        <DatePicker2 title={'Date:'} date={date} setDate={setDate} />

                                    </div>


                                </div>

                                <div className='w-1/2 mt-4'>
                                    <div className="w-full">
                                        <label htmlFor="Address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                        <textarea
                                            id="Address"
                                            name="Address"
                                            onChange={(e) => handleChange_DcDetails(e)}
                                            value={DcDetails.Address}
                                            rows="4"
                                            placeholder="Your description here"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" ></textarea>
                                    </div>

                                    <div className="w-full mt-4">
                                        <label htmlFor="GSTIN" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">GSTIN</label>
                                        <input type="text"
                                            name="GSTIN"
                                            id="GSTIN"
                                            onChange={(e) => handleChange_DcDetails(e)}
                                            value={DcDetails.GSTIN}
                                            placeholder="GSTIN2999"
                                            // required
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                                    </div>
                                </div>

                                <div className='mb-4 mt-4'>
                                    <label htmlFor="Contact" className={`${label_css} `}>Contac Person :</label>
                                    <input type="text"
                                        id="Contact"
                                        name="Contact"
                                        onChange={(e) => handleChange_DcDetails(e)}
                                        value={DcDetails.Contact}
                                        placeholder="Contact Person Name & Phone Number."
                                        required
                                        className={`${input_css} w-1/2`} />
                                </div>
                                <hr></hr>
                                <div className='grid grid-cols-4  gap-4  mt-3  items-center'>

                                    <div className="flex flex-col w-full">
                                        <label htmlFor="DC_Remarks" className={`${label_css} mr-3`}>DC Remarks</label>
                                        <select className={`${input_css} w-full`}
                                            id="DC_Remarks"
                                            name="DC_Remarks"
                                            onChange={handleChange_DcDetails}
                                            value={DcDetails.DC_Remarks}
                                            required
                                        >
                                            <option value="">- Select -</option>
                                            <option value="For Sale">For Sale</option>
                                            <option value="For Demo">For Demo</option>
                                            <option value="For Service">For Service</option>
                                            <option value="Loaner">Loaner</option>
                                            <option value="Others">Others</option>

                                        </select>
                                    </div>


                                    <div className='flex-col items-center  '>
                                        <label htmlFor="Category" className={`${label_css} block mr-3`}>DC Type :</label>
                                        {/* <div className='flex items-center    '>
                                            <input type="radio" className='' />
                                            <label className='ml-3' >Non-Returnable</label>
                                        </div>
                                        <div className='flex items-center   '>
                                            <input type="radio" className='' />
                                            <label className='ml-3' >Returnable</label>
                                        </div> */}

                                        <RadioButton title="" selectedOption={typeOption} setSelectedOption={setTypeOption} dataArray={type_Array} />
                                    </div>




                                    <div className="flex-col   w-full">
                                        <label htmlFor="Delivery_Mode" className={`${label_css} block mr-3`} >Delivery Mode</label>
                                        <select className={`${input_css} w-full`}
                                            id="Delivery_Mode"
                                            name="Delivery_Mode"
                                            onChange={handleChange_DcDetails}
                                            value={DcDetails.Delivery_Mode}
                                            required
                                        >
                                            <option value="">- Select -</option>
                                            <option value="By Hand">By Hand</option>
                                            <option value="Courier">Courier</option>
                                            <option value="Transport">Transport</option>


                                        </select>
                                    </div>

                                    <div className='flex-col ml-8  '>
                                        <label htmlFor="Reference" className={`${label_css} block mr-3`}>Reference</label>
                                        <input
                                            id="Reference"
                                            name="Reference"
                                            placeholder='PO No. / Date'
                                            onChange={handleChange_DcDetails}
                                            value={DcDetails.Reference}
                                            className={`${input_css} w-full mb-2`} />


                                    </div>
                                </div>

                                <hr className='mt-4'></hr>

                                <div className='grid gap-8 md:grid-cols-2 mt-4'>


                                    <b><h5 className='mt-0'>Add Quatation Item :</h5></b>
                                    <div></div>








                                    <div className="">
                                        <label htmlFor="Description" className={`${label_css} `}>Desc</label>
                                        <textarea
                                            id="Description"
                                            name="Description"
                                            onChange={(e) => handleChange_DcData(e)}
                                            value={DcData.Description}
                                            placeholder="Quotation Item  Detials .."
                                            className={`${input_css} w-full`} rows="3"></textarea>
                                    </div>


                                    <div className=' '>
                                        <label htmlFor="Serial" className={`${label_css} `}>Serial/Model</label>
                                        <input
                                            type='text'
                                            id="Serial"
                                            name="Serial"
                                            onChange={(e) => handleChange_DcData(e)}
                                            value={DcData.Serial}
                                            placeholder="Si / Model No."
                                            className={`${input_css} w-full`} />
                                    </div>
                                </div>






                                <div className="grid gap-4 md:grid-cols-4 mb-4">
                                    <div className="col-md-2">
                                        <label htmlFor="Qty" className={`${label_css} `}>Qty</label>
                                        <input
                                            type="number"
                                            id="Qty"
                                            name="Qty"
                                            onChange={(e) => handleChange_DcData(e)}
                                            value={DcData.Qty}
                                            min="1"
                                            className={`${input_css} w-full`} required="" />
                                    </div>

                                    <div className="col-md-2">
                                        <label htmlFor="Rate" className={`${label_css} `}>Rate</label>
                                        <input
                                            type="text"
                                            id="Rate"
                                            name="Rate"
                                            onChange={(e) => handleChange_DcData(e)}
                                            value={DcData.Rate}
                                            placeholder="0.00"
                                            className={`${input_css} w-full`} />
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor="HSN_Code" className={`${label_css} `}>HSN Code</label>
                                        <input
                                            type="text"
                                            id="HSN_Code"
                                            name="HSN_Code"
                                            onChange={(e) => handleChange_DcData(e)}
                                            value={DcData.HSN_Code}
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




                                </div>

                                <hr className='mt-4'></hr>

                                <div>
                                    {/* Table add items */}


                                    {showTableData && (


                                        <div id="div_addQuatation_Items" style={{ marginTop: '10px', display: 'unset' }}>


                                            <br></br>
                                            <span><b> <h5>View Quatation Items :</h5></b></span>

                                            <div className='mb-8'>
                                                <table className="border-2  mb-4" id="table_addQuatation_Items" width="50%">
                                                    <thead className="" style={{ backgroundColor: '#55acee', color: 'white' }}>
                                                        <tr>
                                                            <th width="5px">#</th>
                                                            <th width="400px">Description</th>
                                                            <th width="400px">Serial/Model</th>
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
                                                                <td><input type="text" id="txt_Ser_1" name="txt_Ser_1" value={item.Serial} className={`${input_css}  mr-1`} readOnly="" /></td>
                                                                <td><input type="text" id="txt_HsnCode_1" name="txt_HsnCode_1" value={item.HSN_Code} className={`${input_css}  mr-1`} readOnly="" /></td>
                                                                <td><input type="text" id="txt_Qty_1" name="txt_Qty_1" value={item.Qty} className={`${input_css}  w-12  mr-1`} readOnly="" /></td>
                                                                <td><input type="text" id="txt_Rate_1" name="txt_Rate_1" value={item.Rate} className={`${input_css}  mr-1`} readOnly="" /></td>
                                                                <td><input type="text" id="txt_Amount_1" name="txt_Amount_1" value={(item.Qty * item.Rate).toFixed(2)} className={`${input_css}  mr-1`} readOnly="" /></td>
                                                                <td><button type="button" id={item.id} onClick={() => handleRowDelete(item.id)} className={`${btn_Edit} px-4 py-0`}><i className="fa fa-times">X</i></button></td>
                                                            </tr>


                                                        ))


                                                        }
                                                    </tbody>

                                                    <tbody>
                                                        {/* <tr className=''>

                                                        <th colSpan="5" style={{ textAlign: 'right' }} className='pr-4 '>Taxable Amount</th>
                                                        <th>
                                                            <input type="text"
                                                                id="Taxable_Amount"
                                                                name="Taxable_Amount"

                                                                value={DcDetails.Taxable_Amount.toFixed(2)}
                                                                readOnly
                                                                className={`${input_css} w-full `} /> </th>
                                                        <th colSpan="2">

                                                        </th>


                                                    </tr> */}
                                                        {/* <tr className=' '>
                                                            <th colSpan="5" style={{ textAlign: 'right' }} className=' pr-4 text-nowrap items-center'>Tax %

                                                            </th>



                                                            <th className='flex'>
                                                                <input
                                                                    type='text'
                                                                    id="Tax_Perc"
                                                                    name="Tax_Perc"
                                                                    onChange={(e) => handleChange_DcDetails(e)}
                                                                    value={DcDetails.Tax_Perc}
                                                                    className={`${input_css} w-16 `}
                                                                />
                                                                <input
                                                                    type='text'
                                                                    id="TaxAmount"
                                                                    name="TaxAmount"

                                                                    value={DcDetails.TaxAmount.toFixed(2)}
                                                                    readOnly
                                                                    className={`${input_css} w-2/3 `}
                                                                />
                                                            </th>
                                                        </tr> */}

                                                        <tr >
                                                            <th colSpan="5" style={{ textAlign: 'right' }} className='pr-4 '>Total</th>

                                                            <th>
                                                                <input
                                                                    type='text'
                                                                    id="Total"
                                                                    name="Total"

                                                                    value={DcDetails.Total.toFixed(2)}
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

                                {/* <div className="mt-3">
                                    <input
                                        type="checkbox"
                                        id="checkbox_Terms"
                                        name="checkbox_Terms"
                                        checked={isChecked}
                                        onChange={(e) => handleChange_checkbox(e)}
                                        className="icheck checkbox mr-4" />
                                    <label htmlFor="checkbox_Terms" className=''>Edit Terms
                                    </label>
                                </div> */}

                                {/* <div className="mb-4 w-3/4"  >


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
                                                onChange={(e) => handleChange_DcDetails(e)}
                                                value={!isChecked ? DcDetails.Not_InScope : null}
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
                                                onChange={(e) => handleChange_DcDetails(e)}
                                                value={!isChecked ? DcDetails.Tax_Terms : null}

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
                                                onChange={(e) => handleChange_DcDetails(e)}
                                                value={!isChecked ? DcDetails.Payment_Terms : null}

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
                                                onChange={(e) => handleChange_DcDetails(e)}
                                                value={!isChecked ? DcDetails.Validity_Terms : null}

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
                                                onChange={(e) => handleChange_DcDetails(e)}
                                                value={!isChecked ? DcDetails.Delivery_Terms : null}
                                                disabled={!isChecked ? 'disabled' : ''}
                                                placeholder="Delivery Terms text.."
                                                className={`${input_css} w-full`} rows="2" />
                                        </div>
                                    </div>
                                    <button type="submit"
                                        disabled={isSubmitting}
                                        className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-full  mt-4  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>
                                </div> */}
                                <button type="submit"
                                    disabled={isSubmitting}
                                    className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-full  mt-4  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>
                            </form>
                        </div>

                    )}
                </div>
            </div >

        </>
    )
}
