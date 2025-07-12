import React, { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';
import { DataTableVIew, FileUpload, SalesAutoComplete, DatePicker2 } from '../components';
import { useBaseUrl, Get_BusinessService, UpdateBusiness_Service } from '../services/BusinessService';

import { FaEdit, FaPrint } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";


// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-sm border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';

export const Business = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);
    // const { baseUrl: BASE_URL, updateBaseUrl } = useBaseUrl();
    // updateBaseUrl(selectedApi);
    // ... End update API ....

    const [activeTab, setActiveTab] = useState(1);
    const [isEdit, setIsEdit] = useState(false);
    const [apiData, setApiData] = useState([]);
    // const [fileSrc, setFileSrc] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

    const BusinessData_InitialValue = {
        "Business": '',
        "Contact": '',
        "Address": '',
        "Email": '',
        "Website": '',
        "Mobile": '',
        "Landline": '',
        "City": '',
        "State": '',
        "Zip": '',
        "Country": '',
        "GSTIN": '',
        "MSME": '',
        "BankName": '',
        "Branch": '',
        "AccountNumber": '',
        "IFSC_Code": '',
        "MICR_Code": '',
        "Brand_Logo": '',
    }

    const [businessData, setBusinessData] = useState(BusinessData_InitialValue);

    const [imageBase64, setImageBase64] = useState("");
    const [filePreview, setFilePreview] = useState();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusinessData((preve) => {
            return { ...preve, [name]: value }
        });
    }

    // console.log('apiData', apiData)

    async function load_Data() {
        const output = await Get_BusinessService();
        // console.log(output)
        setApiData(output);
    }

    useEffect(() => {

        if (activeTab === 1) {
            load_Data();
        }

        // if (activeTab === 2 && !isEdit) {
        //     get_QuoteUID();

        // }

        if (imageBase64 !== "") {
            setBusinessData((preve) => {
                return { ...preve, ...{ Brand_Logo: imageBase64 } }
            });

            // setFilePreview(businessData.Brand_Logo);
        }

    }, [activeTab, isEdit, imageBase64, businessData.Brand_Logo]);



    console.log('businessData', businessData)

    const handelFileUpload = (file, fileName) => {
        console.log('file', file)
        console.log('fileName', fileName)



    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        try {
            if (isEdit) {
                const output = await UpdateBusiness_Service(businessData.id, businessData);
                if (output) {
                    setBusinessData(BusinessData_InitialValue);
                    setFilePreview('');
                    setIsEdit(false);
                } else {
                    console.log('Error Update Business...!')
                }
            }

        } catch (error) {
            console.log('Error :', error)
        } finally {
            setIsSubmitting(false); // Unlock the form
        }

    }

    const handleEdit = async (row) => {
        setBusinessData((preve) => {
            return { ...preve, ...row, id: row.id }
        });

        setFilePreview(row.Brand_Logo);

        setActiveTab(2);
        setIsEdit(true); // set to edit mode ...
    }

    // Define table columns
    const columns = [
        {
            name: 'Business',
            selector: row => row.Business,
            sortable: true
        },
        {
            name: 'Contact',
            selector: row => row.Contact,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.Email,
            sortable: true
        },
        {
            name: 'Website',
            selector: row => row.Website,
            sortable: true
        },
        {
            name: 'Mobile',
            selector: row => row.Mobile,
            sortable: true
        },
        {
            name: 'Landline',
            selector: row => row.Landline,
            sortable: true
        },
        {
            name: 'City',
            selector: row => row.City,
            sortable: true
        },
        {
            name: 'State',
            selector: row => row.State,
            sortable: true
        },
        {
            name: 'Zip',
            selector: row => row.Zip,
            sortable: true
        },
        {
            name: 'Country',
            selector: row => row.Country,
            sortable: true
        },
        {
            name: 'GSTIN',
            selector: row => row.GSTIN,
            sortable: true
        },
        {
            name: 'MSME',
            selector: row => row.MSME,
            sortable: true
        },
        {
            name: 'BankName',
            selector: row => row.BankName,
            sortable: true
        },
        {
            name: 'Branch',
            selector: row => row.Branch,
            sortable: true
        },
        {
            name: 'AccountNumber',
            selector: row => row.AccountNumber,
            sortable: true
        },
        {
            name: 'IFSC_Code',
            selector: row => row.IFSC_Code,
            sortable: true
        },
        {
            name: 'MICR_Code',
            selector: row => row.MICR_Code,
            sortable: true
        },
        // {
        //     name: 'Brand_Logo',
        //     selector: row => row.Brand_Logo,
        //     sortable: true
        // },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>

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

            <div className="w-full mx-auto p-1">
                {/* Tab navigation */}
                <ul className="flex space-x-4 border-b-2 border-gray-200">
                    <li className={`cursor-pointer p-2 ${activeTab === 1 ? 'text-blue-600 border-blue-600 border-b-2  bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(1)}>
                        View
                    </li>
                    <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                        onClick={() => setActiveTab(2)}>
                        Business
                    </li>
                </ul>

                {/* Tab content */}
                <div className="mt-4">
                    {activeTab === 1 && (
                        <div className="p-4 bg-green-300 rounded-lg">
                            {/*  Content for Tab 1  */}
                            <DataTableVIew tbl_title={'Company Details'} columns={columns} apiData={apiData} />
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="border-2     rounded-lg">
                            {/*  Content for Tab 2  */}

                            <div className="bg-green-400 text-white px-3 py-2">
                                <span>Create Business</span>
                            </div>
                            <div className='p-3'>
                                <form onSubmit={handleSubmit}>

                                    <p className="mt-4 mb-4" style={{ backgroundColor: 'aliceblue' }}>Business Logo :</p>

                                    {/* <div className="">

                                        <img className="thumbnail preview" alt="Brand-logo" src={Default_BrandLogo} width="100px" style={{ border: 'solid 1px' }} />

                                        <input className="newPics" type="file" id="newPhoto" name="newPhoto" />

                                        <p className="help-block">Maximum size 2Mb</p>
                                        <input type="hidden" name="txt_CurrentPicture" id="txt_CurrentPicture" value="" />
                                    </div> */}

                                    <FileUpload handelFileUpload={handelFileUpload} filePreview={filePreview} setFilePreview={setFilePreview} setImageBase64={setImageBase64} />

                                    <hr className="mt-4 mb-4" style={{ borderColor: '#28a745' }}></hr>

                                    <p className="mt-4 mb-4" style={{ backgroundColor: 'aliceblue' }}  >Business Details :</p>

                                    <div>
                                        <div className="form-group"  >
                                            <label htmlFor="Business" className={`${label_css}`}>Business Name</label>
                                            <input
                                                type="text"
                                                id="Business"
                                                name="Business"
                                                onChange={handleChange}
                                                value={businessData.Business}
                                                placeholder="Bussiness Name"
                                                required
                                                className={`${input_css} w-full`} />
                                        </div>
                                    </div>
                                    <div className='grid gap-20 md:grid-cols-2 mt-4'>
                                        <div className='col-1'> {/* Start col-1 */}


                                            <div className="form-group"   >
                                                <label htmlFor="Contact">Contact</label>
                                                <input
                                                    type="text"
                                                    id="Contact"
                                                    name="Contact"
                                                    onChange={handleChange}
                                                    value={businessData.Contact}
                                                    required
                                                    placeholder="Contact Person Name"
                                                    className={`${input_css} w-full`} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="Mobile">Mobile</label>
                                                <input
                                                    type="text"
                                                    id="Mobile"
                                                    name="Mobile"
                                                    onChange={handleChange}
                                                    value={businessData.Mobile}
                                                    required
                                                    placeholder="Mobile Number"
                                                    className={`${input_css} w-full`} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="Address">Address</label>
                                                <textarea
                                                    id="Address"
                                                    name="Address"
                                                    onChange={handleChange}
                                                    value={businessData.Address}
                                                    required
                                                    placeholder="Enter Business Address"
                                                    className={`${input_css} w-full`} >
                                                </textarea>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="Zip">Zip</label>
                                                <input
                                                    type="text"
                                                    id="Zip"
                                                    name="Zip"
                                                    onChange={handleChange}
                                                    value={businessData.Zip}
                                                    required
                                                    placeholder="Enter Zip Code"
                                                    className={`${input_css} w-full`} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="GSTIN">GSTIN Number</label>
                                                <input
                                                    type="text"
                                                    id="GSTIN"
                                                    name="GSTIN"
                                                    onChange={handleChange}
                                                    value={businessData.GSTIN}
                                                    required
                                                    placeholder="Enter GSTIN Number"
                                                    className={`${input_css} w-full`} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="MSME">MSME Number</label>
                                                <input
                                                    type="text"
                                                    id="MSME"
                                                    name="MSME"
                                                    onChange={handleChange}
                                                    value={businessData.MSME}
                                                    required
                                                    placeholder="Enter MSME Number"
                                                    className={`${input_css} w-full`} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="Website">WebSite</label>
                                                <input
                                                    type="text"
                                                    id="Website"
                                                    name="Website"
                                                    onChange={handleChange}
                                                    value={businessData.Website}
                                                    required
                                                    placeholder="Enter Website"
                                                    className={`${input_css} w-full`} />
                                            </div>

                                        </div> {/* End of col-1 */}

                                        <div className='col-2'>
                                            <div className="form-group">
                                                <label htmlFor="Email">Email</label>
                                                <input
                                                    type="email"
                                                    id="Email"
                                                    name="Email"
                                                    onChange={handleChange}
                                                    value={businessData.Email}
                                                    required
                                                    placeholder="Email@com"
                                                    className={`${input_css} w-full`} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="Landline">Wired Phone</label>
                                                <input
                                                    type="text"
                                                    id="Landline"
                                                    name="Landline"
                                                    onChange={handleChange}
                                                    value={businessData.Landline}
                                                    placeholder="Landline Phone Number"
                                                    className={`${input_css} w-full`} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="City">City</label>
                                                <input
                                                    type="text"
                                                    id="City"
                                                    name="City"
                                                    onChange={handleChange}
                                                    value={businessData.City}
                                                    required
                                                    placeholder="City Name"
                                                    className={`${input_css} w-full`} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="State">State</label>
                                                <select id="State" name="State" value={businessData.State} onChange={handleChange} className={`${input_css} w-full`} >
                                                    <option value="" >--SELECT--</option>
                                                    <option value="Puducherry">Puducherry</option>
                                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="Country">Country</label>
                                                <input
                                                    type="text"
                                                    id="Country"
                                                    name="Country"
                                                    onChange={handleChange}
                                                    value={businessData.Country}
                                                    placeholder="Enter Country Name."
                                                    className={`${input_css} w-full`} />
                                            </div>

                                        </div> {/* End of col-2 */}

                                    </div>

                                    <hr className="mt-4 mb-4" style={{ borderColor: '#28a745' }}></hr>

                                    <p className="mt-4 mb-4" style={{ backgroundColor: 'aliceblue' }}>Bank Details :</p>


                                    <div className='grid gap-8 md:grid-cols-2'>
                                        <div className="form-group">
                                            <label htmlFor="BankName">Bank Name</label>
                                            <input
                                                type="text"
                                                id="BankName"
                                                name="BankName"
                                                onChange={handleChange}
                                                value={businessData.BankName}
                                                required
                                                placeholder="Bank Name"
                                                className={`${input_css} w-full`} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="Branch">Branch</label>
                                            <input
                                                type="text"
                                                id="Branch"
                                                name="Branch"
                                                onChange={handleChange}
                                                value={businessData.Branch}
                                                required
                                                placeholder="Branch Location"
                                                className={`${input_css} w-full`} />
                                        </div>
                                    </div>

                                    <div className='grid gap-8 md:grid-cols-3'>

                                        <div className="form-group">
                                            <label htmlFor="AccountNumber">Account Number</label>
                                            <input
                                                type="text"
                                                id="AccountNumber"
                                                name="AccountNumber"
                                                onChange={handleChange}
                                                value={businessData.AccountNumber}
                                                required
                                                placeholder="A/C No."
                                                className={`${input_css} w-full`} />
                                        </div>




                                        <div className="form-group">
                                            <label htmlFor="IFSC_Code">IFSC Code</label>
                                            <input
                                                type="text"
                                                id="IFSC_Code"
                                                name="IFSC_Code"
                                                onChange={handleChange}
                                                value={businessData.IFSC_Code}
                                                required
                                                placeholder="Bank IFSC Code"
                                                className={`${input_css} w-full`} />
                                        </div>




                                        <div className="form-group">
                                            <label htmlFor="MICR_Code">MICR Code</label>
                                            <input
                                                type="text"
                                                id="MICR_Code"
                                                name="MICR_Code"
                                                onChange={handleChange}
                                                value={businessData.MICR_Code}
                                                placeholder="Bank MICR Code"
                                                className={`${input_css} w-full`} />
                                        </div>


                                    </div>
                                    <button type="submit"
                                        disabled={isSubmitting}
                                        className={`${!isEdit ? ' bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-40  mt-4  p-3  rounded-lg ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>
                                </form>
                            </div>


                        </div>


                    )}
                </div>
            </div >

        </>
    )
}
