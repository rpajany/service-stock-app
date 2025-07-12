import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ApiContext } from '../context/ApiProvider';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { ToWords } from 'to-words';
import { GET_Api } from '../services/ApiService';
import { Load_ServiceEntry_Service, Get_ServiceData_Service, Get_CustomerData_Service, Load_Engineers_Service, Update_ServiceData_Service } from '../services/Service';

import Magnanim_Sign from '../assest/Magnanim_Sign.PNG';
import GLobal_Sign from '../assest/GLobal_Sign.PNG';

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

export const ServicePrint = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    BASE_URL = selectedApi;

    const { state } = useLocation();

    const business_initialState = {

        Business: "",
        Contact: "",
        Address: "",
        Email: "",
        Website: "",
        Mobile: "",
        Landline: "",
        City: "",
        State: "",
        Zip: "",
        Country: "",
        GSTIN: "",
        BankName: "",
        Branch: "",
        AccountNumber: "",
        IFSC_Code: "",
        MICR_Code: "",
        Brand_Logo: "",

    }

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
        Customer_Remarks: "",
        created_at: ""
    }

    const [businessData, setBusinessData] = useState(business_initialState);
    const [customerData, setCustomerData] = useState(Customer_InitialData);
    const [serviceData, setServiceData] = useState(Service_InitialData);
    const [print, setPrint] = useState(false);

    console.log('state', state)

    // get business data
    async function Get_BusinessData() {
        try {
            const url_business = BASE_URL + `/business/get_business`;
            const req_0 = await GET_Api(url_business, '');
            console.log('1. Get Business Details : ', req_0);
            setBusinessData(req_0[0])
        } catch (error) {
            console.log('Error Get Business Details : ', error);
        }
    }

    const load_Data = async () => {
        const serv_Data = await Get_ServiceData_Service(state.Serv_id);
        const cust_Data = await Get_CustomerData_Service(state.Cust_id);
        setCustomerData(cust_Data);
        setServiceData(serv_Data);
    }

    useEffect(() => {
        Get_BusinessData();
        load_Data();

        setPrint(true)
    }, [])

    useEffect(() => {
        if (print)
            setTimeout(() => {
                window.print()
            }, 1500)
    }, [print])

    return (
        <>

            <div className="flex flex-col items-center mb-4" style={{ textAlign: 'center' }}>
                <div className='flex   align-middle'>
                    {/* <img src={businessData.Brand_Logo} style={{ height: '50px', width: '50px' }} className="rounded-full mr-2" alt="logo" /> */}
                    <h5 className='text-2xl font-bold' style={{ font: 'ElGar', fontFamily: 'ElGar' }}>{businessData.Business} </h5>
                </div>

                <span style={{ fontSize: '15px' }}>{businessData.Address}, {businessData.City},{businessData.State} - {businessData.Zip}.</span>
                {/* <span style={{ fontSize: '15px' }}> </span>
                    <span style={{ fontSize: '15px' }}></span><br></br> */}
                <span style={{ fontSize: '15px' }}>Phone: {businessData.Mobile}, {businessData.Landline}, {businessData.Email}, {businessData.Website ? 'Website: ' + businessData.Website : null}</span>
                {/* <span style={{ fontSize: '15px' }}> </span> */}
            </div>

            <hr className='border-1 border-black'></hr>

            <div className='grid grid-cols-2 mb-4'>
                <div>
                    <span className='text-md font-bold'>Customer Details :</span><br></br>
                    <span>{customerData.Customer_Name}</span><br></br>
                    <span>{customerData.Address}</span><br></br>
                    <span>{customerData.State}</span><br></br>
                    <span>{customerData.Mobile}</span><br></br>
                    <span>{customerData.GSTIN}</span>
                </div>
                <div>
                    <span className='text-md font-bold'>Job Sheet No. :   {serviceData.Job_No}</span><br></br>
                    <span className='text-md'>Job Sheeet Date :   {serviceData.created_at}</span><br></br>

                </div>
            </div>

            <hr className='border-1 border-black'></hr>

            <div className='mt-4 '>
                <span className='font-bold'>Product Information :</span>

                <table className='w-full border-2 border-black  text-sm text-left rtl:text-right text-gray-600 dark:text-gray-400'>
                    <thead className=''>
                        <tr className='border-b-2 border-black bg-gray-400 text-black'>
                            <th className=' border-r    border-black text-center'>Product</th>
                            <th className=' border-r border-black text-center'>SI No.</th>
                            <th className=' border-r border-black text-center'>Brand</th>
                            <th className=' border-r border-black text-center'>Model</th>
                            <th className=' border-r border-black text-center'>Model No</th>
                            <th className=' border-r border-black text-center'>Product Status</th>
                            <th className=' border-r border-black text-center'>Reported Fault</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className=' text-black text-center'>
                            <td className='py-2 border-r border-black'>{serviceData.Product_Type}</td>
                            <td className='py-2 border-r border-black'>{serviceData.Serial_No}</td>
                            <td className='py-2 border-r border-black'>{serviceData.Brand}</td>
                            <td className='py-2 border-r border-black'>{serviceData.Model_Name}</td>
                            <td className='py-2 border-r border-black'>{serviceData.Model_Number}</td>
                            <td className='py-2 border-r border-black'>{serviceData.Status}</td>
                            <td className='py-2'>{serviceData.Problem_Reported}</td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className='border-1 border-black'></hr>

            <div className='flex gap-3 mb-4 mt-4'>
                <span>Service Amount : {(serviceData.Revised_Estimate).toString() || 0.00},</span>
                <span>Advance Paid : {(serviceData.Advance).toString() || 0.00},</span>
                <span>Balance  : {(serviceData.Revised_Estimate) - (serviceData.Advance) || 0.00}</span>
            </div>
            <hr className='border-1 border-black'></hr>
            <div className='mt-4 mb-4 font-thin text-sm' style={{ fontSize: '.5rem' }}>
                <span className='font-bold'>Terms and conditions : </span><br></br>
                <span>1. The customers must receive the job sheet when the product is given for non-warranty repair & the contents of the Job sheet must be verifi ed by the customer.</span><br></br>
                <span>2.
                    The customer must produce the original job sheet at the time of taking the delivery. We reserve the right to refuse delivery upon non-production of the original job sheet.</span><br></br>
                <span>3.
                    We shall not be obliged to undertake repair of products found liquid damaged, physical damage or already attempted for repair by any other repairer.
                </span><br></br>
                <span>
                    4.
                    The estimate given at the time of acceptance of the product for repairs are provisional and may vary after detailed inspection. We will proceed further only after takingapproval from the customer.
                </span><br></br>
                <span>
                    5.
                    In the event of handset received with condition where in physical damage, liquid damage or repair already attempted by other repairer, we will not be liable for anydamage even under testing before repair or after repair.
                </span><br></br>
                <span>
                    6.
                    All payments against repairs shall be made in cash or credit cards only.
                </span><br></br>
                <span>
                    7.
                    We shall make all eff orts to ensure that the product is repaired within 7 (Seven) days from the date of receipt of faulty product. At times however, due toavailability/shortage of critical spare parts or complicated the repair turnaround time may take longer than the indicated time for delivery in the job sheet. We will not beresponsible for any loss/losses whatsoever in the event of the delay in the repair for such aforementioned reasons.
                </span><br></br>
                <span>
                    8.
                    The customer should take delivery of the product within 14 (fourteen) days of written intimation from us. This shall be regardless whether the product has been repaired ornot.
                </span><br></br>
                <span>
                    9.
                    In the event the delivery is taken by the customer from us within 30 days from the date of written intimation by us, we reserve the right to auction the product to recoverthe repair and auction charges from the customer.
                </span><br></br>
                <span>
                    10.
                    The above terms & conditions supersedes and terminates all prior representation; discussions, undertaking, and end user agreements, communications or advertisingrelating to the products and services, written or oral until and unless otherwise agreed in writing by us.
                </span><br></br>
                <span>
                    11.
                    We are not liable for any memory, setting and data loss during the repair.
                </span><br></br>
                <span>
                    12.
                    Spare once replaced with new, old spare will not be given back to customers. By accepting the job sheet, it is deemed that the customer agrees to all the terms andconditions mentioned in the agreement in the job sheet.
                </span><br></br>
            </div>

            <hr className='border-1 border-black mb-4'></hr>

            <div><span>Date : -----------</span></div>

            <div className='grid grid-cols-3 mt-4 text-left align-baseline' style={{ fontSize: '.5rem' }}>
              
                <div>
                    {businessData.Business === 'Magnanim Systems' ?
                        <img src={Magnanim_Sign} alt="sign" h="" w="" /> :
                        businessData.Business === 'Global Systems' ? <img src={GLobal_Sign} alt="sign" h="" w="" /> : ''
                    }
                    <span>Signature of Front Desk : </span>
                </div>
                <div>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
                    <span>Signature of Customer: -----------------</span>
                </div>
            </div>

        </>
    )
}
