import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const DatePicker2 = ({ title, date, setDate }) => {
    const [startDate, setStartDate] = useState(new Date());

    const handleDate = (date) => {
        setDate(date);
        setStartDate(date);
    }

    return (
        // flex flex - col items - center
        <div className="flex flex-col "> 
            <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {title}
            </label>
            <DatePicker
                // selected={startDate}
                selected={date}
                // onChange={(date) => setStartDate(date)}
                // onChange={(date) => setDate(date)}
                onChange={(date) => handleDate(date)}
                dateFormat="dd-MM-yyyy"
                className="block w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
        </div>
    )
}
