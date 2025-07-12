import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ApiContext } from '../context/ApiProvider';
import { Get_BaseUrl, date_strToObject, date_objToFormat } from '../helpers/custom';
import { ToWords } from 'to-words';
import { GET_Api } from '../services/ApiService';
import Logo from '../assest/logo.jpg';
import Magnanim_Sign from '../assest/Magnanim_Sign.PNG';
import GLobal_Sign from '../assest/GLobal_Sign.PNG';

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

export const SalesPrint = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    BASE_URL = selectedApi;

    const { state } = useLocation();

    const [invoiceDetails, setInvoiceDetails] = useState(state);
    let rowID = 0;


    const toWords = new ToWords({
        localeCode: 'en-IN',
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
            currencyOptions: { // can be used to override defaults for the selected locale
                name: 'Rupee',
                plural: 'Rupees',
                symbol: '₹',
                fractionalUnit: {
                    name: 'Paisa',
                    plural: 'Paise',
                    symbol: '',
                },
            }
        }
    });

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
    const [salesItems, setSalesItems] = useState([]);
    const [print, setPrint] = useState(false);

    // get business data
    async function Get_BusinessData() {
        try {
            const url_business = BASE_URL + `/business/get_business`;
            const req_0 = await GET_Api(url_business, '');
            // console.log('1. Get Business Details : ', req_0);
            setBusinessData(req_0[0])
        } catch (error) {
            console.log('Error Get Business Details : ', error);
        }
    }

    // get Sales items ....
    async function Get_SalesItems() {
        try {
            const url_Sales = BASE_URL + `/sales/get_sales/${invoiceDetails.Invoice_Number}`;
            const req_1 = await GET_Api(url_Sales, '');
            // console.log('2. Get sales Items : ', req_1);
            setSalesItems(req_1)
        } catch (error) {
            console.log('Error Get Sales Items : ', error);
        }
    }


    useEffect(() => {

        const getData = async () => {
            await Get_BusinessData();
            await Get_SalesItems();
            setPrint(true);
        }
        getData();
    }, [])




    useEffect(() => {




        setTimeout(() => {
            if (print) {
                setPrint(false);
                window.print();

            }

        }, 1500)



    }, [print])






    return (
        <div style={{}} className='page border-2'>
            {/* <h1>Print Invoice</h1> */}
            <div className='row pt-3'>
                <div className='col-sm-2' style={{ textAlign: 'right' }}>
                    {/* <img src={logo} style={{ height: '100px', width: '100px' }} className="profile-user-img img-fluid img-circle" alt="logo" /> */}
                </div>

                <div className="flex flex-col items-center" style={{ textAlign: 'center' }}>
                    <div className='flex   align-middle'>
                        {/* <img src={businessData.Brand_Logo} style={{ height: '50px', width: '50px' }} className="rounded-full mr-2" alt="logo" /> */}
                        <h5 className='text-5xl font-bold' style={{ font: 'ElGar', fontFamily: 'ElGar' }}>{businessData.Business} </h5>
                    </div>

                    <span style={{ fontSize: '15px' }}>{businessData.Address}, {businessData.City},{businessData.State} - {businessData.Zip}.</span>
                    {/* <span style={{ fontSize: '15px' }}> </span>
                    <span style={{ fontSize: '15px' }}></span><br></br> */}
                    <span style={{ fontSize: '15px' }}>Phone: {businessData.Mobile}, {businessData.Landline}, {businessData.Email}</span>
                    <span style={{ fontSize: '15px' }}> {businessData.Website ? 'Website: ' + businessData.Website : null}</span>

                </div>
            </div>
            <hr></hr>
            <div className='gap-8 columns-3 mt-2'>
                <div className='col-sm-4 px-3'>
                    <span>{'Invoice No. '}<b>{invoiceDetails.Invoice_Number}</b></span><br></br>

                    <span>{'Invoice Date.'} {
                        (invoiceDetails.Invoice_Date.length >= 10)} {
                            invoiceDetails.Invoice_Date.substring(0, 10)
                        }
                    </span>
                </div>
                <div className="col-sm-4">


                    <p style={{ textAlign: 'center', marginBottom: '2px', fontSize: '25px', textDecoration: 'underline' }}><b>INVOICE</b></p>
                    {/* <p style={{ textAlign: 'center', marginBottom: '2px' }}>{'(Original/Duplicate/Triplicate)'}</p> */}
                </div>
                <div className="col-sm-4">
                    <span>{'State: PUDUCHERRY'} </span><br></br>
                    <span>{'GSTIN : '}{businessData.GSTIN}</span>


                </div>

            </div>
            <hr></hr>
            <div className='grid grid-cols-2' style={{ marginTop: '10px' }}>
                <div className='col-sm-6 px-3'>
                    <span><b>{'Bill To:'}</b></span><br></br>
                    <span>{invoiceDetails.Customer_Name}</span><br></br>
                    <span>{invoiceDetails.Address}, {invoiceDetails.State === 'PUDUCHERRY' ? 'PUDUCHERRY' : null}</span><br></br>
                    {/* <span>{customerDate.Country}</span><br></br> */}
                    <span style={{ textTransform: 'uppercase' }}>{invoiceDetails.GSTIN ? "GSTIN: " + invoiceDetails.GSTIN : null}</span><br></br>
                    {/* <span>{customerDate.Phone}</span><br></br>
                    <span>{customerDate.Email}</span> */}
                </div>

                <div className='flex flex-col' style={{}}>
                    {/* <span>Booking No.: {bookingDate.Booking_Number}</span><br></br>
                    <span>{'Check In : '}{stringDateTimeToAMPM(bookingDate.Check_In)}</span><br></br>
                    <span>{'Check Out : '}{stringDateTimeToAMPM(bookingDate.Check_Out)}</span> */}

                    <span>Model : {invoiceDetails.Model}</span>
                    <span>Serial No. : {invoiceDetails.Serial}</span>

                </div>

            </div>
            {/* <hr className='mt-4'></hr> */}
            {/* table_div */}       <div className=' px-3' style={{ marginTop: '5px', maxWidth: '100%' }}>
                {/* tbl_salesItem */}  <table className=' w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400' style={{ tableLayout: 'fixed' }}>
                    <thead className='text-xs border-b-2 border-t-2   text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                        <tr className='border-r-2 border-l-2'>
                            <th scope="col" className="px-1 py-1 w-10">#</th>
                            <th scope="col" className="px-1 py-1 w-1/4">Desc</th>
                            <th scope="col" className="px-1 py-1 w-30">HSN</th>
                            <th scope="col" className="px-1 py-1 w-10">Qty</th>
                            <th scope="col" className="px-1 py-1 w-30">Rate</th>
                            <th scope="col" className="px-1 py-1 w-30">Disc_%</th>
                            <th scope="col" className="px-1 py-1 w-30">Disc_Amt</th>
                            <th scope="col" className="px-1 py-1 w-20">Tax_%</th>
                            <th scope="col" className="px-1 py-1 w-30">Tax Amt</th>
                            <th scope="col" className="px-1 py-1 w-30 text-right pr-8">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesItems && salesItems.map((item, index) => (
                            <tr key={index} className='border-l-2 border-r-2 border-b-2 bg-white  dark:bg-gray-800 dark:border-gray-700'>
                                <td className='px-1 py-1'>{index + 1}</td>
                                <td className='px-1 py-1'>{item.Item_Name}</td>
                                <td className='px-1 py-1'>{item.HSN_Code}</td>

                                <td className='px-1 py-1'>{item.Qty}</td>
                                <td className='px-1 py-1'>{item.Sale_Price.toFixed(2)}</td>
                                <td className='px-1 py-1'>{item.Discount_Percent} {'%'}</td>
                                <td className='px-1 py-1'>{item.Discount_Amount.toFixed(2)}</td>
                                <td className='px-1 py-1'>{item.Tax_Percent} {'%'}</td>
                                <td className='px-1 py-1'>{item.Tax_Amount.toFixed(2)}</td>
                                <td className='px-1 py-1 text-right pr-8' style={{}}>{item.Total.toFixed(2)}</td>
                            </tr>
                        ))}

                    </tbody>

                </table>
            </div>

            {/* <hr className='mb-4'></hr> grid grid-cols-2 gap-4 */}

            <div className='grid grid-cols-2 gap-2 mt-4 px-3'>

                <div className=''>
                    <span>Note : {invoiceDetails.Note}</span><br />
                    <span style={{ fontStyle: "" }}><b>{'Amount Chargeable (in words) :'}</b></span><br></br>
                    <span>INR :  </span>  <span style={{ fontStyle: 'italic' }}>  {toWords.convert(invoiceDetails.Total_Amount)}</span>
                    <br></br>

                    <span><b>BankName Details :-</b></span><br></br>
                    <span>BankName : {businessData.BankName}</span><br></br>
                    <span>Branch : {businessData.Branch}</span><br></br>
                    <span>Account Number : {businessData.AccountNumber}</span><br></br>
                    <span>IFSC : {businessData.IFSC_Code}</span><br></br>
                    <span>MICR : {businessData.MICR_Code}</span><br></br>
                </div>

                <div className='flex   justify-end'>
                    <table className="table table-sm table-bordered">
                        <thead>
                            {/* <tr>
                                <td className="col_Header">Gross Total</td>
                                <td className="col_Amount" style={{ textAlign: 'end', paddingRight: '30px' }}>{(invoiceDetailsDate.Gross_Total).toFixed(2)}</td>
                            </tr> */}

                            {/* <tr>
                                <td className="col_Header">Total Discount</td>
                                <td className="col_Amount" style={{ textAlign: 'end', paddingRight: '30px' }}>{(invoiceDetailsDate.Discount_Amount).toFixed(2)}</td>
                            </tr> */}

                            <tr>
                                <td className="px-1 py-1">Taxable Amount</td>
                                <td className="col_Amount" style={{ textAlign: 'end', paddingRight: '30px' }}>{(invoiceDetails.Taxable_Amount).toFixed(2)}</td>
                            </tr>


                            <tr>
                                <td className="px-1 py-1">SGST</td>
                                <td className="col_Amount" style={{ textAlign: 'end', paddingRight: '30px' }}>{(invoiceDetails.SGST).toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td className="px-1 py-1">CGST</td>
                                <td className="col_Amount" style={{ textAlign: 'end', paddingRight: '30px' }}>{(invoiceDetails.CGST).toFixed(2)}</td>
                            </tr>


                            <tr>
                                <td className="px-1 py-1">IGST</td>
                                <td className="" style={{ textAlign: 'end', paddingRight: '30px' }}>{parseFloat(invoiceDetails.IGST).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="px-1 py-1"><b>TOTAL :</b></td>
                                <td className="" style={{ textAlign: 'end', paddingRight: '30px' }}><b>{(parseFloat(invoiceDetails.Total_Amount).toFixed(2))}</b></td>
                            </tr>
                            <tr>
                                {/* <td className="col_Header"><b>Advance Amount</b></td> */}
                                {/* <td className="col_Amount" style={{ textAlign: 'end', paddingRight: '30px ' }}><b>{(parseFloat(bookingDate.Advance_Amount).toFixed(2))}</b></td> */}
                            </tr>
                            <tr>
                                {/* <td className="col_Header"><b>Balance</b></td> */}
                                {/* <td className="col_Amount" style={{ textAlign: 'end', paddingRight: '30px ' }}><b>{(parseFloat(invoiceDetailsDate.Grand_Total - bookingDate.Advance_Amount).toFixed(2))}</b></td> */}
                            </tr>
                        </thead>
                    </table>

                    {/* <span>{'for  '}</span><br></br>
                    <br></br>      <br></br>
                    <span>{'Authorised Signatory'}</span>
                    <br></br> */}
                </div>

            </div>


            {/* <hr></hr> */}

            <div className='  flex columns-2  justify-end px-8 mt-2 '>

                <div className="flex text-right" style={{}}>
                    {businessData.Business === 'Magnanim Systems' ?
                        <img src={Magnanim_Sign} alt="sign" h="" w="" /> :
                        businessData.Business === 'Global Systems' ? <img src={GLobal_Sign} alt="sign" h="" w="" /> : ''
                    }


                </div>

            </div>

            <div className='flex justify-between px-40'>

                <div>{'* Customer Signature'}</div>
                <div>{'Authorised Signatory'}</div>
            </div>

            <hr></hr>

            <div className='col-sm-12' style={{ textAlign: 'center' }}>
                <span>{'Thank You, Visit again.. '} </span>
            </div>












        </div >
    )
}
