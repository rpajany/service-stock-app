import React, { useState, useEffect, useContext } from 'react';
import { DataTableVIew, AutoComplete, DatePicker2, ReactDateRangePicker } from '../components';
// import { POST_Api, GET_Api } from '../services/ApiService';
import { ApiContext } from '../context/ApiProvider';
import { useBaseUrl, load_StockSummary_Service, load_Stock_Service, load_StockDetailByPartNumber_Service } from '../services/StockService';

export const StockReport = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);

    const [activeTab, setActiveTab] = useState(1);
    const [apiDataSummary, setApiDataSummary] = useState([]);
    const [apiData, setApiData] = useState([]);
    const [activePartNumber, setActivePartNumber] = useState('');
    const [apiDataItem, setApiDataItem] = useState([]);
    const [dateRangeNow, setDateRangeNow] = useState({});

    // function load data:
    async function load_StockData() {
        try {



            const data1 = await load_Stock_Service();
            setApiData(data1);

        } catch (error) {
            console.error('load_Data :', error.message); // Handle error
        }
    }

    async function load_SummaryData() {
        try {

            // if (Object.keys(dateRangeNow).length !== 0) {
            const data0 = await load_StockSummary_Service(dateRangeNow);
            console.log('StockSummary Data :', data0)
            setApiDataSummary(data0);
            // }



        } catch (error) {
            console.error('load_Data :', error.message); // Handle error
        }
    }

    useEffect(() => {
        if (activeTab === 1) {
            load_StockData();
        } else if (activeTab === 3) {
            load_SummaryData()
        }



    }, [activeTab, dateRangeNow])


    const handle_PartNumberClick = async (partnumber) => {
        console.log(partnumber)
        setActiveTab(2);
        setActivePartNumber(partnumber)
        const data2 = await load_StockDetailByPartNumber_Service(partnumber)
        setApiDataItem(data2);
    }

    // console.log('apiData:', apiData);

    // Define table columns
    const stock_columns = [
        {
            name: 'Part_id',
            selector: row => row.Part_id,
            sortable: true
        },
        {
            name: 'Item_Code',
            selector: row => row.Item_Code,
            sortable: true
        },
        {
            name: 'PartNumber',
            selector: row => row.PartNumber,
            cell: (row) => (
                <div className='flex p-1'>
                    {/* {/* <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1'><span><FaEdit /></span></button> */}
                    <button onClick={() => handle_PartNumberClick(row.PartNumber)} className='bg-green-200 px-2 py-1 rounded-lg'>{row.PartNumber}</button>
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowOverflow: true, // Ensure the buttons are visible
            button: true, // Makes it clear they are buttons
            sortable: true
        },
        {
            name: 'ModelNumber',
            selector: row => row.ModelNumber,
            sortable: true
        },
        {
            name: 'Item_Name',
            selector: row => row.Item_Name,
            sortable: true
        },
        {
            name: 'Stock_Qty',
            selector: row => row.Stock_Qty,
            sortable: true
        },
        {
            name: 'Supplier',
            selector: row => row.Supplier,
            sortable: true
        },


        // {
        //     name: 'Actions',
        //     cell: (row) => (
        //         <div className='flex p-1'>
        //             {/* <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1'><span><FaEdit /></span></button>
        //             <button onClick={() => handleDelete(row.id)} className='bg-red-500 p-2 rounded-sm'><RiDeleteBin2Line /></button> */}
        //         </div>
        //     ),
        //     ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
        //     allowOverflow: true, // Ensure the buttons are visible
        //     button: true, // Makes it clear they are buttons
        // }
    ];




    const columns_summary = [
        {
            name: 'id',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Type',
            selector: row => row.Type,
            sortable: true
        },
        {
            name: 'Invoice_Number',
            selector: row => row.Invoice_Number,
            sortable: true
        },
        {
            name: 'Invoice_Date',
            selector: row => row.Invoice_Date,
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
            name: 'Stock_Qty',
            selector: row => row.Stock_Qty,
            sortable: true
        },
        {
            name: 'Transact_Qty',
            selector: row => row.Transact_Qty,
            sortable: true
        },
        {
            name: 'HandStock_Qty',
            selector: row => row.HandStock_Qty,
            sortable: true
        },
        {
            name: 'Remarks',
            selector: row => row.Remarks,
            sortable: true
        }

        // {
        //     name: 'Actions',
        //     cell: (row) => (
        //         <div className='flex p-1'>
        //             <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1'><span><FaEdit /></span></button>
        //             <button onClick={() => handleDelete(row.id)} className='bg-red-500 p-2 rounded-sm'><RiDeleteBin2Line /></button>
        //         </div>
        //     ),
        //     ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
        //     allowOverflow: true, // Ensure the buttons are visible
        //     button: true, // Makes it clear they are buttons
        // }
    ];

    return (
        <>

            <div className="w-full mx-auto p-1">
                {/* Tab navigation */}
                <ul className="flex space-x-4 border-b-2 border-gray-200">
                    <li className={`cursor-pointer p-2 ${activeTab === 1 ? 'text-blue-600 border-blue-600 border-b-2  bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(1)}>
                        Stock
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        Item Stock
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 3 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(3)}>
                        Stock Summary
                    </li>
                </ul>

                {/* Tab content */}
                <div className="mt-4">
                    {activeTab === 1 && (
                        <div className="p-4 bg-green-300 rounded-lg">
                            {/*  Content for Tab 1  */}
                            <p>Stock</p>
                            <DataTableVIew tbl_title={''} columns={stock_columns} apiData={apiData} />
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="p-4 bg-green-300 rounded-lg">
                            {/*  Content for Tab 2  */}
                            <p>Item Stock</p>
                            <DataTableVIew tbl_title={''} columns={columns_summary} apiData={apiDataItem} />
                        </div>
                    )}

                    {activeTab === 3 && (
                        <div className="p-4 bg-green-300 rounded-lg">
                            {/*  Content for Tab 2  */}
                            <p>Stock Summary</p>
                            <div className='flex mb-4'>

                                <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
                            </div>
                            <DataTableVIew tbl_title={''} columns={columns_summary} apiData={apiDataSummary} />
                        </div>
                    )}

                </div>
            </div>

        </>
    )
}
