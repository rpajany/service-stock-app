import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const DateRangePicker = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Handle start and end date change
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

  return (
      <div className="flex flex-col items-center">
          <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Date Range
          </label>
          <div className="flex space-x-4">
              <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd-MM-yyyy"  // Date format for start date  
                  className="block w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholderText="Start Date"
              />
              <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
            
                  minDate={startDate}     // Prevents selecting an end date before the start date 
                  dateFormat="dd-MM-yyyy"  // Date format for end date  
                  className="block w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholderText="End Date"
              />
          </div>
          <div className="mt-4">
              <p>Selected Range: {startDate && endDate ? `${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')}` : 'No range selected'}</p>
          </div>
      </div>
  )
}
