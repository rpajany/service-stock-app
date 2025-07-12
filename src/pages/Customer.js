import React, { useState, useContext, useEffect } from 'react'
import { POST_Api, GET_Api } from '../services/ApiService';
import { useBaseUrl, Get_CustomerUID_Service, Save_CustomerData_Service, Load_CustomerData_Service } from '../services/CustomerService';
import { ApiContext } from '../context/ApiProvider';
import { DataTableVIew, DatePicker2, ReactDateRangePicker } from '../components';
import { toast } from 'react-toastify';
import { AddCustomer } from './AddCustomer';
import { FaEdit, FaPrint } from "react-icons/fa"
import { RiDeleteBin2Line } from "react-icons/ri";

// css 
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';

export const Customer = () => {

    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);

    const [isInserted, setIsInserted] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    //  toast.success(dataApi.message);

    const load_CustomerData = async () => {
        try {
            const result = await Load_CustomerData_Service();
            if (result) {
                setApiData(result);
            }
        } catch (error) {
            console.error('load_CustomerData :', error.message);
        }
    }

    useEffect(() => {
        load_CustomerData();
    }, [isInserted])

    // Handle Edit button click
    const handleEdit = async (row) => {
        setSelectedCustomer(row);
        setIsEdit(true);
    }

    // Handle Delete button click
    const handleDelete = async (row) => {
        setSelectedCustomer(row);
    }

    // Define table columns
    const columns = [
        {
            name: 'id',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Cust_id',
            selector: row => row.Cust_id,
            sortable: true
        },
        {
            name: 'Customer_Name',
            selector: row => row.Customer_Name,
            sortable: true
        },
        {
            name: 'Address',
            selector: row => row.Address,
            sortable: true
        },
        {
            name: 'State',
            selector: row => row.State,
            sortable: true
        },
        {
            name: 'GSTIN',
            selector: row => row.GSTIN,
            sortable: true
        },
        {
            name: 'Mobile',
            selector: row => row.Mobile,
            sortable: true
        },

        {
            name: 'Email',
            selector: row => row.Email,
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
            allowOverflow: true, // Ensure the buttons are visible
            button: true, // Makes it clear they are buttons
        }
    ];


    return (
        <div>
            <div className='border-2 '>
                {/* <div className='bg-cyan-500 text-white py-2 px-5' style={{}} >
                    <i className="fa fa-shopping-cart">Customer</i>
                </div> */}

                <AddCustomer
                    setIsInserted={setIsInserted}
                    selectedCustomer={selectedCustomer}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit} />


                <div className='mr-4 mt-4 mb-4'>
                    {/* DataGrid view*/}
                    <DataTableVIew tbl_title={''} columns={columns} apiData={apiData} />
                </div>
            </div>

        </div>
    )
}
