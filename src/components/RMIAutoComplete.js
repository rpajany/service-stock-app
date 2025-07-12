import React, { useRef, useState, useEffect } from 'react'
import { GET_Api } from '../services/ApiService';
import { toast } from 'react-toastify';

export const RMIAutoComplete = ({ autoCompleteData, Invoice_Number, inputName, txt_css, setRowItems }) => {
    const inputRef = useRef(null)
    const dropdownRef = useRef(null);

    const [itemsData, setItemData] = useState([]); // to store api data
    const [query, setQuery] = useState(""); // to store search input query
    const [filteredItems, setFilteredItems] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    // useEffect(() => {
    //     async function load_ItemsData() {
    //         try {
    //             const url = process.env.REACT_APP_BACKEND_BASE_URL + '/item_master/load';
    //             await GET_Api(url, '').then(data => {
    //                 setItemData(data); // update state data
    //             })
    //         } catch (error) {
    //             console.log('Error :', error)
    //             toast.error(error.message)
    //         }
    //     }

    //     load_ItemsData();

    // }, []);


    useEffect(() => {
        setItemData(autoCompleteData); // update state data
    }, [autoCompleteData])

    // Handle search query change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value); // update search state
        setHighlightedIndex(-1); // Reset highlighted index

        // if (value) {
        //     const results = itemsData.filter((item) => item.Item_Name.toLowerCase().includes(value.toLowerCase()));
        //     // set query data in filterd items
        //     setFilteredItems(results);
        // } else {
        //     // set empty filterd items
        //     setFilteredItems([]); 
        // }


        if (value) {
            const results = itemsData.filter((item) => {
                return (
                    item.Item_Name.toLowerCase().includes(value.toLowerCase()) ||
                    item.PartNumber.toLowerCase().includes(value.toLowerCase()) ||
                    item.ModelNumber.toLowerCase().includes(value.toLowerCase())
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
        setRowItems(item); // set SalesEntry State Data

        setFilteredItems([]); // Close the dropdown
        setHighlightedIndex(-1);

        // const unitPrice = (item.Sale_Price * 1);
        // const taxAmount = ((unitPrice * item.Tax_Percent) / 100);
        // const itemTotal = (unitPrice + taxAmount);

        // const dataNew = {
        //     ...item,

        //     Invoice_Number: Invoice_Number,
        //     Qty: 1,
        //     Discount_Amount: 0,
        //     Discount_Percent: 0,
        //     taxable_Amount: unitPrice,
        //     Tax_Amount: taxAmount,
        //     Tax_Percent: item.Tax_Percent,
        //     Total: itemTotal
        // }


        setQuery(''); // clear search query
    }

    // console.log('salesList', salesList)

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
        <div className='container w-3/6 '>
            <input type="text"
                ref={inputRef}
                id={inputName}
                name={inputName}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for an Item Stock.."
                autoComplete="off"
                className={`${txt_css} search-input `}
            />

            {/* Dropdown with multi-column data */}
            {filteredItems.length > 0 && (
                <div className="dropdown" ref={dropdownRef}>
                    <div className="dropdown-header">
                        <span>ItemName</span>
                        <span>PartNo</span>
                        <span>ModelNo</span>

                        <span>Eng_Stock</span>
                        <span>Eng_Name</span>
                    </div>
                    {filteredItems.map((item, index) => (
                        <div
                            key={index}
                            className={`dropdown-row ${index === highlightedIndex ? "highlighted" : ""
                                }`}
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            <span className="">{item.Item_Name}</span>
                            <span>{item.PartNumber}</span>
                            <span>{item.ModelNumber}</span>
                            <span>{item.Issue_Qty}</span>
                            <span>{item.Eng_Name}</span>


                        </div>
                    ))}
                </div>
            )}




        </div>
    )
}
