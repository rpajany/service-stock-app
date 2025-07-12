import React, { useState, useEffect, useContext } from 'react'
import { POST_Api, GET_Api } from '../services/ApiService';
import { useBaseUrl, Get_CustomerUID_Service, Save_CustomerData_Service, Update_CustomerData_Service } from '../services/CustomerService';
import { ApiContext } from '../context/ApiProvider';

// css 
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';


export const AddCustomer = ({ selectedCustomer, isEdit, setIsEdit, setIsInserted = false }) => {
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);

    const customer_InitialValue = {
        id: '',
        Cust_id: "",
        Customer_Name: "",
        Address: "",
        State: "",
        Mobile: "",
        Email: "",
        GSTIN: ""
    }

    const [customerData, setCustomerData] = useState(customer_InitialValue);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

    const [apiData, setApiData] = useState([]);
    const [customerUID, setCustomerUID] = useState('');


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData((preve) => ({
            ...preve,
            [name]: value
        }))
    }

    async function get_CustomerUID() {
        try {

            if (!isEdit) {
                const result = await Get_CustomerUID_Service();

                console.log('result :', result);

                setCustomerData((preve) => ({
                    ...preve,
                    Cust_id: (result.Customer_UID + 1)
                }));
            }


            // setCustomerUID(customerUID[0].Customer_UID + 1);

        } catch (error) {
            console.error('Get salesUID  :', error.message);
        }
    }


    useEffect(() => {
        get_CustomerUID();
    }, [isEdit])


    useEffect(() => {
        if (selectedCustomer && isEdit) {
            setCustomerData(selectedCustomer);
        }

    }, [selectedCustomer, isEdit]);

    const handle_formSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!isEdit) { // save

                const result = await Save_CustomerData_Service(customerData);
                console.log('Save :', result)


            } else if (isEdit) { // update
                const result = await Update_CustomerData_Service(customerData);
                console.log('Update :', result)
            }
        } catch (error) {
            console.error('Error handle_formSubmit  :', error.message);
        } finally {
            setCustomerData(customer_InitialValue);
            setIsEdit(false);
            setIsInserted(true);
            await get_CustomerUID();
        }




    }

    return (
        <>
            <div className='border-b-2 '>
                <div className='bg-cyan-500 text-white py-2 px-5' style={{}} >
                    <i className="fa fa-shopping-cart">Add Customer</i>
                </div>

                <div className='px-4'>
                    <form onSubmit={handle_formSubmit}>

                        <div className='grid grid-cols-2 gap-8 mt-4'>
                            <div className='w-full'>
                                <label htmlFor="Customer_Name" className={`${label_css}`}>Customer Name</label>
                                <input
                                    type="text"
                                    id="Customer_Name"
                                    name="Customer_Name"
                                    onChange={handleChange}
                                    value={customerData.Customer_Name}
                                    placeholder='Enter Customer Name.'
                                    required
                                    className={`${input_css} w-full`}
                                />
                            </div>
                            <div>
                                <label htmlFor="Cust_id" className={`${label_css}`}>Customer_ID</label>
                                <input
                                    type="text"
                                    id="Cust_id"
                                    name="Cust_id"
                                    onChange={handleChange}
                                    value={customerData.Cust_id}
                                    placeholder='Customer ID-Auto'
                                    required
                                    className={`${input_css}`}
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-8 mt-4'>
                            <div className='w-full'>
                                <label htmlFor="Address" className={`${label_css}`}>Address</label>
                                <textarea
                                    id="Address"
                                    name="Address"
                                    onChange={(e) => handleChange(e)}
                                    value={customerData.Address}
                                    rows="3"
                                    cols="85"
                                    placeholder="Enter Address"
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                                ></textarea>
                            </div>

                            <div className=''>
                                <label htmlFor="State" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
                                {/* <input
                                    type="text"
                                    id="State"
                                    name="State"
                                    onChange={handleChange}
                                    value={customerData.State}
                                    placeholder='Enter State'

                                    className={`${input_css} w-full`}
                                /> */}

                                <select
                                    id="State"
                                    name="State"
                                    onChange={(e) => handleChange(e)}
                                    value={customerData.State}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                    <option value="">- Select -</option>
                                    <option value="PUDUCHERRY">PUDUCHERRY</option>
                                    <option value="OTHERS">OTHERS</option>
                                </select>


                            </div>
                        </div>

                        <div className='grid grid-cols-3 gap-8 mt-4'>
                            <div className=''>
                                <label htmlFor="GSTIN" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">GSTIN</label>
                                <input
                                    type="text"
                                    id="GSTIN"
                                    name="GSTIN"
                                    onChange={handleChange}
                                    value={customerData.GSTIN}
                                    placeholder='GSTIN'

                                    className={`${input_css} w-full`}
                                />

                            </div>
                            <div className='w-full'>
                                <label htmlFor="Mobile" className={`${label_css}`}>Mobile</label>
                                <input
                                    type="text"
                                    id="Mobile"
                                    name="Mobile"
                                    onChange={handleChange}
                                    value={customerData.Mobile}
                                    placeholder='Mobile No.'

                                    className={`${input_css} w-full`}
                                />
                            </div>

                            <div className=''>
                                <label htmlFor="Email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input
                                    type="text"
                                    id="Email"
                                    name="Email"
                                    onChange={handleChange}
                                    value={customerData.Email}
                                    placeholder='Email ID.'

                                    className={`${input_css} w-full`}
                                />

                            </div>
                        </div>

                        <div className='flex justify-center items-center mt-4 mb-4'>
                            <button type="submit"
                                disabled={isSubmitting}
                                className={` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-1/2  mt-4  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>

                        </div>
                    </form>



                </div>
            </div>
        </>
    )
}
