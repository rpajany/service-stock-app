import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { DataTableVIew, PurchaseAutoComplete, DatePicker2, ReactDateRangePicker } from '../components';
// import { PurchaseDemo } from '../pages/PurchaseDemo'
import { PurchaseTableRow } from '../components/PurchaseTableRow';
import { usePurchase } from '../context/purchaseContext';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { ApiContext } from '../context/ApiProvider';
import { useBaseUrl, Load_PurchaseDetails_Service, PurchaseUpdate_Service, chatGPT_PurchaseUpdate_Service, PurchaseDelete_Service } from '../services/PurchaseEntryService'
import moment from 'moment';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { AddItemMaster } from './AddItemMaster';


// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// css properties
const tbl_thead_tr = "bg-blue-500 text-white border-r-2  border-gray-300"
const tbl_thead_th = "px-6 py-3"
const tbl_input = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"





export const PurchaseEntry = () => {

    const { purchaseList, addToPurchase, removeFromPurchase, updateFromPurchase, taxable_Amount, total, taxTotal, updateTaxable_Amount, updateTotal, clear_PurchaseItems } = usePurchase();

    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    BASE_URL = selectedApi;
    useBaseUrl(selectedApi);

    const [activeTab, setActiveTab] = useState(1);


    // const TaxableAmount_Ref = useRef(null);

    // const [purchaseItems, setPurchaseItems] = useState({});
    // const [rowItems, setRowItems] = useState({});
    const [apiData, setApiData] = useState([]);
    // const [rowEditData, setRowEditData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [rowDeleteID, SetRowDeleteID] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    // const [itemsData, setItemData] = useState({});

    const [date, setDate] = useState(new Date()); // date object

    const purchaseInitialValue = {
        Invoice_Number: '',
        Invoice_Date: '',
        Supplier: '',
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
        Balance_Amount: 0.00
    }
    const [purchaseDetails, setPurchaseDetails] = useState(purchaseInitialValue);

    const [dateRangeNow, setDateRangeNow] = useState({});

    // const [rowID, setRowIDs] = useState(1);
    const rowID = 1;
    // let rowCount = 1;




    // useEffect(() => {
    //     console.log('isEdit...!!')
    // }, [isEdit])

    // useEffect(() => {
    //     setRowItems((preve) => {
    //         return {
    //             ...preve,
    //             Invoice_Number: purchaseDetails.Invoice_Number
    //         }
    //     })

    // }, [rowItems, purchaseDetails.Invoice_Number])


    // console.log('purchaseList', purchaseList)
    // console.log('purchaseDetails', purchaseDetails)
    // console.log(moment(new Date()).format('DD-MM-YYYY'))
    // console.log('date', date)



    const purchaseHandel = (e) => {
        const { name, value } = e.target
        // console.log('name', name);
        // console.log('value', value);

        setPurchaseDetails((preve) => {
            return {
                ...preve, [name]: value
            }
        })
    }

    // set time
    useEffect(() => {



        setPurchaseDetails((preve) => {
            return {
                ...preve,
                // Invoice_Date: isEdit ? purchaseDetails.Invoice_Date: moment(date).format('DD-MM-YYYY'),
                Invoice_Date: moment(date).format('DD-MM-YYYY'),
                Taxable_Amount: taxable_Amount.toFixed(2),
                SGST: purchaseDetails.State === 'PUDUCHERRY' ? (taxTotal / 2).toFixed(2) : (0).toFixed(2),
                CGST: purchaseDetails.State === 'PUDUCHERRY' ? (taxTotal / 2).toFixed(2) : (0).toFixed(2),
                IGST: purchaseDetails.State === 'OTHERS' ? taxTotal.toFixed(2) : (0).toFixed(2),
                Total_Amount: total.toFixed(2),
                Balance_Amount: (total - purchaseDetails.Amount_Paid).toFixed(2)

            }
        })
    }, [date, taxable_Amount, taxTotal, total, purchaseDetails.Taxable_Amount, purchaseDetails.Amount_Paid, purchaseDetails.State])

    // console.log('taxable_Amount :', taxable_Amount)
    // console.log(' date : ', date)
    // console.log(' date : ', moment(date).format('YYYY-MM-DD'))
    // console.log('purchaseDetails_date : ', purchaseDetails.Invoice_Date)
    // console.log('new Date() : ', new Date())
    // console.log('new Date()2 : ', moment(purchaseDetails.Invoice_Date).format('YYYY-MM-DD'))

    // console.log('rowEditData', rowEditData);
    // console.log('purchaseList', purchaseList);

    // useEffect(() => {
    //     console.log('rowEditData updated:', rowEditData);
    // }, [rowEditData]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission


        if (!isEdit) {  // save function ...
            try {
                // 1st API save Purchase Details
                const url = BASE_URL + '/purchase_detail/insert';
                const result1 = await POST_Api(url, '', purchaseDetails);
                console.log('1st api insert :', result1);
                // end 1st api

                // save items data in loop ...
                purchaseList.forEach(async (item) => {
                    const part_id = item.Part_id;
                    const qty_StockAdd = item.Qty;
                    const itemName = item.Item_Name;

                    // 2nd API request, 
                    const url_getItem = BASE_URL + `/item_master/get_item/${part_id}`;
                    const output = await GET_Api(url_getItem, ' ');
                    const { Item_Name, Stock_Qty } = output[0];
                    // console.log('output', output)
                    // console.log('Item_Name', Item_Name)
                    // console.log('Stock_Qty', Stock_Qty)

                    // stock add ...
                    let hand_StockQty = (Stock_Qty + qty_StockAdd);

                    // 3rd API request,
                    const url_updateStock = BASE_URL + `/item_master/update/${part_id}`;
                    const result2 = await POST_Api(url_updateStock, '', { Stock_Qty: hand_StockQty });
                    console.log('3rd:- update Stock :', result2);
                    // end url_updateStock



                    // 4th API request
                    const url_StockDetail_Report = BASE_URL + '/stockDetail_report/insert';
                    const result3 = await POST_Api(url_StockDetail_Report, '', {

                        Type: 'Purchase',
                        Invoice_Number: purchaseDetails.Invoice_Number,
                        Invoice_Date: purchaseDetails.Invoice_Date,
                        Item_Name: item.Item_Name,
                        PartNumber: item.PartNumber,
                        ModelNumber: item.ModelNumber,
                        Stock_Qty: item.Stock_Qty,
                        Transact_Qty: item.Qty,
                        HandStock_Qty: hand_StockQty,
                        Remarks: 'Purchase Add - New',

                    });

                    console.log('4th api:- StockDetail_Report Insert :', result3);

                    // 5th API request, only after the first one is successful
                    const url2 = BASE_URL + '/purchase/insert';
                    const result4 = await POST_Api(url2, '', { ...item, Invoice_Date: purchaseDetails.Invoice_Date });
                    console.log('5th api insert :', result4);

                    // reset forrm values
                    setPurchaseDetails(purchaseInitialValue);
                    clear_PurchaseItems();

                    toast.success('Save success...!')

                })

            } catch (error) {
                console.log('Error :', error)
                toast.error(error.message)
            } finally {
                // setPurchaseItems({}); // reset form
                setIsSubmitting(false); // Unlock the form
            }
            // End if save function ...
        } else if (isEdit) {
            try {

                // get old purchase items to store in setRowEditData ...
                // let invoiceNumber = purchaseDetails.Invoice_Number;
                // const param = invoiceNumber; // "BIOS/2556/24-25" new code added
                // const encodedParam = encodeURIComponent(param); //  new code added
                // console.log('encodedParam', encodedParam)
                // const url_geturchase = BASE_URL + `/purchase/get_purchase/${encodedParam}`;
                // const result_Data = await GET_Api(url_geturchase, '');
                // console.log('1. get old purchase items', result_Data);

                // Confirm result_Data is an array or convert it
                // const Edit_DataArray = Array.isArray(result_Data) ? result_Data : Object.values(result_Data);
              


                // await PurchaseUpdate_Service(purchaseDetails, Edit_DataArray, purchaseList)

                // reset forrm values
                // setPurchaseDetails(purchaseInitialValue);
                // clear_PurchaseItems();
                // setIsEdit(false);

                // toast.success('Update success...!')


                // ........... CHATgpt Code ....................

                // Step 1: Encode Invoice Number and fetch old purchase data
                const invoiceNumber = purchaseDetails.Invoice_Number;
                if (!invoiceNumber) throw new Error("Invoice Number is missing.");
                const encodedParam = encodeURIComponent(invoiceNumber);
                console.log("Encoded Invoice Number:", encodedParam);

                const urlGetPurchase = `${BASE_URL}/purchase/get_purchase/${encodedParam}`;
                const resultData = await GET_Api(urlGetPurchase, "");
                console.log("1. Old Purchase Items Retrieved:", resultData);

                // Ensure resultData is an array
                const editDataArray = Array.isArray(resultData) ? resultData : Object.values(resultData);

                // Step 2: Update Purchase Details
                await chatGPT_PurchaseUpdate_Service(purchaseDetails, editDataArray, purchaseList);

                // Step 3: Reset form and flags
                setPurchaseDetails(purchaseInitialValue);
                clear_PurchaseItems();
                setIsEdit(false);

                toast.success("Update success!");


            } catch (error) {
                console.error("Error during update process:", error);
            } finally {

                setIsSubmitting(false); // Unlock the form
            }
        }

    } // End of handleSubmit function ...



    // const get_stockDetails = async (part_id) => {
    //     const url_getItem = process.env.REACT_APP_BACKEND_BASE_URL + `/item_master/get_item/${part_id}`;     
    //     const apiResponse = await GET_Api(url_getItem, ' ')
    //       return apiResponse; // Return the data object

    // }














    // -------------- View Report ----------------------------------
    // const [apiData, setApiData] = useState([]);


    // function load data:
    async function load_Data() {
        try {
            // const url_purchaseReport = process.env.REACT_APP_BACKEND_BASE_URL + '/purchase_detail/load';
            // await GET_Api(url_purchaseReport, '').then((data) => {
            //     setApiData(data);
            // })


            if (Object.keys(dateRangeNow).length !== 0) {
                const output = await Load_PurchaseDetails_Service(dateRangeNow);

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
            // reset forrm values
            setPurchaseDetails(purchaseInitialValue);
            clear_PurchaseItems();
            setIsEdit(false);
        }

    }, [activeTab, dateRangeNow])



    // Handle Edit button click
    const handleEdit = async (row) => {
        // console.log(row)
        setActiveTab(2);
        setIsEdit(true);

        // console.log('handleEdit called !!!')


        // console.log('isEdit :', isEdit)

        setPurchaseDetails((preve) => { // edit purchase Details
            return {
                ...preve, ...row
            }
        })

        // console.log('PurchaseDetails', row)

        setDate(date_strToObject(row['Invoice_Date'])); // set edit date


        try {
            let invoiceNumber = row['Invoice_Number'];
            const param = invoiceNumber; // "BIOS/2556/24-25" new code added
            const encodedParam = encodeURIComponent(param); //  new code added

            const url_geturchase = BASE_URL + `/purchase/get_purchase/${encodedParam}`; // ${invoiceNumber}
            const result = await GET_Api(url_geturchase, '');

            // setRowEditData((preve) => {
            //     return {
            //         ...preve, ...result
            //     }
            // })

            addToPurchase(result)

            // updateEditRowStates(result);

            // console.log('typeof ', typeof (result))
            // setRowEditData((preve) => {
            //     const updatedRowData = { ...preve, ...data };
            //     return updatedRowData;
            // })

            // setRowEditData(prevState => ({
            //     ...prevState, // Spread the previous state to preserve other fields
            //     ...result // Update only the email field
            // }));

            // console.log('rowEditData :', rowEditData)

            // result.forEach(item => {

            // console.log("Item", item)
            // updateEditRowStates(item);



            // const unitPrice = (item.Purchase_Price * item.Qty);
            // const taxAmount = ((unitPrice * item.Tax_Percent) / 100);
            // const itemTotal = (unitPrice + taxAmount);

            // const dataNew = {
            //     ...item,


            //     Qty: 1,
            //     Discount_Amount: 0,
            //     Discount_Percent: 0,
            //     taxable_Amount: unitPrice,
            //     Tax_Amount: taxAmount,
            //     Tax_Percent: item.Tax_Percent,
            //     Total: itemTotal
            // }

            // console.log("dataNew :", dataNew)

            // addToPurchase({ ...item, taxable_Amount: unitPrice }); // add to context state


            // setRowEditData(preve => ({ ...preve, ...item }));
            // });


            // console.log('setRowEditData', rowEditData)





            // setRowEditData({result});
            // setRowEditData(preve => ({ preve, result }));
            // setRowEditData((preve) => {
            //     return { ...preve, result }
            // });
        } catch (error) {
            console.log('Error :', error)
        }

        // rowEditData && rowEditData.map((item) => (
        //     console.log(item)
        // ))

        // console.log('edit_data', purchaseItems)




        // console.log('Edit button clicked for:', row['Invoice_Date']);

    };

    // console.log('setRowEditData', rowEditData)
    // console.log('purchaseList', purchaseList)
    // console.log('purchaseDetail ', purchaseDetails)



    // function updateEditRowStates(result) {
    //     console.log('result', result)


    //     result.forEach((item) => {

    //         const unitPrice = (item.Purchase_Price * item.Qty);


    //         const dataNew = {
    //             ...item,
    //             taxable_Amount: unitPrice
    //         }

    //         console.log('typeof', typeof (dataNew));
    //         return addToPurchase(dataNew); // add to context state
    //     });   
    // }

    // Handle Delete button click
    const handleDelete = (row) => {
        // SetRowDeleteID(rowId)
        // setIsDelete(true);

        // console.log('Deletebutton clicked for:', row);

        // const filteredData = data.filter((row) => row.Part_id !== rowId);
        // setData(filteredData);
        // console.log('isDelete', isDelete);
        // console.log('rowDeleteID', rowDeleteID);

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


                await PurchaseDelete_Service(row)
                setPurchaseDetails(purchaseInitialValue);
                clear_PurchaseItems();
                load_Data();
                // reset state
                // setIsDelete(false);
                // SetRowDeleteID('');
            } else if (result.isDismissed) {
                console.log('dismiss', 'yes')
            }
        })

    };

    // Define table columns
    const columns = [
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
            name: 'Supplier',
            selector: row => row.Supplier,
            sortable: true
        },
        {
            name: 'Address',
            selector: row => row.Address,
            sortable: true
        },
        {
            name: 'GSTIN',
            selector: row => row.GSTIN,
            sortable: true
        },
        {
            name: 'Taxable_Amount',
            selector: row => row.Taxable_Amount,
            sortable: true
        },
        {
            name: 'SGST',
            selector: row => row.SGST,
            sortable: true
        },
        {
            name: 'CGST',
            selector: row => row.CGST,
            sortable: true
        },
        {
            name: 'IGST',
            selector: row => row.IGST,
            sortable: true
        },
        {
            name: 'Total_Amount',
            selector: row => row.Total_Amount,
            sortable: true
        },
        {
            name: 'Amount_Paid',
            selector: row => row.Amount_Paid,
            sortable: true
        },
        {
            name: 'Balance_Amount',
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
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>
                    <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1'><span><FaEdit /></span></button>
                    {/* <button onClick={() => handleDelete(row.id)} className='bg-red-500 p-2 rounded-sm'><RiDeleteBin2Line /></button> */}
                    <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm'><RiDeleteBin2Line /></button>
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowoverflow: true, // Ensure the buttons are visible - "allowOverflow"
            // button: true, // Makes it clear they are buttons
        }
    ];

    // console.log('apiData', apiData);
    // console.log('purchaseDetails', purchaseDetails);
    // console.log('date', date)
    // console.log('data convert', new Date(moment(date).format('YYYY-MM-DD')))

    // ----- toggle ItemMaster Popup -------------
    const [toggleModel, setToggleModel] = useState(false);
    const [reLoad, setReLoad] = useState(false);

    const handelToggleModel = (e) => {
        let btnName = e.currentTarget.id
        if (btnName === 'btn_Add') {
            // setData(initialValue); // reset form on add button click
            setToggleModel(!toggleModel);
        } else {

        }

        setReLoad(!reLoad); // reload autoComplete
    }

    // console.log('toggleModel', toggleModel)






    return (
        <>
            {/* <PurchaseDemo isEdit={isEdit} /> */}

            <div className="w-full mx-auto p-1">
                {/* Tab navigation */}
                <ul className="flex space-x-4 border-b-2 border-gray-200">
                    <li className={`cursor-pointer p-2 ${activeTab === 1 ? 'text-blue-600 border-blue-600 border-b-2  bg-yellow-100 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(1)}>
                        View Purchase
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2  bg-yellow-100 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        Purchase Entry
                    </li>
                </ul>

                {/* Tab content */}
                <div className="mt-4">
                    {activeTab === 1 && (
                        <div className="p-4 bg-gray-100 rounded-lg"  >
                            {/* <h2 className="text-lg font-semibold">Content for Tab 1</h2> */}
                            <div className='border-2 '>
                                <div className='bg-yellow-500 py-2 px-5' style={{ backgroundColor: '#ffc107' }} >
                                    <i className="fa fa-shopping-cart">Report View</i>
                                </div>
                                <div className='p-4' style={{ backgroundColor: '#FFFFB3' }}>
                                    <div className='flex mb-4'>

                                        <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
                                    </div>
                                    <DataTableVIew tbl_title={''} columns={columns} apiData={apiData} />
                                </div>

                            </div>
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="p-4 bg-gray-100 rounded-lg" >
                            {/* <h2 className="text-lg font-semibold">Content for Tab 2</h2> */}

                            <div className='border-2 '>
                                <div>

                                    <div className='bg-yellow-500 py-2 px-5' style={{ backgroundColor: '#ffc107' }} >
                                        <i className="fa fa-shopping-cart">Purchase Entry</i>
                                    </div>
                                    <div className='p-4' style={{ backgroundColor: '#FFFFB3' }}>

                                        {toggleModel && (
                                            <AddItemMaster toggleModel={toggleModel} setToggleModel={setToggleModel} />
                                        )}
                                        <form onSubmit={handleSubmit} className=''>
                                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                                {/* Start  col - 1 */}
                                                <div className='grid gap-2 sm:grid-cols-1 sm:gap-4'>
                                                    <div className="w-full">
                                                        <label htmlFor="Supplier" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier Name</label>
                                                        <input type="text"
                                                            name="Supplier"
                                                            id="Supplier"
                                                            onChange={(e) => purchaseHandel(e)}
                                                            value={purchaseDetails.Supplier}
                                                            placeholder="Bill From Name"
                                                            required
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                                                    </div>

                                                    <div className="w-full">
                                                        <label htmlFor="Address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                                        <textarea
                                                            id="Address"
                                                            name="Address"
                                                            onChange={(e) => purchaseHandel(e)}
                                                            value={purchaseDetails.Address}
                                                            rows="4"
                                                            placeholder="Your description here"
                                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" ></textarea>
                                                    </div>

                                                    <div className="w-full">
                                                        <label htmlFor="State" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>

                                                        <select
                                                            id="State"
                                                            name="State"
                                                            onChange={(e) => purchaseHandel(e)}
                                                            value={purchaseDetails.State}
                                                            required
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                                            <option value="">- Select -</option>
                                                            <option value="PUDUCHERRY">PUDUCHERRY</option>
                                                            <option value="OTHERS">OTHERS</option>
                                                        </select>

                                                        {/* <input type="text"
                                        name="State"
                                        id="State"
                                        onChange={(e) => purchaseHandel(e)}
                                        value={purchaseDetails.State}
                                        placeholder="Location"
                                        required=""
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" /> */}
                                                    </div>


                                                    <div className="w-full">
                                                        <label htmlFor="GSTIN" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">GSTIN</label>
                                                        <input type="text"
                                                            name="GSTIN"
                                                            id="GSTIN"
                                                            onChange={(e) => purchaseHandel(e)}
                                                            value={purchaseDetails.GSTIN}
                                                            placeholder="GSTIN2999"
                                                            // required
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                                                    </div>


                                                </div>
                                                {/* End  col - 1 */}




                                                {/* Start  col -2 */}
                                                <div className='flex flex-col md:grid-cols-2   sm:gap-4'>
                                                    <div className='flex flex-row space-x-8'>
                                                        <div className="">
                                                            <label htmlFor="Invoice_Number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">InvoiceNo.</label>
                                                            <input type="text"
                                                                name="Invoice_Number"
                                                                id="Invoice_Number"
                                                                onChange={(e) => purchaseHandel(e)}
                                                                value={purchaseDetails.Invoice_Number}
                                                                placeholder="Invoice Number"
                                                                required
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                                                        </div>
                                                        <div className="">
                                                            {/* <label htmlFor="Invoice_Date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Invoice Date</label> */}
                                                            <DatePicker2 title={'Invoice Date'} date={date} setDate={setDate} />
                                                            {/* <div className="relative max-w-sm">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                                </svg>
                                            </div>
                                            <input 
                                                type="text"
                                                id="Invoice_Date"
                                                onSelect={(e) => console.log(e.target.value)}
                                                // onClick={(e) => dobHandler(e)}
                                                // onClick={(e) => console.log(e.target.value)}
                                                // onChange={(e) => console.log(e)}
                                                datepicker datepicker-buttons datepicker-autoselect-today
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
                                        </div>                                      */}
                                                        </div>

                                                    </div>


                                                    {/* <div className="w-full">
                                                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                                        <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                                            <option defaultValue="">Select category</option>
                                                            <option value="TV">TV/Monitors</option>
                                                            <option value="PC">PC</option>
                                                            <option value="GA">Gaming/Console</option>
                                                            <option value="PH">Phones</option>
                                                        </select>
                                                    </div> */}
                                                </div>
                                                {/* End  col -2 */}




                                            </div>


                                            <div className=' overflow-x-auto border-2 border-blue-500  mt-3'>

                                                <div className='flex     items-center '>
                                                    {/* <span className='px-2 pr-2    '>Search </span> */}
                                                    <button type="button" onClick={(e) => handelToggleModel(e)} id="btn_Add" className="ml-3 text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm w-full   sm:w-auto px-5 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+ Add</button>
                                                    <PurchaseAutoComplete
                                                        Invoice_Number={purchaseDetails.Invoice_Number}
                                                        reLoad={reLoad}
                                                        // setRowItems={setRowItems}
                                                        inputName="txt_ItemName_1"
                                                        txt_css={`${tbl_input} w-full`} />
                                                </div>

                                                <table className='w-full'>
                                                    <thead>
                                                        <tr className={tbl_thead_tr}>
                                                            <th scope="col" className="px-6 py-3 w-12  border-r-2  border-gray-300">#</th>
                                                            <th scope="col" className="px-6 py-3 border-r-2  border-gray-300">ItemCode</th>
                                                            <th scope="col" className="px-6 py-3 w-full border-r-2  border-gray-300">Items</th>
                                                            <th scope="col" className="px-6 py-3 w-60 border-r-2  border-gray-300">HSN</th>
                                                            {/* <th scope="col" className="px-6 py-3 border-r-2  border-gray-300">MRP</th> */}
                                                            <th scope="col" className="px-6 py-3 border-r-2  border-gray-300">QTY</th>
                                                            <th scope="col" className="px-6 py-3 border-r-2  border-gray-300">PRICE/ITEM</th>
                                                            <th scope="col" className="px-6 py-3 border-r-2  border-gray-300">DISCOUNT</th>
                                                            <th scope="col" className="px-6 py-3 border-r-2  border-gray-300">TAX</th>
                                                            <th scope="col" className="px-6 py-3 border-r-2  border-gray-300">AMOUNT</th>
                                                            <th scope="col" className="px-6 py-3 ">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {
                                                            purchaseList.length <= 0 ?
                                                                <tr id={rowID} className='border-b-2 border-l-2 border-r-2 border-gray-300 '>
                                                                    <td className='border-r-2  border-gray-300 px-1'><input type="text" className={`${tbl_input} w-12`} id="txt_SL_1" name="txt_SL_1" placeholder="" defaultValue="1" readOnly="" /></td>
                                                                    <td className='border-r-2  border-gray-300 px-1'><input type="text" className={`${tbl_input} w-full`} id="txt_ItemCode_1" name="txt_ItemCode_1" placeholder="Code." autoComplete="off" /></td>
                                                                    <td className='border-r-2  border-gray-300 px-1'><input type="text" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" id="txt_ItemName_1" name="txt_ItemName_1" placeholder="Item Desc." value="" required="" readOnly="readonly" autoComplete="off" /></td>
                                                                    {/* <td><AutoComplete setRowItems={setRowItems} inputName="txt_ItemName_1" txt_css={`${tbl_input} w-full`} autoComplete="off" /></td> */}
                                                                    <td className='border-r-2  border-gray-300 px-1'><input type="text" className={`${tbl_input} w-18`} id="txt_HSNcode_1" name="txt_HSNcode_1" placeholder="HSN" autoComplete="off" /></td>
                                                                    {/* <td className='border-r-2  border-gray-300 px-1'><input type="text" className={`${tbl_input} w-24`} id="txt_MRP_1" name="txt_MRP_1" value="100000.00" placeholder="0.00" required="" autoComplete="off" /></td> */}
                                                                    <td className='border-r-2  border-gray-300 px-1'><input type="number" className={`${tbl_input} w-full`} id="txt_Qty_1" name="txt_Qty_1" min="1" defaultValue="1" required="" /><input type="hidden" id="txt_StockQty_1" name="txt_StockQty_1" style={{ Display: 'none' }} /></td>
                                                                    <td className='border-r-2  border-gray-300 px-1'>
                                                                        <input type="text" className={`${tbl_input} w-24`} id="txt_Price_1" name="txt_Price_1" defaultValue="0.00" placeholder="0.00" required="" autoComplete="off" />
                                                                    </td>

                                                                    <td className='border-r-2  border-gray-300 px-1'>
                                                                        <input type="text" className={`${tbl_input} w-24`} id="txt_DiscountPercent_1" name="txt_DiscountPercent_1" placeholder="0.00" defaultValue="0" required="" /><span>&nbsp;%</span>
                                                                        <input type="text" id="txt_DiscountAmount_1" name="txt_DiscountAmount_1" defaultValue="0.00" className={`${tbl_input} w-24`} />
                                                                    </td>

                                                                    <td className='border-r-2  border-gray-300 px-1'>

                                                                        <input type="text" id="txt_TaxPer_1" name="txt_TaxPer_1" defaultValue="0" className={`${tbl_input} w-24`} readOnly="" /><span>&nbsp;%</span>
                                                                        <input type="text" className={`${tbl_input} w-full`} id="txt_TaxAmt_1" name="txt_TaxAmt_1" defaultValue="0.00" required="" />


                                                                    </td>
                                                                    <td className='border-r-2  border-gray-300 px-1'><input type="text" className={`${tbl_input} w-full`} id="txt_Amount_1" name="txt_Amount_1" defaultValue="0.00" placeholder="0.00" required="" autoComplete="off" readOnly="" /></td>
                                                                    <td className='flex flex-col text-center px-2 py-10 '><button type="button" id="1" className="bg-red-500 text-white py-1 px-1 rounded-full btn-danger disabled btn-sm btn_remove_row">X</button></td>

                                                                </tr>
                                                                :
                                                                <PurchaseTableRow />
                                                        }




                                                        {/* 
                                    <button
                                        type='button'
                                        onClick={handelRowAdd}
                                        className=' block  w-full mt-3 bg-green-500 text-white p-1 rounded-lg' style={{ width: '100%' }}>+ Item
                                    </button> */}


                                                    </tbody>
                                                </table>

                                                <div className='border-t-2 border-blue-500 mt-3 grid grid-cols-3  p-3'>

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
                                                                    // ref={TaxableAmount_Ref}
                                                                    onChange={(e) => purchaseHandel(e)}
                                                                    value={purchaseDetails.Taxable_Amount}
                                                                    className="form-control col-sm-4 input-right" />
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
                                                                    onChange={(e) => purchaseHandel(e)}
                                                                    value={purchaseDetails.SGST}
                                                                    className="form-control col-sm-4 input-right" readOnly="" />
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
                                                                    onChange={(e) => purchaseHandel(e)}
                                                                    value={purchaseDetails.CGST}
                                                                    className="form-control col-sm-4 input-right" readOnly="" />
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
                                                                    onChange={(e) => purchaseHandel(e)}
                                                                    value={purchaseDetails.IGST}
                                                                    className="form-control col-sm-4 input-right" readOnly="" />
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
                                                                    onChange={(e) => purchaseHandel(e)}
                                                                    value={purchaseDetails.Total_Amount}
                                                                    className="form-control col-sm-4 input-right" required="" readOnly="" />
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
                                                                    onChange={(e) => purchaseHandel(e)}
                                                                    // onBlur={(e)=>handleBlur(e)}
                                                                    value={purchaseDetails.Amount_Paid}
                                                                    className="form-control col-sm-2 input-right" required="" />
                                                            </div>


                                                            <select id="Pay_Mode" name="Pay_Mode" value={purchaseDetails.Pay_Mode} onChange={(e) => purchaseHandel(e)} className="col-sm-2" >
                                                                <option value="">-- Select --</option>
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
                                                                    onChange={(e) => purchaseHandel(e)}
                                                                    value={purchaseDetails.Balance_Amount}
                                                                    className="" readOnly="" />
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
                                                                    onChange={(e) => purchaseHandel(e)}
                                                                    value={purchaseDetails.Pay_Note}
                                                                    placeholder='Payment Details'
                                                                    className="w-full" />
                                                            </div>



                                                        </div>




                                                        <div className="row nopadding">
                                                            {/* <div className="col-sm-3">
                                            <input type="hidden" name="txt_rowCount" id="txt_rowCount" value="1" />
                                            <input type="hidden" id="txt_rowID" name="txt_rowID" value="" />
                                            <input type="hidden" id="action" name="action" value="Insert" />
                                        </div> */}

                                                            <button type="submit"
                                                                disabled={isSubmitting}
                                                                className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-full  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>
                                                        </div>

                                                    </div>
                                                </div>


                                            </div>



                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div> {/* End Tab */}



        </>

    )
}
