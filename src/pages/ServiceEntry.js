import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, RadioButton, ServiceSearch } from '../components';
import { Save_ServiceData_Service } from '../services/Service';
import { ApiContext } from '../context/ApiProvider';
import { useAuth } from '../context/AuthContext';
import { DataTableVIew, DatePicker2, ReactDateRangePicker } from '../components';
import { Get_BaseUrl } from '../helpers/custom';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';
import { useBaseUrl, Load_ServiceEntry_Service, Load_ServiceByEngineer_Service, Get_ServiceData_Service, Get_CustomerData_Service, Load_Engineers_Service, Update_ServiceData_Service } from '../services/Service';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FaEdit, FaPrint } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";


// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-lg border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

export const ServiceEntry = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);
    BASE_URL = selectedApi;

    const navigate = useNavigate();

    const { authData } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    const [activeTab, setActiveTab] = useState(1);
    const [openItems, setOpenItems] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState(new Date()); // date object   
    const [initialCheckDate, setInitialCheckDate] = useState(new Date()); // date object 
    const [serviceDate, setServiceDate] = useState(new Date()); // date object 
    const [dateRangeNow, setDateRangeNow] = useState({}); // {}
    const [apiData, setApiData] = useState([]);

    const [customerSearch, setCustomerSearch] = useState(null);

    const [serviceUID, setServiceUID] = useState('');
    const [customerUID, setCustomerUID] = useState('');

    const Customer_InitialData = {
        Cust_id: "",
        Customer_Name: "",
        Address: "",
        State: "",
        Email: "",
        Mobile: "",
        GSTIN: "",
    }

    const Service_InitialData = {
        Serv_id: "",
        Cust_id: "",
        Job_No: "",
        Service_Type: "",
        Product_Type: "",
        Brand: "",
        Model_Name: "",
        Model_Number: "",
        Product_Colour: "",
        Configuration: "",
        Password: "",
        Serial_No: "",
        Status: "",
        Problem_Reported: "",
        Condition: "",
        Estimate: "",
        Advance: "",
        Delivery_Date: "",
        Remarks: "",
        Assign_Engineer: "",
        Initial_CheckDate: "",
        Revised_Estimate: "",
        Problem_Dignosed: "",
        Move_To: "",
        Service_Date: "",
        Bill_Type: "",
        Total_Pages: "",
        Service_Charge: "",
        Engineer_Remarks: "",
        Customer_Remarks: ""
    }

    const [selectedDevices, setSelectedDevices] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(Customer_InitialData); // {}
    const [customerData, setCustomerData] = useState(Customer_InitialData);
    const [serviceData, setServiceData] = useState(Service_InitialData);
    const [engineer, setEngineer] = useState([]);

    const [accessory, setAccessory] = useState([]);
    const [spares, setSpares] = useState([]);

    const serviceType_Array = ['Carry In', 'Pick Up', 'On Site'];
    const [serviceTypeOption, setServiceTypeOption] = useState(serviceType_Array[0]);

    const moveTo_Array = ['Open', 'Return without service', 'Customer Pending', 'Customer Approved', 'Service Completed', 'Delivered'];
    const [moveToOption, setMoveToOption] = useState(moveTo_Array[0]);

    const filter_Array = ['All', 'Open', 'Return without service', 'Customer Pending', 'Customer Approved', 'Service Completed', 'Delivered'];
    const [selectedFilter, setSelectedFilter] = useState(filter_Array[0]);

    const billingType_Array = ['WARRENTY SERVICE', 'PAID SERVICE', 'REPEATED SERVICE'];
    const [billingTypeOption, setBillingTypeOption] = useState(billingType_Array[0]);


    const toggleItem = (id) => {
        setOpenItems((prevOpenItems) =>
            prevOpenItems.includes(id)
                ? prevOpenItems.filter((itemId) => itemId !== id)
                : [...prevOpenItems, id]
        );
    };

    // Customer input data ...
    const handle_CustomerInput_Change = (e) => {
        const { name, value } = e.target;

        console.log('name', name)
        console.log('value', value)

        // if (!selectedCustomer.length >= 1) { // only new customer
        setCustomerData((preve) => ({
            ...preve,
            [name]: value
        }));
        // }


    }

    // Service input data ...
    const handle_ServiceInput_Change = (e) => {
        const { name, value } = e.target;

        // console.log('name', name)
        // console.log('value', value)

        setServiceData((preve) => ({
            ...preve,
            [name]: value
        }))

    }

    // console.log('serviceData', serviceData)
    // console.log('customerData', customerData)
    // console.log('engineer', engineer)
    // console.log('serviceUID', serviceUID)
    // console.log('customerUID', customerUID)

    console.log('dateRangeNow', dateRangeNow)
    // console.log('selectedFilter :', selectedFilter)

    const handle_ServiceType_OptionChange = (e) => {
        console.log('option selected : ', e.target.value)
        // setServiceTypeOption((preve) => ({
        //     ...preve,
        //     ...{ Service_Type: e.target.value }
        // }));

        // setServiceTypeOption(e.target.value)


        setServiceData((preve) => {
            return {
                ...preve,
                Service_Type: e.target.value
            }
        });
    }


    useEffect(() => {
        setServiceData((preve) => {
            return {
                ...preve,
                Service_Type: serviceTypeOption,
                Move_To: moveToOption,
                Bill_Type: billingTypeOption,
                Delivery_Date: moment(deliveryDate).format('DD-MM-YYYY'),
                Initial_CheckDate: moment(initialCheckDate).format('DD-MM-YYYY'),
                Service_Date: moment(initialCheckDate).format('DD-MM-YYYY')
            }
        });
    }, [serviceTypeOption, moveToOption, billingTypeOption, deliveryDate, initialCheckDate])





    useEffect(() => {
        setCustomerData((preve) => ({
            ...preve,
            ...selectedCustomer
        }));

        if (selectedCustomer && selectedCustomer.Cust_id) {
            setServiceData((prev) => ({
                ...prev,
                Cust_id: selectedCustomer.Cust_id ? selectedCustomer.Cust_id : ''
            }));
        }

    }, [selectedCustomer])



    useEffect(() => {
        setServiceData((preve) => ({
            ...preve,
            ...selectedDevices,


        }));
    }, [selectedDevices])

    console.log('customerData :', customerData)
    console.log('selectedCustomer :', selectedCustomer)
    console.log('selectedDevices :', selectedDevices);

    async function get_ServiceUID() {
        try {
            const url_serviceUID = BASE_URL + '/uid/get_serviceUID';
            const serviceUID = await GET_Api(url_serviceUID, '');
            let job_No = "";

            if (authData.Company === 'Magnanim Systems') {
                job_No = 'MSP' + (serviceUID[0].Service_UID + 1);
            } else if (authData.Company === 'Global Systems') {
                job_No = 'GSP' + (serviceUID[0].Service_UID + 1);
            }
            // console.log('Get Service_UID  :', serviceUID[0].Service_UID);
            setServiceData((preve) => {
                return {
                    ...preve,
                    Job_No: job_No, //'MSP' + (serviceUID[0].Service_UID + 1),
                    Service_Type: serviceTypeOption
                }
            });

            setServiceUID(serviceUID[0].Service_UID + 1);

        } catch (error) {
            console.error('Get salesUID  :', error.message);
        }
    }

    async function get_CustomerUID() {
        try {
            const url_customerUID = BASE_URL + '/uid/get_customerUID';
            const customerUID = await GET_Api(url_customerUID, '');
            // console.log('Get Service_UID  :', serviceUID[0].Service_UID);
            setServiceData((preve) => {
                return {
                    ...preve,
                    Cust_id: (customerUID[0].Customer_UID + 1)

                }
            });

            setCustomerData((preve) => ({
                ...preve,
                Cust_id: (customerUID[0].Customer_UID + 1)
            }));

            setCustomerUID(customerUID[0].Customer_UID + 1);

        } catch (error) {
            console.error('Get salesUID  :', error.message);
        }
    }

    // function load data:
    async function load_Data() {
        try {

            if (Object.keys(dateRangeNow).length !== 0) {

                let output = "";

                if (authData['role'] === 'admin') {
                    output = await Load_ServiceEntry_Service(dateRangeNow, selectedFilter);
                } else if (authData['role'] === 'Engineer') {
                    const eng_Name = authData['username']
                    console.log('eng_Name', eng_Name)
                    output = await Load_ServiceByEngineer_Service(dateRangeNow, eng_Name, selectedFilter);
                }


                //  console.log('Get Api Data :', output); // Handle success
                setApiData(output);
            }



        } catch (error) {
            console.error('Get Api Data :', error.message); // Handle error
        }
    }


    useEffect(() => {
        load_Data();
    }, [selectedFilter])

    // function load Engineer 
    async function load_Engineer() {
        try {
            const output2 = await Load_Engineers_Service();
            setEngineer(output2)
        } catch (error) {
            console.error('Get Engineer Names :', error.message); // Handle error
        }
    }



    useEffect(() => {

        if (activeTab === 1) {
            load_Data();

            // reset form
            setCustomerData(Customer_InitialData);
            setServiceData(Service_InitialData);
            setIsEdit(false);
            setActiveTab(1);

            setServiceTypeOption(serviceType_Array[0]);
            setMoveToOption(moveTo_Array[0]);
            setServiceTypeOption(serviceType_Array[0]);
            setBillingTypeOption(billingType_Array[0]);

            setServiceDate(new Date());
            setDeliveryDate(new Date());
            setInitialCheckDate(new Date());

            setSelectedCustomer(null);
            setSelectedDevices(null);


            // get_ServiceUID();
            // get_CustomerUID();
            setServiceUID("");
            setCustomerUID("");
        }

        if (activeTab === 2 && !isEdit) {
            get_ServiceUID();
            get_CustomerUID();
            load_Engineer();

        }

        if (activeTab === 2 && isEdit) {
            load_Engineer();
        }

    }, [activeTab, isEdit, dateRangeNow]) // dateRangeNow


    async function Update_CustomerUID() {
        try {
            // const newUID = customerData.Cust_id;
            // console.log('newUID', newUID)
            const url_updateCustomerUID = BASE_URL + `/uid/update_customerUID/1`;
            const output = await POST_Api(url_updateCustomerUID, '', { Customer_UID: customerUID });
            console.log('Update_CustomerUID :', output);
        } catch (error) {
            console.error('Update_CustomerUID  :', error.message); // Handle error
        }
    }

    async function Update_ServiceUID() {
        try {
            // const newUID = (serviceData.Job_No).substring(3);
            // console.log('newUID', newUID)
            const url_updateServiceUID = BASE_URL + `/uid/update_serviceUID/1`;
            const output = await POST_Api(url_updateServiceUID, '', { Service_UID: serviceUID });
            console.log('Update_ServiceUID :', output);
        } catch (error) {
            console.error('Update_ServiceUID  :', error.message); // Handle error
        }
    }

    const handelFormSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        if (!isEdit) {  // save function ...

            try {
                const result = await Save_ServiceData_Service(customerData, serviceData);
                console.log(result);

                if (result) {
                    await Update_CustomerUID();
                    await Update_ServiceUID();
                    // reset form
                    setCustomerData(Customer_InitialData);
                    setServiceData(Service_InitialData);
                    setServiceTypeOption(serviceType_Array[0]);
                    setMoveToOption(moveTo_Array[0]);
                    setServiceTypeOption(serviceType_Array[0]);
                    setBillingTypeOption(billingType_Array[0]);
                    get_ServiceUID();
                    get_CustomerUID();
                    toast.success('Save success...!')
                }



            } catch (error) {
                console.log('Error :', error)
                toast.error(error.message)
            } finally {

                setIsSubmitting(false); // Unlock the form
            }
        } else if (isEdit) {
            console.log('isEdit', isEdit)
            try {
                const result = await Update_ServiceData_Service(customerData, serviceData);
                console.log(result)
                if (result) {
                    // reset form
                    setCustomerData(Customer_InitialData);
                    setServiceData(Service_InitialData);
                    setIsEdit(false);
                    setServiceTypeOption(serviceType_Array[0]);
                    setMoveToOption(moveTo_Array[0]);
                    setServiceTypeOption(serviceType_Array[0]);
                    setBillingTypeOption(billingType_Array[0]);
                    get_ServiceUID();
                    get_CustomerUID();
                    toast.success('Update success...!')
                }
            } catch (error) {
                console.log('Error :', error)
                toast.error(error.message)
            } finally {

                setIsSubmitting(false); // Unlock the form
            }

        }
    }

    const handle_CancelButton = () => {
        // reset form
        setCustomerData(Customer_InitialData);
        setServiceData(Service_InitialData);
        setIsEdit(false);
        setActiveTab(1);

        setServiceTypeOption(serviceType_Array[0]);
        setMoveToOption(moveTo_Array[0]);
        setServiceTypeOption(serviceType_Array[0]);
        setBillingTypeOption(billingType_Array[0]);

        setServiceDate(new Date());
        setDeliveryDate(new Date());
        setInitialCheckDate(new Date());

        get_ServiceUID();
        get_CustomerUID();
    }

    // console.log('apiData', apiData);

    // Handle Edit button click
    const handleEdit = async (row) => {

        console.log('row', row)
        setActiveTab(2);
        setIsEdit(true);

        const cust_id = row.Cust_id;
        const serv_id = row.Serv_id;

        const serv_Data = await Get_ServiceData_Service(serv_id);
        const cust_Data = await Get_CustomerData_Service(cust_id);
        setCustomerData(cust_Data);
        setServiceData(serv_Data);

        setServiceTypeOption(serv_Data.Service_Type);
        setMoveToOption(serv_Data.Move_To);
        setBillingTypeOption(serv_Data.Bill_Type);


    }



    const handlePrint = (row) => {
        navigate('/service_print', { state: row })
    }


    const accordionData = [
        {
            id: 1,
            title: "Customer Information :",
            content: (
                <>
                    <div className='mb-4'>
                        <label>Customer ID</label>
                        <input
                            id="Cust_id"
                            name="Cust_id"
                            onChange={handle_CustomerInput_Change}
                            value={customerData.Cust_id}
                            required
                            readOnly
                            className={`${input_css}`} />
                    </div>
                    <div className="grid md:grid-cols-3 sm:grid-cols-3 gap-4">

                        <div className=''>
                            <label htmlFor="Customer_Name" className={`${label_css}`}>Customer Name</label>
                            <input
                                type="text"
                                id="Customer_Name"
                                name="Customer_Name"
                                onChange={handle_CustomerInput_Change}
                                value={customerData.Customer_Name}
                                className={`${input_css} w-full`} />
                        </div>



                        <div className=''>
                            <label htmlFor="Mobile" className={`${label_css}`}>Mobile</label>
                            <input
                                type="text"
                                id="Mobile"
                                name="Mobile"
                                onChange={handle_CustomerInput_Change}
                                value={customerData.Mobile}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Email" className={`${label_css}`}>Email</label>
                            <input
                                type="text"
                                id="Email"
                                name="Email"
                                onChange={handle_CustomerInput_Change}
                                value={customerData.Email}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Address" className={`${label_css}`}>Address</label>
                            {/* <input type="text" id="" name="" className={`${input_css} w-full`} /> */}
                            <textarea
                                id="Address"
                                name="Address"
                                onChange={handle_CustomerInput_Change}
                                value={customerData.Address}
                                rows="4" className="block p-2.5 w-full text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Address.."></textarea>
                        </div>

                        <div className=''>
                            <label htmlFor="GSTIN" className={`${label_css}`}>GSTIN</label>
                            <input
                                type="text"
                                id="GSTIN"
                                name="GSTIN"
                                onChange={handle_CustomerInput_Change}
                                value={customerData.GSTIN}
                                className={`${input_css} w-full`} style={{ textTransform: 'uppercase' }} />
                        </div>

                    </div>
                </>
            ),
        },
        {
            id: 2,
            title: "Product Information :",
            content: (
                <>
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-3">

                        <div className=''>
                            <label htmlFor="Product_Type" className={`${label_css}`}>Product Type</label>
                            {/* <input
                                type="text"
                                id="Product_Type"
                                name="Product_Type"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Product_Type}
                                className={`${input_css} w-full`} /> */}

                            <select
                                id="Product_Type"
                                name="Product_Type"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Product_Type}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option value="">- Select -</option>
                                <option value="DOT MATRIX">DOT MATRIX</option>
                                <option value="THERMAL PRINTER">THERMAL PRINTER</option>
                                <option value="LABEL PRINTER">LABEL PRINTER</option>
                                <option value="INK PRINTER">INK PRINTER</option>
                                <option value="LASER PRINTER">LASER PRINTER</option>
                                <option value="PROJECTOR">PROJECTOR</option>
                                <option value="OTHERS">OTHERS</option>
                            </select>


                        </div>

                        <div className=''>
                            <label htmlFor="Brand" className={`${label_css}`}>Brand</label>
                            {/* <input
                                type="text"
                                id="Brand"
                                name="Brand"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Brand}
                                className={`${input_css} w-full`} /> */}

                            <select
                                id="Brand"
                                name="Brand"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Brand}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option value="">- Select -</option>
                                <option value="EPSON">EPSON</option>
                                <option value="CANON">CANON</option>
                                <option value="HP">HP</option>
                                <option value="BROTHER">BROTHER</option>
                                <option value="TVSE">TVSE</option>
                                <option value="OTHERS">OTHERS</option>
                            </select>

                        </div>

                        <div className=''>
                            <label htmlFor="Model_Name" className={`${label_css}`}>Model Name</label>
                            <input
                                type="text"
                                id="Model_Name"
                                name="Model_Name"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Model_Name}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Model_Number" className={`${label_css}`}>Model Number</label>
                            <input
                                type="text"
                                id="Model_Number"
                                name="Model_Number"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Model_Number}
                                className={`${input_css} w-full`} />
                        </div>



                    </div>

                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-3">

                        <div className=''>
                            <label htmlFor="Serial_No" className={`${label_css}`}>SI.No</label>
                            <input
                                type="text"
                                id="Serial_No"
                                name="Serial_No"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Serial_No}
                                className={`${input_css} w-full`} />
                        </div>


                        <div className=''>
                            <label htmlFor="Product_Colour" className={`${label_css}`}>Product Color</label>
                            <input
                                type="text"
                                id="Product_Colour"
                                name="Product_Colour"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Product_Colour}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Product_Config" className={`${label_css}`}>Product Config</label>
                            <input
                                type="text"
                                id="Product_Config"
                                name="Product_Config"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Product_Config}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Password" className={`${label_css}`}>Password / Patten Lock</label>
                            <input
                                type="text"
                                id="Password"
                                name="Password"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Password}
                                className={`${input_css} w-full`} />
                        </div>






                    </div>

                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-3">

                        <div className=''>
                            <label htmlFor="Status" className={`${label_css}`}>Status</label>
                            {/* <input
                                type="text"
                                id="Status"
                                name="Status"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Serial_No}
                                className={`${input_css} w-full`} /> */}



                            <select
                                id="Status"
                                name="Status"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Status}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option value="">- Select -</option>
                                <option value="Warrenty">Warrenty</option>
                                <option value="Non-Warrenty">Non-Warrenty</option>
                                <option value="AMC">AMC</option>
                                <option value="Return">Return</option>


                            </select>


                        </div>

                        <div className=''>
                            <label htmlFor="Problem_Reported" className={`${label_css}`}>Problem Reported</label>
                            <input
                                type="text"
                                id="Problem_Reported"
                                name="Problem_Reported"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Problem_Reported}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Condition" className={`${label_css}`}>Condition of the Product  </label>
                            <input
                                type="text"
                                id="Condition"
                                name="Condition"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Condition}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Estimate" className={`${label_css}`}>Estimated Cost(Rs.)</label>
                            <input
                                type="text"
                                id="Estimate"
                                name="Estimate"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Estimate}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Advance" className={`${label_css}`}>Advance Paid(Rs.)</label>
                            <input
                                type="text"
                                id="Advance"
                                name="Advance"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Advance}
                                className={`${input_css} w-full`} />
                        </div>
                        {/* <div className=''> */}
                        {/* <label htmlFor="Delivery_Date" className={`${label_css}`}>Expected Delivery Date</label> */}
                        {/* <input
                                type="text"
                                id="Delivery_Date"
                                name="Delivery_Date"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Delivery_Date}
                                className={`${input_css} w-full`} /> */}
                        <DatePicker2 title={'Expected Delivery Date'} date={deliveryDate} setDate={setDeliveryDate} />
                        {/* </div> */}
                    </div>

                    {/* <div>
                        <span>Recived Items</span>
                    </div> */}

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 mb-3 gap-8">


                        {/* <table className='table-auto border-collapse border border-slate-200 rounded-lg'>
                            <thead>
                                <tr>
                                    <th className=' bg-slate-600 border text-white border-slate-500'>Si#</th>
                                    <th className=' bg-slate-600 border text-white border-slate-500'>Desc.</th>
                                    <th className=' bg-slate-600 border text-white border-slate-500'>Qty</th>
                                    <th className=' bg-slate-600 border text-white border-slate-500'>Remarks</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className=' bg-white border border-slate-500 pl-4'>1</td>
                                    <td className='bg-white border border-slate-500 pl-4'>Power cable</td>
                                    <td className='bg-white border border-slate-500 pl-4'>1</td>
                                    <td className='bg-white border border-slate-500 pl-4'>www.</td>

                                </tr>
                            </tbody>
                        </table> */}


                        <div className=''>
                            <label htmlFor="Remarks" className={`${label_css}`}>Remarks</label>
                            {/* <input
                                type="text"
                                id="Remarks"
                                name="Remarks"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Remarks}
                                className={`${input_css} w-full`} /> */}


                            <textarea
                                id="Remarks"
                                name="Remarks"
                                onChange={handle_ServiceInput_Change}
                                value={serviceData.Remarks}
                                rows="3"
                                cols="85"
                                placeholder="Enter Remarks..."
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            ></textarea>

                        </div>


                        <div className=''>
                            <label htmlFor="Assign_Engineer" className={`${label_css}`}>Assign Engineer</label>

                            <select
                                id="Assign_Engineer"
                                name="Assign_Engineer"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Assign_Engineer}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option value="">- Select -</option>
                                {engineer.map((item, index) =>
                                    <option key={index} value={item.username}>{item.username.toUpperCase()}</option>
                                )}


                            </select>

                        </div>
                    </div>

                </>
            ),
        },
        {
            id: 3,
            title: "Initial Check Information :",
            content: (
                <>
                    <div className="grid md:grid-cols-3 sm:grid-cols-3 gap-4 mb-3">
                        <div className=''>
                            {/* <label className={`${label_css}`}>Check Date</label> */}
                            {/* <input type="text" id="" name="" className={`${input_css} w-full`} /> */}
                            <DatePicker2 title={'Initial Check Date'} date={initialCheckDate} setDate={setInitialCheckDate} />
                        </div>

                        <div className=''>
                            <label htmlFor="Revised_Estimate" className={`${label_css}`}>Revised Estimate  </label>
                            <input
                                type="text"
                                id="Revised_Estimate"
                                name="Revised_Estimate"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Revised_Estimate}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Problem_Dignosed" className={`${label_css}`}>Problem Dignosed</label>
                            <input
                                type="text"
                                id="Problem_Dignosed"
                                name="Problem_Dignosed"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Problem_Dignosed}
                                className={`${input_css} w-full`} />
                        </div>


                    </div>

                    <div className="grid md:grid-cols-1 sm:grid-cols-1 gap-4 mb-3">
                        <div className=''>
                            {/* <label htmlFor="Move_To" className={`${label_css}`}>Move To:</label> */}

                            <RadioButton title="Move To :" selectedOption={moveToOption} setSelectedOption={setMoveToOption} dataArray={moveTo_Array} />

                            {/* <fieldset className='flex'>
                                <legend className="sr-only">Countries</legend>

                                <div className="flex items-center mb-4 pr-4">
                                    <input id="country-option-1" type="radio" name="countries" value="USA" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" checked />
                                    <label for="country-option-1" className="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Return without service
                                    </label>
                                </div>

                                <div className="flex items-center mb-4 pr-4">
                                    <input id="country-option-2" type="radio" name="countries" value="Germany" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="country-option-2" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Customer Pending
                                    </label>
                                </div>

                                <div className="flex items-center mb-4 pr-4">
                                    <input id="country-option-3" type="radio" name="countries" value="Spain" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="country-option-3" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Customer Approved
                                    </label>
                                </div>

                                <div className="flex items-center mb-4 pr-4">
                                    <input id="country-option-4" type="radio" name="countries" value="United Kingdom" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="country-option-4" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Service Completed
                                    </label>
                                </div>

                                <div className="flex items-center mb-4 pr-4">
                                    <input id="country-option-4" type="radio" name="countries" value="United Kingdom" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="country-option-4" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Delivered
                                    </label>
                                </div>

                            </fieldset> */}

                        </div>




                    </div>
                </>
            ),
        },
        {
            id: 4,
            title: "Service Information :",
            content: (
                <>
                    <div className="grid md:grid-cols-3 sm:grid-cols-3 gap-4 mb-3">
                        <div className=''>
                            {/* <label className={`${label_css}`}>Service Date</label> */}
                            {/* <input type="text" id="" name="" className={`${input_css} w-full`} /> */}
                            <DatePicker2 title={'Service Date'} date={serviceDate} setDate={setServiceDate} />
                        </div>

                        <div className=''>
                            <label htmlFor="Engineer_Remarks" className={`${label_css}`}>Service Remarks(Engineer)  </label>
                            <input
                                type="text"
                                id="Engineer_Remarks"
                                name="Engineer_Remarks"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Engineer_Remarks}
                                className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label htmlFor="Customer_Remarks" className={`${label_css}`}>Service Remarks(Customer)</label>
                            <input
                                type="text"
                                id="Customer_Remarks"
                                name="Customer_Remarks"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Customer_Remarks}
                                className={`${input_css} w-full`} />
                        </div>

                    </div>

                    {/* <div><span>Spare Parts Used :</span></div> */}

                    <div className="w-full grid md:grid-cols-1 sm:grid-cols-1  mb-3">
                        {/* <table className='table-auto border-collapse border border-slate-200'>
                            <thead>
                                <tr>
                                    <th className=' bg-slate-600 border text-white border-slate-500' width={'100px'}>#</th>
                                    <th className=' bg-slate-600 border text-white border-slate-500'>Desc.</th>
                                    <th className=' bg-slate-600 border text-white border-slate-500' width={'100px'}>Qty</th>
                                    <th className=' bg-slate-600 border text-white border-slate-500'>Remarks</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className='bg-white border border-slate-500 pl-4 text-center' >1</td>
                                    <td className='bg-white border border-slate-500 pl-4'>Power cable</td>
                                    <td className='bg-white border border-slate-500 pl-4 text-center' >1</td>
                                    <td className='bg-white border border-slate-500 pl-4'>www.</td>

                                </tr>
                            </tbody>
                        </table> */}
                        {/* <div className='mt-4'>
                        <button className='bg-green-400 hover:bg-green-500 text-white p-2 rounded-lg mr-4'>+ ADD SPARE PARTS FROM INVENTORY</button>
                        <button className='bg-green-400 hover:bg-green-500 text-white p-2 rounded-lg'>+ ADD SPARE PARTS</button>
                    </div> */}

                        <div className=' '>
                            {/* <label htmlFor="Bill_Type" className={`${label_css}`}>Billing_Type</label> */}
                            {/* <select
                                id="Bill_Type"
                                name="Bill_Type"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Bill_Type}
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option value="">- Select -</option>
                                <option value="WARRENTY SERVICE">WARRENTY SERVICE</option>
                                <option value="PAID SERVICE">PAID SERVICE</option>
                                <option value="REPEATED SERVICE">REPEATED SERVICE</option>
                            </select> */}

                            <RadioButton title="Billing Type :" selectedOption={billingTypeOption} setSelectedOption={setBillingTypeOption} dataArray={billingType_Array} />
                        </div>


                    </div>

                    <div className="grid md:grid-cols-4 sm:grid-cols-4 gap-4  mt-2 mb-3">
                        <div>
                            <label htmlFor='Total_Pages'>Total Pages :</label>
                            <input type="text"
                                id="Total_Pages"
                                name="Total_Pages"
                                onChange={(e) => handle_ServiceInput_Change(e)}
                                value={serviceData.Total_Pages}
                                placeholder='Enter Total Printed Pages.'
                                className={`${input_css}`}
                            />
                        </div>
                        {serviceData.Bill_Type === 'PAID SERVICE' &&
                            <div>
                                <label htmlFor='Service_Charge'>Service Charge :</label>
                                <input type="text"
                                    id="Service_Charge"
                                    name="Service_Charge"
                                    onChange={(e) => handle_ServiceInput_Change(e)}
                                    value={serviceData.Service_Charge}
                                    placeholder='Amount Rs./-'
                                    className={`${input_css} `}
                                />
                            </div>
                        }

                    </div>











                </>
            ),
        }
    ];




    // Define table columns
    const columns = [
        {
            name: 'Date',
            selector: row => row.created_at,
            sortable: true
        },
        {
            name: 'Job_No',
            selector: row => row.Job_No,
            sortable: true
        },
        {
            name: 'Serial_No',
            selector: row => row.Serial_No,
            sortable: true
        },
        {
            name: 'Mobile',
            selector: row => row.Mobile,
            sortable: true
        },
        {
            name: 'Model_Name',
            selector: row => row.Model_Name,
            sortable: true
        },
        {
            name: 'Customer_Name',
            selector: row => row.Customer_Name,
            sortable: true
        },
        {
            name: 'Move_To',
            selector: row =>
                <span
                    className={`px-2 py-4 text-white rounded-lg ${row.Move_To === 'Delivered' ? 'bg-green-400' :
                        row.Move_To === 'Customer Pending' ? 'bg-blue-400' :
                            row.Move_To === 'Customer Approved' ? 'bg-orange-400' :
                                row.Move_To === 'Service Completed' ? 'bg-yellow-400' :
                                    row.Move_To === 'Open' ? 'bg-red-400' :
                                        'bg-gray-400' // Default color
                        }`}

                >{row.Move_To}</span>,


            sortable: true
        },
        // {
        //     name: 'TAT',
        //     selector: row => row.TAT,
        //     sortable: true
        // },
        // {
        //     name: 'Engineer',
        //     selector: row => row.Engineer,
        //     sortable: true
        // },
        // {
        //     name: 'Total_Amount',
        //     selector: row => row.Total_Amount,
        //     sortable: true
        // },
        // {
        //     name: 'Amount_Paid',
        //     selector: row => row.Amount_Paid,
        //     sortable: true
        // },
        // {
        //     name: 'Balance_Amount',
        //     selector: row => row.Balance_Amount,
        //     sortable: true
        // },
        // {
        //     name: 'Pay_Mode',
        //     selector: row => row.Pay_Mode,
        //     sortable: true
        // },
        // {
        //     name: 'Pay_Note',
        //     selector: row => row.Pay_Note,
        //     sortable: true
        // },
        // {
        //     name: 'Pay_Status',
        //     selector: row => <span className={`${row.Pay_Status === 'PAID' ? 'bg-green-400' : 'bg-red-500'} px-2 py-1 rounded-full text-white`}>{row.Pay_Status}</span>,
        //     sortable: true
        // },

        // {
        //     name: 'GST_Status',
        //     selector: row => row.GST_Status,
        //     sortable: true
        // },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>
                    <button onClick={() => handlePrint(row)} className='bg-blue-300 p-2 rounded-sm mr-1' title='Print'><span><FaPrint /></span></button>
                    <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1' title='Edit'><span><FaEdit /></span></button>
                    {/* <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm' title='Delete'><RiDeleteBin2Line /></button> */}
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowOverflow: true, // Ensure the buttons are visible
            button: true, // Makes it clear they are buttons
        }
    ];




    return (
        <>
            <div className='w-full'>
                {/* Tab navigation */}
                <ul className='flex space-x-4 border-b-2 border-gray-200'>
                    <li className={`cursor-pointer p-2 ${activeTab === 1 ? ' text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(1)}>
                        View
                    </li>
                    <li
                        className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''} `}
                        onClick={() => setActiveTab(2)}>
                        Service
                    </li>
                </ul>

                {/* Tab content */}
                <div className='mt-4'>
                    {activeTab === 1 && (
                        <div className='p-4 bg-green-300 rounded-lg'>
                            {/*  Content for Tab 1  */}
                            <div className=' flex mb-4 items-center'>
                                <div className='w-auto mr-8'>
                                    <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
                                </div>
                                <div className='flex items-center text-center w-auto'>
                                    <label className='mt-4 mr-4 font-semibold'>Filter : </label>
                                    <RadioButton title="" selectedOption={selectedFilter} setSelectedOption={setSelectedFilter} dataArray={filter_Array} />
                                </div>

                            </div>

                            <DataTableVIew tbl_title={'Service Job List'} columns={columns} apiData={apiData} />
                        </div>
                    )}

                    {activeTab === 2 && (
                        <div className='p-4 bg-green-300 rounded-lg'>
                            {/*  Content for Tab 2  */}
                            <span>Create New Job Sheet</span>
                            <ServiceSearch setSelectedCustomer={setSelectedCustomer} setSelectedDevices={setSelectedDevices} />
                            <hr className='mt-4 mb-4'></hr>
                            <div id="accordion-open" data-accordion="open">
                                <form onSubmit={handelFormSubmit}>

                                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-3">
                                        <div className=''>
                                            {/* <span className="">Service Type</span> */}
                                            {/* <fieldset className='flex'> */}
                                            {/* <legend className="sr-only">Service Type</legend> */}
                                            <RadioButton title="Service Type :" selectedOption={serviceTypeOption} setSelectedOption={setServiceTypeOption} dataArray={serviceType_Array} />

                                            {/* <div className="flex items-center mb-4 pr-4">
                                                    <input
                                                        type="radio"
                                                        id="carryIn"
                                                        name="carryIn"
                                                        checked={serviceTypeOption === 'carryIn'}
                                                        onChange={handle_ServiceType_OptionChange}
                                                        value="CarryIn"
                                                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label for="carryIn" className="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        Carry In
                                                    </label>
                                                </div> */}

                                            {/* <div className="flex items-center mb-4 pr-4">
                                                    <input
                                                        type="radio"
                                                        id="pickUp"
                                                        name="pickUp"
                                                        checked={serviceTypeOption === 'pickUp' ? true : ''}
                                                        onChange={handle_ServiceType_OptionChange}
                                                        value="PickUp"
                                                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label for="country-option-2" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        Pick Up
                                                    </label>
                                                </div> */}

                                            {/* <div className="flex items-center mb-4 pr-4">
                                                    <input
                                                        type="radio"
                                                        id="onSite"
                                                        name="onSite"
                                                        checked={serviceTypeOption === 'onSite'}
                                                        onChange={handle_ServiceType_OptionChange}
                                                        value="OnSite" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label for="country-option-3" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        On Site
                                                    </label>
                                                </div> */}


                                            {/* </fieldset> */}



                                        </div>

                                        <div className='  '>
                                            <label className={`${label_css}`}>Job Sheet No.</label>
                                            <input
                                                type="text"
                                                id="Job_No"
                                                name="Job_No"
                                                onChange={handle_ServiceInput_Change}
                                                value={serviceData.Job_No}
                                                required
                                                readOnly
                                                className={`${input_css} w-1/2`} />
                                        </div>



                                    </div>




                                    {accordionData.map((item) => (

                                        <div key={item.id}>
                                            <h2 id={`accordion-open-heading-${item.id}`}>
                                                <button
                                                    type="button"
                                                    className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 ${openItems.includes(item.id)
                                                        ? "rounded-t-xl dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        : "rounded dark:text-gray-400"
                                                        }`}
                                                    onClick={() => toggleItem(item.id)}
                                                    aria-expanded={openItems.includes(item.id)}
                                                    aria-controls={`accordion-open-body-${item.id}`}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        {/* 
                                
                                <svg
                                    className="w-5 h-5 me-2 shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                        clipRule="evenodd"
                                    />
                                </svg> 
                                < 
                                
                                */}

                                                        <svg
                                                            className={`w-3 h-3 ${openItems.includes(item.id) ? "rotate-180" : ""
                                                                } shrink-0`}
                                                            fill="none"
                                                            viewBox="0 0 10 6"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M9 5 5 1 1 5"
                                                            />
                                                        </svg>


                                                        {item.title}
                                                    </span>
                                                    {/* <svg
                                className={`w-3 h-3 ${openItems.includes(item.id) ? "rotate-180" : ""
                                    } shrink-0`}
                                fill="none"
                                viewBox="0 0 10 6"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5 5 1 1 5"
                                />
                            </svg> */}
                                                </button>
                                            </h2>
                                            <div
                                                id={`accordion-open-body-${item.id}`}
                                                className={`${openItems.includes(item.id) ? "" : "hidden"
                                                    } p-5 border border-t-0`}
                                                aria-labelledby={`accordion-open-heading-${item.id}`}
                                            >
                                                {item.content}
                                            </div>
                                        </div>

                                    ))}
                                    <hr></hr>
                                    <div className='mt-4'>
                                        <button type="submit"
                                            disabled={isSubmitting}
                                            className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-1/2  mt-4  p-2  rounded-lg mr-4`} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>

                                        <button
                                            type='button'
                                            onClick={handle_CancelButton}
                                            className='border hover:border-white border-gray-500 p-2 rounded-lg '>CANCEL</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    )}
                </div>

            </div>
        </>
    )
}
