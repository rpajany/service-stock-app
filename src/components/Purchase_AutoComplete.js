import React, { useState, useRef, useEffect, useContext } from "react";
import { usePurchase } from '../context/purchaseContext';
import { ApiContext } from '../context/ApiProvider';
import { GET_Api } from '../services/ApiService';
import { Get_BaseUrl } from '../helpers/custom';
import { useItemMasterContext } from "../context/ItemMasterContext";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import "../App.css"; // Import the CSS for styling

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

// Sample data
// const itemsData = [
//     { id: "1", Item_Name: "adoreable", Sale_Price: 100, Stock_Qty: 50, hsn: 123, GST_Percentage:18},
//     { id: "2", Item_Name: "addExpress 2", Sale_Price: 200, Stock_Qty: 30, hsn: 123, GST_Percentage: 18 },
//     { id: "3", Item_Name: "aeroplane", Sale_Price: 300, Stock_Qty: 20, hsn: 123, GST_Percentage: 18 },
//     { id: "4", Item_Name: "apple", Sale_Price: 400, Stock_Qty: 10, hsn: 123, GST_Percentage: 18 },
// ];

export const PurchaseAutoComplete = ({ Invoice_Number, inputName, txt_css, setRowItems }) => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    BASE_URL = selectedApi;

    const { purchaseList, addToPurchase, removeFromPurchase, updateFromPurchase, taxable_Amount, total, taxTotal, updateTotal, clear_PurchaseItems } = usePurchase();

    const { itemsMasterData, load_ItemMasterData } = useItemMasterContext();

    const [itemsData, setItemData] = useState([]); // []

    const [query, setQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);



    async function load_ItemsData() {
        // try {
        //     const url = BASE_URL + '/item_master/load';       
        //     const apiResponse = await GET_Api(url, '');
 

        //     apiResponse.then(data => {

        //         setItemData(data);
        //     })

        // } catch (error) {
        //     console.log('Error :', error)
        //     toast.error(error.message)
        // }
        
        try {
            const url = BASE_URL + '/item_master/load';
            const apiResponse = await GET_Api(url, ''); // Await resolves the promise
            setItemData(apiResponse); // Use the resolved data directly
        } catch (error) {
            console.error('Error:', error); // Log the error
            toast.error(error.message); // Display the error message
        }

    }



    useEffect(() => {
       

        load_ItemMasterData();
        setItemData(itemsMasterData)
        // load_ItemsData();
    }, [load_ItemMasterData, itemsMasterData]);

    // console.log('apiResponse', itemsData)

    // Handle search query change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setHighlightedIndex(-1); // Reset highlighted index

        // if (value) {
        //     const results = itemsData.filter((item) =>
        //         item.Item_Name.toLowerCase().includes(value.toLowerCase())
        //     );
        //     setFilteredItems(results);
        // } else {
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



    };

    // Handle item selection
    const handleItemClick = (item) => {
        // alert(`You selected ${item.Item_Name}`);
        setQuery(item.Item_Name);
        // setRowItems(item); // PurchaseEntry State Data

        setFilteredItems([]); // Close the dropdown
        setHighlightedIndex(-1);



        const unitPrice = (item.Purchase_Price * 1);
        // console.log('unitprice', unitPrice)

        const taxAmount = ((unitPrice * item.Tax_Percent) / 100);
        // console.log('taxAmount', taxAmount)
        const itemTotal = (unitPrice + taxAmount);

        // Add a Property
        // Object.defineProperty(item, "taxAmount", { value: taxAmount });
        // Object.defineProperty(item, "total", { value: itemTotal });
        const dataNew = {
            ...item,

            Invoice_Number: Invoice_Number,
            Qty: 1,
            Discount_Amount: 0,
            Discount_Percent: 0,
            taxable_Amount: unitPrice,
            Tax_Amount: taxAmount,
            Tax_Percent: item.Tax_Percent,
            Total: itemTotal
        }

        addToPurchase(dataNew);
        setQuery('');
    };

    // Handle key down events for navigation
    const handleKeyDown = (e) => {
        if (filteredItems.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            // alert('xx')
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
                handleItemClick(filteredItems[highlightedIndex]);
            }
        } else if (e.key === "Escape") {
            setFilteredItems([]);
            setHighlightedIndex(-1);
        }
    };

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
        <div className=" container w-3/6 py-2  ">
            {/* container */}
            <input
                type="text"
                id={inputName}
                name={inputName}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for an item"
                // className="search-input"
                className={`${txt_css} search-input   `}
                ref={inputRef}
                autoComplete="off"
            />

            {/* Dropdown with multi-column data */}
            {filteredItems.length > 0 && (
                <div className="dropdown" ref={dropdownRef}>
                    <div className="dropdown-header">
                        <span>ItemName</span>
                        <span>PartNo</span>
                        <span>ModelNo</span>
                        <span>Purchase_Price</span>
                        <span>Stock</span>
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
                            <span>{item.Purchase_Price}</span>

                            <span>{item.Stock_Qty}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
