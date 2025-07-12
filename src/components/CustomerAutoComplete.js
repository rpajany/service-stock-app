import React, { useRef, useState, useEffect } from 'react'
// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-lg border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';

export const CustomerAutoComplete = ({ autoCompleteData, Invoice_Number, inputName, txt_css, setSelectedCustomer }) => {
    const inputRef = useRef(null)
    const dropdownRef = useRef(null);

    const [itemsData, setItemData] = useState([]); // to store api data
    const [query, setQuery] = useState(""); // to store search input query
    const [filteredItems, setFilteredItems] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    useEffect(() => {
        setItemData(autoCompleteData); // update state data
    }, [autoCompleteData])

    // Handle search query change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value); // update search state
        setHighlightedIndex(-1); // Reset highlighted index
        if (value) {
            const results = itemsData.filter((item) => {
                return (
                    item.Customer_Name.toLowerCase().includes(value.toLowerCase()) ||
                    item.Mobile.toLowerCase().includes(value.toLowerCase()) // ||                
                    // item.Address.toLowerCase().includes(value.toLowerCase())



                );
            });
            setFilteredItems(results); // Set query data in filtered items
        } else {
            setFilteredItems([]); // Set empty filtered items
        }
    }

    // Handle item selection
    const handleItemClick = (item) => {
        // alert(`You selected : ${item.Item_Name}`);
        setQuery(item.Item_Name); // set selected item name to input
        setSelectedCustomer(item); // set SalesEntry State Data

        setFilteredItems([]); // Close the dropdown
        setHighlightedIndex(-1);

        setQuery(''); // clear search query
    }

    // Handle key down events for navigation
    const handleKeyDown = (e) => {
        if (filteredItems.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prevIndex) =>
                prevIndex < filteredItems.length - 1 ? prevIndex + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : filteredItems.length - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
                handleItemClick(filteredItems[highlightedIndex]); // add item to function above
            }
        } else if (e.key === "Escape") {
            setFilteredItems([]);
            setHighlightedIndex(-1);
        }

    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setFilteredItems([]);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className=' w-full '>
            <input type="text"
                ref={inputRef}
                id={inputName}
                name={inputName}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search Customer by Name / Mobile"
                autoComplete="off"
                className={`${input_css} search-input `}
            />

            {/* Dropdown with multi-column data */}
            {filteredItems.length > 0 && (
                <div className="w-full bg-white" ref={dropdownRef}>
                    <div className=" bg-black dropdown-header">
                        <span>Customer_Name</span>
                        <span>Mobile</span>
                        {/* <span>Address</span> */}


                    </div>
                    {filteredItems.map((item, index) => (
                        <div
                            key={index}
                            className={` dropdown-row ${index === highlightedIndex ? "highlighted" : ""
                                }`}
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            <span className="items-start">{item.Customer_Name}</span>
                            <span className='items-center'>{item.Mobile}</span>
                            {/* <span className=' '>{item.Address}</span> */}



                        </div>
                    ))}
                </div>
            )}




        </div>
    )
}
