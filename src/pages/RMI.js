import React, { useEffect, useState, useContext } from 'react';
import { RMIAutoComplete, DataTableVIew, DatePicker2, ReactDateRangePicker, AutoComplete } from '../components';
import { useBaseUrl, Load_EngNames_Service, Load_RMI_Service, Get_RMIStock_ByEngName_Service, Save_RMI_Service, Delete_RMI_Service } from '../services/RMIService';
import { SweetAlert_Delete } from '../helpers/custom';
import { ApiContext } from '../context/ApiProvider';
import moment from 'moment';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";


// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-sm border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';


export const RMI = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);

    const [activeTab, setActiveTab] = useState(1);

    const [date, setDate] = useState(new Date()); // date object  
    const [isEdit, setIsEdit] = useState(false);
    const [dateRangeNow, setDateRangeNow] = useState({});

    const RMI_InitialValue = {
        // HSN_Code: '',
        Item_Code: '',
        Item_Name: '',
        ModelNumber: '',
        PartNumber: '',
        Part_id: '',
        // Purchase_Price: '',
        // Sale_Price: '',
        Issue_Qty: '',
        // Supplier: '',
        // Tax_Percent: '',
        RMI_Qty: 1,
        RMI_Date: '',
        RMI_No: '',
        Eng_Name: ''

    }

    const [engName, setEngName] = useState('');
    const [engApiData, setEngApiData] = useState('');

    const [apiData, setApiData] = useState([]); // load tabledata
    const [autoCompleteData, setAutoCompleteData] = useState([]); // part search autocomplete
    const [rowItems, setRowItems] = useState([]); // for selected row item in part search autocomplete
    const [RMIData, setRMIData] = useState(RMI_InitialValue);

    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRMIData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })

    }

    // set initial Qty
    useEffect(() => {


        setRMIData((preve) => {
            return {
                ...preve,
                RMI_Qty: 1
            }
        })
    }, [])

    useEffect(() => {

        async function Load_EngStock() {
            const data = await Get_RMIStock_ByEngName_Service(engName);
            setAutoCompleteData(data);
        }

        if (engName) {
            Load_EngStock();
        }

    }, [engName]);

    // console.log('apiData', autoCompleteData)

    useEffect(() => {
        setRMIData((preve) => {
            return {
                ...preve,
                ...rowItems,
                RMI_Date: moment(date).format('DD-MM-YYYY'),
                Eng_Name: engName,

            }
        })
    }, [date, rowItems, engName])

    // console.log('RMIData', RMIData)

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        try {
            if (!isEdit) { // save process...
                await Save_RMI_Service(RMIData)
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
            const output = await Load_RMI_Service(dateRangeNow);
            // console.log(output)
            setApiData(output);
        }
    }


    async function load_EngNames() {
        const apiData = await Load_EngNames_Service();
        if (apiData) {
            setEngApiData(apiData)
        }

    }

    useEffect(() => {

        if (activeTab === 1) {
            load_Data();
            // reset forrm values
            setRMIData(RMI_InitialValue);
            setIsEdit(false);
        }

        if (activeTab === 2) {
            load_EngNames();
        }

    }, [activeTab, dateRangeNow]); // activeTab, isEdit



    const handleDelete = async (row) => {
        const shouldDelete = await SweetAlert_Delete();
        if (shouldDelete) {
            const result = await Delete_RMI_Service(row);
            if (result) {
                await load_Data();
            }
        }
    }

    // Define table columns
    const columns = [
        {
            name: 'Part_id',
            selector: row => row.Part_id,
            sortable: true
        },
        {
            name: 'RMI_Date',
            selector: row => row.RMI_Date,
            sortable: true
        },
        {
            name: 'Item_Name',
            selector: row => row.Item_Name,
            sortable: true
        },
        {
            name: 'PartNumber',
            selector: row => row.PartNumber,
            sortable: true
        },
        {
            name: 'ModelNumber',
            selector: row => row.ModelNumber,
            sortable: true
        },

        {
            name: 'RMI_Qty',
            selector: row => row.RMI_Qty,
            sortable: true
        },
        {
            name: 'RMI_No',
            selector: row => row.RMI_No,
            sortable: true
        },

        {
            name: 'Eng_Name',
            selector: row => row.Eng_Name,
            sortable: true
        },

        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>

                    {/* <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1' title='Edit'><span><FaEdit /></span></button> */}
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
                        View
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        RMI Consumption
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
                        <div className="p-2 bg-green-300 rounded-lg h-full" >
                            {/*  Content for Tab 2  */}


                            <div className='border-2 rounded-lg' style={{ height: '700px' }}>
                                <div className='bg-yellow-400 px-2 py-2'>
                                    <p>RMI Consumption</p>
                                </div>
                                <form onSubmit={handleFormSubmit}>


                                    <div className='w-4/12 mt-3 p-3'>
                                        <label htmlFor='Eng_Name' className={`${label_css}`}>Eng Name</label>
                                        {/* <input
                                                type="text"
                                                id="Eng_Name"
                                                name="Eng_Name"
                                                onChange={handleChange}
                                                value={RMIData.Eng_Name}
                                                required
                                                placeholder='Search Engineer Name'
                                                className={`${input_css} w-full`} /> */}

                                        <AutoComplete
                                            sourceApiData={engApiData}
                                            setAutoComplete={setEngName}
                                        />
                                    </div>


                                    <div className='flex  p-3'>




                                        <div className='     '>
                                            <span className=' '>Search Item :</span>
                                            <RMIAutoComplete autoCompleteData={autoCompleteData} setRowItems={setRowItems} />
                                        </div>



                                    </div>

                                    <div className=' p-3'>
                                        <div className='flex space-x-8  mb-2 ' >

                                            <div className='w-full '>
                                                <label htmlFor='Item_Name' className={`${label_css}`}>Item Name</label>
                                                <input
                                                    type="text"
                                                    id="Item_Name"
                                                    name="Item_Name"
                                                    value={RMIData.Item_Name}
                                                    placeholder='Part Desc.'
                                                    readOnly
                                                    className={`${input_css} w-full cursor-not-allowed`} />
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor='PartNumber' className={`${label_css}`}>Part Number</label>
                                                <input
                                                    type="text"
                                                    id="PartNumber"
                                                    name="PartNumber"
                                                    value={RMIData.PartNumber}
                                                    placeholder='Part No.'
                                                    readOnly
                                                    className={`${input_css} w-full cursor-not-allowed`} />
                                            </div>

                                            <div className='w-full'>
                                                <label htmlFor='ModelNumber' className={`${label_css}`}>Model Number</label>
                                                <input
                                                    type="text"
                                                    id="ModelNumber"
                                                    name="ModelNumber"
                                                    value={RMIData.ModelNumber}
                                                    placeholder='Model No.'
                                                    readOnly
                                                    className={`${input_css} w-full cursor-not-allowed`} />
                                            </div>

                                        </div> {/* end col-1 */}





                                    </div>

                                    <div className='w-full flex  gap-8 mt-4 items-center p-3'>


                                        <div className='w-1/12 '> {/* w-1/12 */}
                                            <label htmlFor='RMI_Qty' className={`${label_css}`}>RMI Qty :</label>
                                            <input
                                                type='number'
                                                id="RMI_Qty"
                                                name="RMI_Qty"

                                                onChange={handleChange}
                                                value={RMIData.RMI_Qty}
                                                min={1}
                                                max={100}
                                                required
                                                className={`${input_css} w-full`} />
                                        </div>

                                        <div className='flex flex-col'>
                                            {/* <label htmlFor='Issue_Date' className={`${label_css}`}>RMI Date :</label> */}
                                            {/* <input
                                                    type="text"
                                                    id="Issue_Date"
                                                    name="Issue_Date"
                                                    placeholder='Issue_Date.'
                                                    className={`${input_css} w-1/3`} /> */}
                                            <DatePicker2 title="RMI Date :" date={date} setDate={setDate} />
                                        </div>

                                        <div className='w-2/12 '>
                                            <label htmlFor='RMI_No' className={`${label_css}`}>RMI No. :</label>
                                            <input
                                                type='text'
                                                id="RMI_No"
                                                name="RMI_No"

                                                onChange={handleChange}
                                                value={RMIData.RMI_No}
                                                placeholder='Enter RMI No.'
                                                required
                                                className={`${input_css} w-full border-red-500 border-4`} />
                                        </div>

                                    </div>  {/* end col-2 */}

                                    <button type="submit"
                                        disabled={isSubmitting}
                                        className={` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-40  mt-4 ml-3 mb-3 p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>
                                </form>


                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
