import React, { useEffect, useState, useContext } from 'react';
import { CustomerAutoComplete } from '../components'
import { ApiContext } from '../context/ApiProvider';
import { Get_BaseUrl } from '../helpers/custom';
import { useBaseUrl, load_Customer_Service, Get_CustomerDevices_Service } from '../services/ServiceSearchService';
// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-lg border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';

// const BASE_URL = Get_BaseUrl();

export const ServiceSearch = ({ setSelectedCustomer, setSelectedDevices }) => {
    // const customer = ['pajany', '9994480535', 'pondy']
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);


    const [customerApiData, setCustomerApiData] = useState({});
    const [deviceApiData, setDeviceApiData] = useState({});
    const [rowItems, setRowItems] = useState([]); // for selected row item in part search autocomplete

    // const [devices, setDevices] = useState(null);

    const Load_AllCustomers = async () => {
        const result = await load_Customer_Service();
        setCustomerApiData(result);
        // const { Cust_id } = result;
        // console.log('customer :', Cust_id)

    }


    const Get_Devices = async (Cust_id) => {
        const result2 = await Get_CustomerDevices_Service(Cust_id)
        console.log('Device :', result2)
        setDeviceApiData(result2)
    }

    useEffect(() => {
        Load_AllCustomers();
    }, [])

    useEffect(() => {
        setSelectedCustomer(rowItems)
        Get_Devices(rowItems.Cust_id)
    }, [rowItems])

    // console.log('rowItems', rowItems)

    const handleRadioChange = (item) => {
        setSelectedDevices(item);
    }

    return (
        <>
            <div className='mt-4 mb-4'>
                <label className={`${label_css}`}>Search Existing Customer</label>
                {/* <input
                    type='text'
                    id=""
                    name=""
                    value=""
                    placeholder='Search..'
                    className={`${input_css} w-1/2`} /> */}
                <CustomerAutoComplete
                    autoCompleteData={customerApiData}

                    // setRowItems={setRowItems}
                    setSelectedCustomer={setRowItems}
                />
            </div>
            {Object.keys(rowItems).length > 0 && (
                <div>
                    <span>Select Customer :</span>
                    <table className='w-full border-2 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className='text-xs text-gray-700 uppercase p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                            {/* <tr>
                                <th scope="col" class="px-6 py-3">Select</th>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Mobile No.</th>
                                <th scope="col" class="px-6 py-3">Address</th>
                            </tr> */}

                            <tr>

                                {Object.keys(rowItems).map((key) => (
                                    <th key={key} scope="col" class="px-6 py-3">{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* {rowItems.map((item, index) => (
                             item

                            ))
                            } */}


                            {/* {Object.values(rowItems).map((value, index) => (

                                <tr className="  border-b border-r border-l border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4"><input type="radio" /></td>

                                    <td className="px-6 py-4">{rowItems['Customer_Name']}</td>
                                    <td className="px-6 py-4">{rowItems['Mobile']}</td>
                                    <td className="px-6 py-4">{rowItems['Address']}</td>

                                </tr>

                            ))} */}

                            <tr>

                                {Object.values(rowItems).map((value, index) => (


                                    <td key={index} className="px-6 py-4">{value}</td>


                                ))}
                            </tr>

                        </tbody>
                    </table>
                </div>
            )}

            {Object.keys(deviceApiData).length > 0 && (
                <div className='mt-4'>
                    <span className=''>Select Device :</span>
                    <table className='w-full border-2 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className='text-xs text-gray-700 uppercase p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th scope="col" class="px-6 py-3">Select</th>
                                <th scope="col" class="px-6 py-3">Product</th>
                                <th scope="col" class="px-6 py-3">Brand</th>
                                <th scope="col" class="px-6 py-3">Model Name</th>
                                <th scope="col" class="px-6 py-3">Model No.</th>
                                <th scope="col" class="px-6 py-3">Serial #</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr className="  border-b border-r border-l border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4"><input type="radio" /></td>
                                <td className="px-6 py-4">K123456</td>
                                <td className="px-6 py-4">Epson</td>
                                <td className="px-6 py-4">Inkjet</td>
                                <td className="px-6 py-4">123</td>
                            </tr> */}

                            {deviceApiData.map((item, index) => (
                                <tr>
                                    <td className="px-6 py-4">
                                        <input type="radio" onChange={() => handleRadioChange(item)} />
                                    </td>
                                    <td className="px-6 py-4">{item['Product_Type']}</td>
                                    <td className="px-6 py-4">{item['Brand']}</td>
                                    <td className="px-6 py-4">{item['Model_Name']}</td>
                                    <td className="px-6 py-4">{item['Model_Number']}</td>
                                    <td className="px-6 py-4">{item['Serial_No']}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}


        </>
    )
}
