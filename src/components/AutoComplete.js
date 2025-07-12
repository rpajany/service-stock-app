import React, { useEffect, useRef, useState } from 'react';
import { useSales } from '../context/salesContext';
import { GET_Api } from '../services/ApiService';
import { toast } from 'react-toastify';

// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-sm border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
const highLight_css = 'bg-blue-500 text-white hover:bg-blue-700 font-bold'; //  bg-white text-black  hover:bg-gray-100

export const AutoComplete = ({ setAutoComplete, clearAutoComplete, sourceApiData }) => {

    // const Eng_Names = [

    // ]
    const [itemsData, setItemData] = useState([]); // to store api data 'kumar', 'selvam', 'ramesh'
    const [query, setQuery] = useState(""); // to store search input query
    const [filteredItems, setFilteredItems] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // clear input from Parent Component
    useEffect(() => {
        if (clearAutoComplete) {
            setQuery("");
        }
    }, [clearAutoComplete])


    console.log('itemsData', itemsData)
    console.log('sourceApiData', sourceApiData)

    useEffect(() => {


        if (sourceApiData && sourceApiData.length > 0) {
            // Get the first key dynamically from the first object in sourceApiData
            const propertyKey = Object.keys(sourceApiData[0])[0]; // Assuming all objects have the same key structure
            const usernames = sourceApiData.map((item, key) => item[propertyKey]); // Extract usernames
            setItemData(usernames);
        }

    }, [sourceApiData])




    const handleInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        setQuery(value); // update search state

        setHighlightedIndex(-1); // Reset highlighted index

        console.log('itemsData', itemsData)
        if (value) {

            const filteredItems = itemsData.filter((item) =>

                item.toLowerCase().includes(value.toLowerCase())

            );
            setFilteredItems(filteredItems); // Set query data in filtered items
        } else {
            setFilteredItems([]); // Set empty filtered items
        }
    }


    // Handle item selection
    const handleItemClick = (item) => {
        // console.log('item', item)
        setQuery(item) // set selected item name to input
        setAutoComplete(item) // output selected item
        setFilteredItems([]); // Close the dropdown
        setHighlightedIndex(-1);
    }

    // Handle key down events for navigation
    const handleKeyDown = (e) => {
        if (filteredItems.length === 0) return;
        // console.log("Key pressed:", e.key);
        // console.log("highlightedIndex:", highlightedIndex);

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
        <div className='w-full'>
            <input type="text"
                ref={inputRef}
                id="autoComplete"
                name="autoComplete"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                value={query}
                placeholder="Search.."
                autoComplete="off"
                className={`${input_css} search-input `}
            />

            {/* Dropdown with multi-column data */}
            <div className='z-50 absolute ' style={{ width: '440px' }}>
                {filteredItems.length > 0 && (
                    <ul className=' border-2 border-gray-400' ref={dropdownRef}>
                        {filteredItems.map((item, index) => (
                            <li key={index}
                                style={{ textTransform: 'capitalize' }}
                                onClick={() => handleItemClick(item)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                className={`${index === highlightedIndex ? highLight_css : 'bg-white text-black'}    border-b-2 px-4 py-1`}>{item}
                            </li>
                        ))}
                    </ul>
                )
                }
            </div>
        </div >
    )
}
