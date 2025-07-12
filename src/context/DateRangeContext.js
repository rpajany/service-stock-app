import { useState, createContext, useContext } from "react";


// Create Context with a default value of null
const DateRangeContext = createContext(null);

// Provider Component
export const DateRangeProvider = ({ children }) => {
    // Get the current date
    const currentDate = new Date();

    // First and last day of the current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); 
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

     // State to hold the date range
    const [dateRange, setDateRange] = useState([
        {
            startDate: firstDayOfMonth, // new Date(), 
            endDate: lastDayOfMonth, //addDays(new Date(), 7),
            key: 'selection'
        }
    ]);


    return (
        <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateRangeContext.Provider>
    )

}

 

// Custom hook to use the date range context
export const useDateRange = () => {
  const context = useContext(DateRangeContext);

  if (context === undefined || context === null) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }

  return context;
};