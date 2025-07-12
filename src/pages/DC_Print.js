import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { ApiContext } from '../context/ApiProvider';
import { ToWords } from 'to-words';
import { GET_Api } from '../services/ApiService';
import Logo from '../assest/logo.jpg';
import Magnanim_Sign from '../assest/Magnanim_Sign.PNG';
import GLobal_Sign from '../assest/GLobal_Sign.PNG';

export const DC_Print = () => {
    let BASE_URL = "";
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    BASE_URL = selectedApi;

    const { state } = useLocation();
    const [dcDetails, setDcDetails] = useState(state);

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

    const [businessData, setBusinessData] = useState(business_initialState);

    const [dcData, setDcData] = useState([]);
    const [print, setPrint] = useState(false);

    let rowID = 0;



    console.log('dcData', dcData)
    console.log('dcDetails', dcDetails)

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

    // get quote items ....
    async function Get_DcData() {
        try {
            const url_DC = BASE_URL + `/dc/get_dc/${dcDetails.DC_Number}`;
            const req_1 = await GET_Api(url_DC, '');
            console.log('2. Get sales Items : ', req_1);
            setDcData(req_1)
        } catch (error) {
            console.log('Error Get_QuoteData : ', error);
        }
    }

    useEffect(() => {

        const getData = async () => {
            await Get_BusinessData();
            await Get_DcData();
            setPrint(true);
        }
        getData();
    }, [])


    useEffect(() => {
        if (print)
            setTimeout(() => {
                // window.print()
            }, 1500)
    }, [print])

    return (
        <>
            <div className="flex flex-col items-center mb-2" style={{ textAlign: 'center' }}>
                <div className='flex   align-middle'>
                    {/* <img src={businessData.Brand_Logo} style={{ height: '50px', width: '50px' }} className="rounded-full mr-2" alt="logo" /> */}
                    <h5 className='text-2xl font-bold' style={{ font: 'ElGar', fontFamily: 'ElGar' }}>{businessData.Business} </h5>
                </div>

                <span style={{ fontSize: '15px' }}>{businessData.Address}, {businessData.City},{businessData.State} - {businessData.Zip}.</span>

                <span style={{ fontSize: '15px' }}>Phone: {businessData.Mobile}, {businessData.Landline}, {businessData.Email}, {businessData.Website ? 'Website: ' + businessData.Website : null}</span>

            </div>
            <hr></hr>




            <div className='border-2'>
                <div className=' border-b-2 p-1'>
                    <p className='text-center text-xl'><b>DELIVERY CHALLAN / GATE PASS</b></p>
                </div>

                <div className='grid grid-cols-2'>
                    <div className='  border-r-2 p-3'>
                        <span><b><u>Details of Receiver:</u></b></span><br></br>
                        <span><b>{dcDetails.Company}</b></span><br></br>
                        <span>{dcDetails.Address}</span><br></br>
                        <span>GSTIN : {dcDetails.GSTIN}</span><br></br>

                        <br></br>
                        <span className=''><b>Contact : </b>{dcDetails.Contact}</span>
                    </div>

                    <div className=''>
                        <div className='flex flex-col p-3'>
                            <span><b>DC No. :</b>            07/DC/JUNE-24</span>
                            <span>Date:                     27-06-2024</span>
                            {/* <span>Veh.No:</span> */}
                            {/* <span>Place of supply:   PUDUCHERRY (34)</span> */}
                        </div>


                        <div className='border-t-2 gap-8 p-3'>
                            <span className=''><b>Type :</b> {dcDetails.Type}</span><br></br>
                            <span><b>Purpose :</b> {dcDetails.DC_Remarks} </span><br></br>
                            <span><b>Mode :</b> {dcDetails.Delivery_Mode}</span><br></br>
                            <span><b>Reference :</b> {dcDetails.Reference}</span>
                            {/* <div className='mr-2'><b>Taken By :</b></div> */}
                        </div>
                    </div>

                </div>




                <div className='border-t-2 p-3'>
                    <table className='tbl_salesItem w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className='text-xs border-b-2 border-t-2   text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th scope="col" className="px-2 py-1 border-l-2">S.No.</th>
                                <th scope="col" className="px-2 py-1 border-l-2">Item / Description</th>
                                <th scope="col" className="px-2 py-1 border-l-2">Serial/Model/Part No.</th>
                                <th scope="col" className="px-2 py-1 border-l-2">HSN Code</th>
                                <th scope="col" className="px-2 py-1 border-l-2">Qty</th>
                                <th scope="col" className="px-2 py-1 border-l-2">Rate</th>
                                <th scope="col" className="px-2 py-1 border-l-2 border-r-2 text-right ">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dcData && dcData.map((item, index) => (
                                <tr key={index} className='border-b-2 border-l-2 bg-white  dark:bg-gray-800 dark:border-gray-700'>
                                    <td className='px-2 py-1 border-r-2'>{index + 1}</td>
                                    <td className='px-2 py-1 border-r-2 w-1/2'>{item.Description}</td>
                                    <td className='px-2 py-1 border-r-2'>{item.Serial}</td>
                                    <td className='px-2 py-1 border-r-2'>{item.HSN_Code}</td>
                                    <td className='px-2 py-1 border-r-2'>{item.Qty}</td>
                                    <td className='px-2 py-1 border-r-2'>{item.Rate.toFixed(2)}</td>
                                    <td className='px-2 py-1 border-r-2 text-right ' >{item.Amount.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="7" className='text-right pr-2'> <b>Total - {dcDetails.Total.toFixed(2)}</b></td>

                            </tr>
                            {/* <tr className='border-b-2 border-l-2 '>
                                <td className='px-2 py-1 border-r-2'>1</td>
                                <td className='px-2 py-1 border-r-2'>OK NG CONVEYOR PASS FAIL SOFTWARE & PCB RELAY KIT.</td>
                                <td className='px-2 py-1 border-r-2'>02062024</td>
                                <td className='px-2 py-1 border-r-2'>85238020</td>
                                <td className='px-2 py-1 border-r-2'>01</td>
                                <td className='px-2 py-1 border-r-2'>100</td>
                                <td className='px-2 py-1 border-r-2'>100</td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>

                <div className='grid grid-cols-2 border-t-2 '>
                    <div className='border-r-2 p-3'>
                        <p>
                            Received the material in good condition
                            Quantity verified and found correct
                            Special Instruction (if any)
                        </p>

                        <br></br>
                        <br></br>

                        <span><b>Customer’s Signature with Office Seal</b></span>


                    </div>
                    <div className='flex flex-col p-3 items-end '>
                        <span>for <b>{businessData.Business}</b> </span>
                        <div className='  '>

                            {businessData.Business === 'Magnanum Systems' ?
                                <img src={Magnanim_Sign} alt="sign" h="" w="" /> :
                                businessData.Business === 'Global Systems' ? <img src={GLobal_Sign} alt="sign" h="20" w="20" /> : ''
                            }

                        </div>
                        <span> Authorised Signatory </span>

                    </div>
                </div>



            </div>

            {/* <hr></hr> */}
            <p className='text-center'><b>Note: </b> Kindly return one copy of the delivery challan duly signed with seal</p>
        </>
    )
}
