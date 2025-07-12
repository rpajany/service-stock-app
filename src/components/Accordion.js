import React, { useState } from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";
// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-lg border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';


export const Accordion = () => {
    const [openItems, setOpenItems] = useState([]);

    const toggleItem = (id) => {
        setOpenItems((prevOpenItems) =>
            prevOpenItems.includes(id)
                ? prevOpenItems.filter((itemId) => itemId !== id)
                : [...prevOpenItems, id]
        );
    };

    const accordionData = [
        {
            id: 1,
            title: "Customer Information :",
            content: (
                <>
                    <div className="grid md:grid-cols-3 sm:grid-cols-3 gap-4">

                        <div className=''>
                            <label className={`${label_css}`}>Customer Name</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>



                        <div className=''>
                            <label className={`${label_css}`}>Mobil</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Email</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Address</label>
                            {/* <input type="text" id="" name="" className={`${input_css} w-full`} /> */}
                            <textarea id="Address" rows="4" className="block p-2.5 w-full text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Address.."></textarea>
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>GSTIN</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
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
                            <label className={`${label_css}`}>Product Type</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Brand</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Model Name</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Model Number</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>



                    </div>

                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-3">

                        <div className=''>
                            <label className={`${label_css}`}>Product Color</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Product Config</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Password / Patten Lock</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>SI.No</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>



                    </div>

                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-3">
                        <div className=''>
                            <label className={`${label_css}`}>Problem Reported</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Condition of the Product  </label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Estimated Cost(Rs.)</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Advance Paid(Rs.)</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>
                        <div className=''>
                            <label className={`${label_css}`}>Expected Delivery Date</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>
                    </div>

                    <div>
                        <span>Recived Items</span>
                    </div>

                    <div className="grid md:grid-cols-1 sm:grid-cols-1 mb-3">


                        <table className='table-auto border-collapse border border-slate-200 rounded-lg'>
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
                        </table>


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
                            <label className={`${label_css}`}>Date</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Revised Estimate  </label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Problem Dignosed</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>


                    </div>

                    <div className="grid md:grid-cols-1 sm:grid-cols-1 gap-4 mb-3">
                        <div className=''>
                            <label className={`${label_css}`}>Move To:</label>


                            <fieldset className='flex'>
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
                                        Pending
                                    </label>
                                </div>

                                <div className="flex items-center mb-4 pr-4">
                                    <input id="country-option-3" type="radio" name="countries" value="Spain" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="country-option-3" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Parts Pending
                                    </label>
                                </div>

                                <div className="flex items-center mb-4 pr-4">
                                    <input id="country-option-4" type="radio" name="countries" value="United Kingdom" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="country-option-4" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Service
                                    </label>
                                </div>

                                <div className="flex items-center mb-4 pr-4">
                                    <input id="country-option-4" type="radio" name="countries" value="United Kingdom" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="country-option-4" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Save and Exit
                                    </label>
                                </div>

                            </fieldset>

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
                            <label className={`${label_css}`}>Service Date</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Service Remarks(Engineer)  </label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                        <div className=''>
                            <label className={`${label_css}`}>Service Remarks(Customer)</label>
                            <input type="text" id="" name="" className={`${input_css} w-full`} />
                        </div>

                    </div>

                    <div><span>Spare Parts Used :</span></div>

                    <div className="grid md:grid-cols-1 sm:grid-cols-1 mb-3">
                        <table className='table-auto border-collapse border border-slate-200'>
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
                        </table>
                    </div>

                    <div className='mt-4'>
                        <button className='bg-green-400 hover:bg-green-500 text-white p-2 rounded-lg mr-4'>+ ADD SPARE PARTS FROM INVENTORY</button>
                        <button className='bg-green-400 hover:bg-green-500 text-white p-2 rounded-lg'>+ ADD SPARE PARTS</button>
                    </div>


                    <div className='mt-4'>
                        <button className='bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-lg mr-4'>UPDATE</button>
                        <button className='border hover:border-white border-gray-500 p-2 rounded-lg'>CANCEL</button>
                    </div>

                </>
            ),
        }
    ];

    return (
        <div id="accordion-open" data-accordion="open">
            <form>
                <span>Create New Job Sheet</span>
                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-3">
                    <div className=''>
                        <span className="">Service Type</span>
                        <fieldset className='flex'>
                            {/* <legend className="sr-only">Service Type</legend> */}


                            <div className="flex items-center mb-4 pr-4">
                                <input type="radio" id="carryIn" name="carryIn" value="Carry In" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" checked />
                                <label for="carryIn" className="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Carry In
                                </label>
                            </div>

                            <div className="flex items-center mb-4 pr-4">
                                <input type="radio" id="pickUp" name="pickUp" value="Pick Up" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="country-option-2" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Pick Up
                                </label>
                            </div>

                            <div className="flex items-center mb-4 pr-4">
                                <input type="radio" id="onSite" name="onSite" value="On Site" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="country-option-3" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    On Site
                                </label>
                            </div>


                        </fieldset>


                   
                    </div>

                    <div className='  '>
                        <label className={`${label_css}`}>Job Sheet No.</label>
                        <input className={`${input_css} w-1/2`} />
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
            </form>
        </div>
    )
}
