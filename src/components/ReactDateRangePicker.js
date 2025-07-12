import React, { useEffect, useState, useContext } from 'react';
import { DateRangePicker } from 'react-date-range';
import { useDateRange } from '../context/DateRangeContext'
import moment from 'moment';
import { format, addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BsCalendar2Date } from "react-icons/bs";

export const ReactDateRangePicker = ({ setDateRangeNow }) => {

    const { dateRange, setDateRange } = useDateRange(); // context

    const [showDateRange, setShowDateRange] = useState(false)

    // Get the current date
    // const currentDate = new Date();

    // Get the first day of the current month
    // const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the last day of the current month
    // const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // const [dateRange, setDateRange] = useState([
    //     {
    //         startDate: firstDayOfMonth, // new Date(), 
    //         endDate: lastDayOfMonth, //addDays(new Date(), 7),
    //         key: 'selection'
    //     }
    // ]);

    // Local state for displaying the date range as a string
    const [dateRangeNowLocal, setDateRangeNowLocal] = useState("");

    // const { startDate, endDate } = dateRange[0]

    // console.log("startDate", format(new Date(startDate), "dd-MM-yyyy"))
    // console.log("endDate", format(new Date(endDate), "dd-MM-yyyy"))
    // const dateRangeNow = format(new Date(startDate), "dd-MM-yyyy") + " to " + format(new Date(endDate), "dd-MM-yyyy")
    // setDateRangeNow(dateRangeNow);

    // const dateArray = {
    //     startDate: format(new Date(startDate), "dd-MM-yyyy"),
    //     endDate: format(new Date(endDate), "dd-MM-yyyy")
    // }


    // console.log('typeof (setDateRange)', typeof (setDateRange))

    useEffect(() => {
        if (dateRange[0]?.startDate && dateRange[0]?.endDate) {
            const { startDate, endDate } = dateRange[0];
            const formattedDateRange = `${format(new Date(startDate), "dd-MM-yyyy")} to ${format(new Date(endDate), "dd-MM-yyyy")}`;

            // Update local state for displaying in the input
            setDateRangeNowLocal(formattedDateRange);

            // Update parent component state using the passed prop function
            // Only call setDateRangeNow if it is a function
            if (typeof setDateRangeNow === 'function') {
                setDateRangeNow({
                    startDate: format(new Date(startDate), "dd-MM-yyyy"),
                    endDate: format(new Date(endDate), "dd-MM-yyyy"),
                });
            }
        }

    }, [dateRange, setDateRangeNow])


    return (
        <>
            <div className=' '>
                <span className=' flex items-center '>Date :
                    <div onClick={() => setShowDateRange(!showDateRange)} className='ml-2'>

                        <input type="text" id="" name="" value={dateRangeNowLocal} className='p-0.5 font-thin rounded-md border-gray-300' />
                        <button type="button"

                            className='bg-blue-600 text-white px-2 py-1 ml-1 hover:bg-blue-500 rounded-md border-2 border-gray-400  items-center text-center text-nowrap '><span className='flex items-center '>  <BsCalendar2Date /></span>
                        </button>
                    </div>
                </span>


                {showDateRange && (
                    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center'>
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <div className='text-right pb-4'>
                                <button type="button" onClick={()=>setShowDateRange(!showDateRange) } className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                        
                            <DateRangePicker
                                onChange={item => setDateRange([item.selection])}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                ranges={dateRange}
                                direction="horizontal"
                                preventSnapRefocus={true}
                                calendarFocus="backwards"
                                className='border-2  p-3'
                            />
                        </div>
                    </div>

                )}
            </div>
        </>
    )
}
