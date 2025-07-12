import React, { useEffect, useState, useContext } from 'react';
import { SalesAutoComplete, DataTableVIew, DatePicker2, ReactDateRangePicker, AutoComplete } from '../components';
import { useBaseUrl, Load_EngStock_Service, Load_EngNames_Service, Load_StockByEngName_Service, Get_EngStock_Service, Save_EngStock_Service, Update_EngStock_Service, Delete_EngStock_Service } from '../services/EngStockService';
// import { Load_EngNames_Service } from '../services/RMIService';
import { ApiContext } from '../context/ApiProvider';
import { SweetAlert_Delete } from '../helpers/custom';
import moment from 'moment';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-sm border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';


export const EngStock = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);

    const [activeTab, setActiveTab] = useState(1);

    const [date, setDate] = useState(new Date()); // date object  
    const [isEdit, setIsEdit] = useState(false);
    const [autoComplete, setAutoComplete] = useState('')
    const [clearAutoComplete, setClearAutoComplete] = useState(false);

    const [dateRangeNow, setDateRangeNow] = useState({});
    const [apiData, setApiData] = useState([]);
    const [stockByEngName, setStockByEngName] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

    const selectItems_InitialValue = {
        HSN_Code: '',
        Item_Code: '',
        Item_Name: '',
        ModelNumber: '',
        PartNumber: '',
        Part_id: '',
        Purchase_Price: '',
        Sale_Price: '',
        Stock_Qty: '',
        Supplier: '',
        Tax_Percent: '',
        Issue_Date: '',
        Issue_Qty: 1,
        Eng_Name: ''
    }

    const [rowItems, setRowItems] = useState([]);
    const [engStockData, setEngStockData] = useState(selectItems_InitialValue);
    const [engApiData, setEngApiData] = useState('');

    console.log('rowItems', rowItems)
    // console.log('engStockData', engStockData)

    const handleChange = (e) => {
        const { name, value } = e.target
        setEngStockData((preve) => {
            return {
                ...preve,
                [name]: value,
                // 
            }
        })
    }


    useEffect(() => {
        setEngStockData((preve) => {
            return {
                ...preve,

                Issue_Qty: 1,

            }
        })
    }, [])

    useEffect(() => {
        setEngStockData((preve) => {
            return {
                ...preve,
                ...rowItems,
                Issue_Date: moment(date).format('DD-MM-YYYY'),
                Eng_Name: autoComplete
            }
        })
    }, [date, rowItems, autoComplete])


    // Load Eng. store data
    async function load_Data() {
        // console.log(dateRangeNow)

        if (Object.keys(dateRangeNow).length !== 0) {
            const output = await Load_EngStock_Service(dateRangeNow);
            // console.log(output)
            setApiData(output);
        }
    }

    async function load_StockByEngName() {
        // console.log(dateRangeNow)

        if (Object.keys(dateRangeNow).length !== 0) {
            const output = await Load_StockByEngName_Service(dateRangeNow);
            // console.log(output)
            setStockByEngName(output);
        }
    }

    async function load_EngNames() {
        const apiData = await Load_EngNames_Service();
        if (apiData) {
            setEngApiData(apiData)
        }

    }

    useEffect(() => {


        if (activeTab === 2) {
            // console.log('active Tab')
            load_Data(); // eng store data
            // reset forrm values
            setEngStockData(selectItems_InitialValue);
            setIsEdit(false);
        } else if (activeTab === 3) {
            load_StockByEngName();
            // reset forrm values
            setEngStockData(selectItems_InitialValue);
            setIsEdit(false);
        } else if (activeTab === 1) {
            load_EngNames();
        }

    }, [activeTab, dateRangeNow]); // activeTab, isEdit

    console.log('stockByEngName', stockByEngName)

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        try {
            if (!isEdit) { // save process...
                const result = await Save_EngStock_Service(engStockData);
                if (result) {
                    // reset form
                    setEngStockData(selectItems_InitialValue);
                    setRowItems([]) // clear item search

                    setAutoComplete("") // clear Eng Name Autocomplete
                    setClearAutoComplete(true);
                }
            }

            // else if (isEdit) {  // update process...
            //     const result = await Update_EngStock_Service(engStockData);
            // }
        } catch (error) {
            console.log('Error :', error)
        } finally {
            setIsSubmitting(false); // Unlock the form
        }




    }



    const handleDelete = async (row) => {
        const shouldDelete = await SweetAlert_Delete();

        if (shouldDelete) {
            const result = await Delete_EngStock_Service(row);
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
            name: 'Issue_Date',
            selector: row => row.Issue_Date,
            sortable: true
        },
        {
            name: 'Item_Name',
            selector: row => row.Item_Name,
            sortable: true
        },
        {
            name: 'Issue_Qty',
            selector: row => row.Issue_Qty,
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
            name: 'Item_Code',
            selector: row => row.Item_Code,
            sortable: true
        },


        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>

                    {/* <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1' title='Edit'><span><FaEdit /></span></button> */}
                    <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm cursor-not-allowed' title='Delete' disabled><RiDeleteBin2Line /></button>
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowoverflow: true, // Ensure the buttons are visible / allowOverflow
            button: true, // Makes it clear they are buttons
        }
    ];


    // Define table columns
    const EngStock_columns = [
        {
            name: 'Part_id',
            selector: row => row.Part_id,
            sortable: true
        },
        {
            name: 'Eng_Name',
            selector: row => row.Eng_Name,
            sortable: true
        },
        {
            name: 'Item_Name',
            selector: row => row.Item_Name,
            sortable: true
        },
        {
            name: 'Issue_Qty',
            selector: row => row.Issue_Qty,
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
            name: 'Item_Code',
            selector: row => row.Item_Code,
            sortable: true
        },




        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>

                    {/* <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1' title='Edit'><span><FaEdit /></span></button> */}
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
                        EngStock_Entry

                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        Eng_Store
                    </li>

                    <li className={`cursor-pointer p-2 ${activeTab === 3 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(3)}>
                        StockByEng
                    </li>
                </ul>

                {/* Tab content */}
                <div className="mt-4">
                    {activeTab === 2 && (
                        <div className="p-4 bg-green-300 rounded-lg">
                            {/*  Content for Tab 1  */}

                            <div className='flex mb-4'>
                                <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
                            </div>
                            <DataTableVIew tbl_title={''} columns={columns} apiData={apiData} />
                        </div>
                    )}
                    {activeTab === 1 && (
                        <div className="p-2 bg-green-300 rounded-lg">
                            {/*  Content for Tab 2  */}


                            <div className='border-2 rounded-lg'>
                                <div className='bg-yellow-400 px-2 py-2'>
                                    <p>Engineer Stock</p>
                                </div>
                                <form onSubmit={handleFormSubmit}>
                                    <div className='flex    p-3'>
                                        <div className='     '>
                                            <span className=' '>Search Item</span>
                                            <SalesAutoComplete setRowItems={setRowItems} />
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
                                                    value={engStockData.Item_Name}
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
                                                    value={engStockData.PartNumber}
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
                                                    value={engStockData.ModelNumber}
                                                    placeholder='Model No.'
                                                    readOnly
                                                    className={`${input_css} w-full cursor-not-allowed`} />
                                            </div>

                                        </div> {/* end col-1 */}

                                        <div className='flex  gap-8 '>


                                            <div className='w-1/12 '>
                                                <label htmlFor='Issue_Qty' className={`${label_css}`}>Stock Issue Qty :</label>
                                                <input
                                                    type='number'
                                                    id="Issue_Qty"
                                                    name="Issue_Qty"

                                                    onChange={handleChange}
                                                    value={engStockData.Issue_Qty}
                                                    min={1}
                                                    max={100}
                                                    required
                                                    className={`${input_css} w-full`} />
                                            </div>

                                            <div className='flex flex-col'>
                                                {/* <label htmlFor='Issue_Date' className={`${label_css}`}>Stock Issue Date :</label> */}
                                                {/* <input
                                                    type="text"
                                                    id="Issue_Date"
                                                    name="Issue_Date"
                                                    placeholder='Issue_Date.'
                                                    className={`${input_css} w-1/3`} /> */}
                                                <DatePicker2 title={'Stock Issue Date :'} date={date} setDate={setDate} />
                                            </div>


                                        </div>  {/* end col-1 */}

                                        <div className='w-6/12 mt-3'>
                                            <label htmlFor='Eng_Name' className={`${label_css}`}>Eng Name</label>
                                            {/* <input
                                                type="text"
                                                id="Eng_Name"
                                                name="Eng_Name"
                                                onChange={handleChange}
                                                value={engStockData.Eng_Name}
                                                required
                                                placeholder='Search Engineer Name'
                                                className={`${input_css} w-full`} /> */}

                                            <AutoComplete
                                                sourceApiData={engApiData}
                                                setAutoComplete={setAutoComplete}
                                                clearAutoComplete={clearAutoComplete}
                                            />
                                        </div>

                                    </div>
                                    <button type="submit"
                                        disabled={isSubmitting}
                                        className={`${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-40  mt-3 ml-3 mb-3 p-3  rounded-lg  ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>
                                </form>


                            </div>
                        </div>
                    )}
                    {activeTab === 3 && (
                        <div className="p-4 bg-green-300 rounded-lg">
                            {/*  Content for Tab 1  */}

                            <div className='flex mb-4'>
                                <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
                            </div>
                            <DataTableVIew tbl_title={''} columns={EngStock_columns} apiData={stockByEngName} />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
