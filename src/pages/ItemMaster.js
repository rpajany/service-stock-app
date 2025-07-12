import React, { useEffect, useState, useContext } from 'react';
import { DataTableVIew } from '../components';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { ApiContext } from '../context/ApiProvider';
import { Get_BaseUrl } from '../helpers/custom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";

import { RiDeleteBin2Line } from "react-icons/ri";

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

export const ItemMaster = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    BASE_URL = selectedApi;

    const [toggleModel, setToggleModel] = useState(false);
    const [rowEditData, setRowEditData] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [rowDeleteID, SetRowDeleteID] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

    const initialValue = {
        Item_Code: '',
        PartNumber: '',
        ModelNumber: '',
        Item_Name: '',
        Stock_Qty: '',
        Supplier: '',
        Purchase_Price: '',
        Sale_Price: '',
        Selling_Price: '',
        Tax_Percent: '',
        HSN_Code: ''
    }

    const [data, setData] = useState(initialValue);


    const [apiData, setApiData] = useState([]);



    const handelToggleModel = (e) => {
        let btnName = e.currentTarget.id
        if (btnName === 'btn_Add') {
            setData(initialValue); // reset form on add button click
            setIsEdit(false) // set to false on add button click
        } else {
            setIsEdit(true) // set to true on edit mode
        }

        setToggleModel(!toggleModel);
    }

    const handel_CloseModel = () => {
        setIsEdit(false); // setback editmode to false
        setRowEditData({}); // clear edit row data
        setToggleModel(!toggleModel);
        // console.log('isEdit', isEdit);
    }

    const handelChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve, [name]: value
            }
        })


    }

    // function load data:
    async function load_Date() {
        try {
            // http://localhost:8080/api/item_master/load_itemMaster
            const url = BASE_URL + '/item_master/load';

            const dataResponse = await fetch(url, {
                method: 'get',
                credentials: 'include',  // add token to client browser
                headers: { "content-Type": "application/json" }

            });

            const dataApi = await dataResponse.json();  // convert to json

            if (dataApi.success) {  // on success
                // const action =
                //     "<div><button className=''>Edit</button> <button className=''>Delete</button></div>"

                // var xxx = { ...dataApi.data, action: action }

                setApiData(dataApi.data);
                // setApiData(xxx);



            }

            if (dataApi.error) {  // on error
                toast.error(dataApi.message)
            }

        } catch (error) {
            console.log('Error :', error)
            toast.error(error.message)
        }
    }

    // useEffect to load data on pageload
    useEffect(() => {
        load_Date();
    }, [])


    // useEffect to Edit dataTable row
    useEffect(() => {
        if (Object.keys(rowEditData).length) {
            // console.log('rowedit length', Object.keys(rowEdit).length)
            // console.log('row edit', rowEdit)       


            // update state value
            setData(preve => ({
                ...preve, ...rowEditData
            }));

            setIsEdit(true);

            // show model
            setToggleModel(true);

        }

    }, [rowEditData])


    // useEffect to delete dataTable row
    useEffect(() => {

        const deleteData = async () => {
            try {


                if ((isDelete) && (rowDeleteID >= 1)) {

                    Swal.fire({
                        title: 'Delete Data !, Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, Delete !'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            console.log('confirmed', 'ok');

                            const id = rowDeleteID;

                            console.log('id', id)
                            const url = BASE_URL + `/item_master/delete/${id}`;
                            const dataResponse = await fetch(url, {
                                method: 'DELETE',
                                credentials: 'include',  // add token to client browser
                                headers: { "content-Type": "application/json" }

                            });

                            const dataApi = await dataResponse.json();  // convert to json

                            if (dataApi.success) {
                                load_Date();
                                toast.success('Deleted Success... !');
                            }

                            if (dataApi.error) {
                                toast.error('Error Delete !');
                            }

                            // reset state
                            setIsDelete(false);
                            SetRowDeleteID('');
                        } else if (result.isDismissed) {
                            console.log('dismiss', 'yes')
                        }
                    })


                }
            } catch (error) {
                console.log('Error :', error)
                toast.error(error.message)

            } finally {
                // reset state
                setIsDelete(false);
                SetRowDeleteID('');
            }

        }

        deleteData(); // call function

    }, [isDelete, rowDeleteID])





    // console.log('data', data)


    const handel_FormSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        try {
            if (!isEdit) {  // save function ...
                try {
                    const url = BASE_URL + '/item_master/add';
                    const dataResponse = await fetch(url, {
                        method: 'POST',
                        credentials: 'include',  // add token to client browser
                        headers: { "content-Type": "application/json" },
                        body: JSON.stringify(data) // state data username & password
                    });

                    const dataApi = await dataResponse.json(); // convert to json

                    console.log('Api message', dataApi.success);

                    if (dataApi.success) {  // on success
                        setData(initialValue); // reset form
                        load_Date();  // call dataload function
                        toast.success(dataApi.message);
                    }

                    if (dataApi.error) {  // on error
                        toast.error(dataApi.message)
                    }

                } catch (error) {
                    console.log('Error :', error)
                    toast.error(error.message)
                } finally {
                    setData(initialValue); // reset form
                    setIsSubmitting(false); // Unlock the form
                }
            } else if (isEdit) {  // update function ...
                try {
                    const id = rowEditData.Part_id;
                    console.log('id', id)
                    const url = BASE_URL + `/item_master/update/${id}`;
                    const dataResponse = await fetch(url, {
                        method: 'POST',
                        credentials: 'include',  // add token to client browser
                        headers: { "content-Type": "application/json" },
                        body: JSON.stringify(data)
                    });

                    const dataApi = await dataResponse.json();  // convert to json

                    if (dataApi.success) {
                        load_Date();
                        setData(initialValue); // reset form
                        toast.success('Update Success... !');
                    }

                    if (dataApi.error) {
                        toast.error('Error Update !');
                    }

                    // reset state
                    // setIsEdit(false);
                    // setRowEditData({});

                } catch (error) {
                    console.log('Error :', error)
                    toast.error(error.message)
                } finally {
                    // reset state
                    // setIsEdit(false);
                    // setRowEditData({});
                    setIsSubmitting(false); // Unlock the form
                }
            }
        } catch (error) {
            console.log('Error :', error)
        } finally {
            setIsSubmitting(false); // Unlock the form
        }

    }

    // Handle Edit button click
    const handleEdit = (row) => {
        setRowEditData(row);
        // console.log('Edit button clicked for:', row);
    };

    // Handle Delete button click
    const handleDelete = (rowId) => {
        SetRowDeleteID(rowId)
        setIsDelete(true);
        // const filteredData = data.filter((row) => row.Part_id !== rowId);
        // setData(filteredData);
    };

    // Define table columns
    const columns = [
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
            name: 'Supplier',
            selector: row => row.Supplier,
            sortable: true
        },
        {
            name: 'Purchase_Price',
            selector: row => row.Purchase_Price,
            sortable: true
        },
        {
            name: 'Sale_Price',
            selector: row => row.Sale_Price,
            sortable: true
        },
        {
            name: 'Tax_Percent',
            selector: row => row.Tax_Percent,
            sortable: true
        },
        {
            name: 'HSN_Code',
            selector: row => row.HSN_Code,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>
                    <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1'><span><FaEdit /></span></button>
                    <button onClick={() => handleDelete(row.Part_id)} className='bg-red-500 p-2 rounded-sm'><RiDeleteBin2Line /></button>
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowOverflow: true, // Ensure the buttons are visible
            button: true, // Makes it clear they are buttons
        }
    ];
    return (
        <div>





            <div className=''>
                <span className="text-xl font-medium text-gray-900 dark:text-white">Item Master</span>
                {/* <!-- Modal toggle --> */}
                <button type="button" onClick={(e) => handelToggleModel(e)} id="btn_Add" className="ml-3 text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full   sm:w-auto px-5 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+ Add</button>


            </div>

            <hr className='mt-3 mb-8'></hr>

            {/* <DataTableView apiData={apiData} fileName='ItemMaster_Report.xlsx' /> */}


            {/* <DataTableVIew columns={columns } apiData={apiData} setRowEditData={setRowEditData} setIsDelete={setIsDelete} SetRowDeleteID={SetRowDeleteID} /> */}
            <DataTableVIew tbl_title={'ItemMaster List'} columns={columns} apiData={apiData} />

            <div>

                {/* < !--Main modal-- > */}
                <div id="default-modal" data-modal-placement="top-right" tabIndex="-1" aria-hidden={toggleModel ? 'false' : 'true'}
                    className={`${toggleModel ? 'flex' : 'hidden'}  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`} aria-modal={toggleModel ? 'true' : ''} role={toggleModel ? 'dialog' : ''}>
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow-md dark:bg-gray-700">
                            {/* <!-- Modal header --> */}
                            <div className={`flex items-center justify-between p-3 md:p-3 border-b rounded-t ${!isEdit ? 'bg-green-300' : 'bg-yellow-300'}  dark:border-gray-600`}>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {isEdit ? 'Edit ItemMaster' : 'Add ItemMaster'}
                                </h3>
                                <button type="button" onClick={handel_CloseModel} className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div className="p-4 md:p-5 space-y-4">
                                <form onSubmit={handel_FormSubmit}>
                                    <div className="grid gap-6 mb-6 md:grid-cols-3">
                                        <div>
                                            <label htmlFor="Item_Code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item_Code</label>
                                            <input
                                                type="text"
                                                id="Item_Code"
                                                name="Item_Code"
                                                onChange={handelChange}
                                                value={data.Item_Code}
                                                placeholder="Item Code."
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <label htmlFor="PartNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Part Number</label>
                                            <input
                                                type="text"
                                                id="PartNumber"
                                                name="PartNumber"
                                                onChange={handelChange}
                                                value={data.PartNumber}
                                                placeholder="Part No."
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <label htmlFor="ModelNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model Number</label>
                                            <input
                                                type="text"
                                                id="ModelNumber"
                                                name="ModelNumber"
                                                onChange={handelChange}
                                                value={data.ModelNumber}
                                                placeholder="Model No."
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>

                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="Item_Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                        <input type="text"
                                            id="Item_Name"
                                            name="Item_Name"
                                            onChange={handelChange}
                                            value={data.Item_Name}
                                            placeholder="Part Description "
                                            required
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>


                                    <div className="grid gap-6 mb-6 md:grid-cols-3">

                                        <div>
                                            <label htmlFor="Qty" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Qty</label>
                                            <input
                                                type="number"
                                                id="Stock_Qty"
                                                name="Stock_Qty"
                                                onChange={handelChange}
                                                value={data.Stock_Qty}
                                                placeholder=""
                                                min={0}
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>

                                        <div>
                                            <label htmlFor="Supplier" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier Name</label>
                                            <input
                                                type="text"
                                                id="Supplier"
                                                name="Supplier"
                                                onChange={handelChange}
                                                value={data.Supplier}
                                                placeholder=" Name of the Supplier"
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>

                                    </div>

                                    <div className="grid gap-6 mb-6 md:grid-cols-4">
                                        <div>
                                            <label htmlFor="Purchase_Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Purchase Price</label>
                                            <input
                                                type="text"
                                                id="Purchase_Price"
                                                name="Purchase_Price"
                                                onChange={handelChange}
                                                value={data.Purchase_Price}
                                                placeholder="Enter Price of the Item"
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>

                                        <div>
                                            <label htmlFor="Sale_Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selling_Price</label>
                                            <input
                                                type="text"
                                                id="Sale_Price"
                                                name="Sale_Price"
                                                onChange={handelChange}
                                                value={data.Sale_Price}
                                                placeholder="Enter Price of the Item"
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>

                                        <div>
                                            <label htmlFor="Tax_Percent" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">GST %</label>
                                            <input
                                                type="number"
                                                id="Tax_Percent"
                                                name="Tax_Percent"
                                                onChange={handelChange}
                                                value={data.Tax_Percent}
                                                placeholder="Enter GST %"
                                                min={0}
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>

                                        <div>
                                            <label htmlFor="HSN_Code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">HSN Code</label>
                                            <input
                                                type="text"
                                                id="HSN_Code"
                                                name="HSN_Code"
                                                onChange={handelChange}
                                                value={data.HSN_Code}
                                                placeholder="Enter HSN Code"
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>
                                    </div>
                                    <button type="submit"
                                        disabled={isSubmitting} 
                                        id={`${!isEdit ? 'Save' : 'Update'}`} name={`${!isEdit ? 'Save' : 'Update'}`}
                                        className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}>{!isEdit ? 'Save' : 'Update'}</button>
                                </form>
                            </div>
                            {/* <!-- Modal footer --> */}
                            {/* <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"> */}
                            {/* <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button> */}
                            {/* <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Close</button> */}
                            {/* </div> */}
                        </div>
                    </div>
                </div>




            </div>
        </div>
    )
}
