import { createContext, useContext, useReducer } from "react";
import { salesReducer } from '../reducer/salesReducer';

// initial state when a user first visit the web page
const initialState = {
    salesList: [],
    taxable_Amount: 0,
    taxTotal: 0,
    total: 0
}

// create a context for sales and pass initial value
const SalesContext = createContext(initialState);

// create a provider for sales which can be raped around <app/> in index.js
export const SalesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(salesReducer, initialState); // this return state

    // function addToSales get param product
    const addToSales = (item) => {
        const updatedSalesList = state.salesList.concat(item); // add to end of initialState cartList array

        updateTaxable_Amount(updatedSalesList); // call below updateTotal function and pass argu "updatedSalesList"
        updateTaxAmount(updatedSalesList);
        updateTotal(updatedSalesList);

        dispatch({
            type: "ADD_TO_SALES",
            payload: {
                items: updatedSalesList
            }
        })
    }

    // function delete ...
    const removeFromSales = (item) => {
        const updatedSalesList = state.salesList.filter((current) => current.Part_id !== item.Part_id); // remove the item match

        updateTaxable_Amount(updatedSalesList); // call below updateTotal function and pass argu "updatedSalesList"
        updateTaxAmount(updatedSalesList);
        updateTotal(updatedSalesList);

        dispatch({
            type: "REMOVE_FROM_SALES",
            payload: {
                items: updatedSalesList
            }
        })
    }

    // function update  ...
    const updateFromSales = (item) => {
        const updatedSalesList = state.salesList.map((current) => current.Part_id === item.Part_id ? { ...current, ...item } : current);

        updateTaxable_Amount(updatedSalesList); // call below updateTotal function and pass argu "updatedSalesList"
        updateTaxAmount(updatedSalesList);
        updateTotal(updatedSalesList);

        dispatch({
            type: "UPDATE_FROM_SALES",
            payload: {
                items: updatedSalesList
            }
        })
    }

    // reset sales items
    const clear_SalesItems = () => {
        console.log('clear Salesitems !!!');

        dispatch({
            type: "CLEAR_SALES_ITEMS",
            payload: {
                salesList: [],
                taxable_Amount: 0,
                taxTotal: 0,
                total: 0

            }
        })
    }

    // calc total function
    const updateTotal = (products) => {
        let amtTotal = 0;
        products.forEach(product => amtTotal = amtTotal + (product.Total));

        dispatch({
            type: "UPDATE_TOTAL",
            payload: {
                total: amtTotal

            }
        })
    }

    // calc Tax Amount function
    const updateTaxAmount = (products) => {
        let taxAmount = 0;
        products.forEach(product => taxAmount = taxAmount + (product.Tax_Amount));

        dispatch({
            type: "UPDATE_TAX_AMOUNT",
            payload: {
                taxTotal: taxAmount
            }
        })
    }

    // calc Taxable Amount function
    const updateTaxable_Amount = (products) => {
        let taxableAmount = 0;
        products.forEach(product => taxableAmount = taxableAmount + (product.taxable_Amount));

        dispatch({
            type: "UPDATE_TAXABLE_AMOUNT",
            payload: {
                taxable_Amount: taxableAmount
            }
        })
    }

    const value = {
        salesList: state.salesList,  // pass useReducer initialState key value
        total: state.total,
        taxable_Amount: state.taxable_Amount,
        taxTotal: state.taxTotal,

        addToSales, // add function
        removeFromSales, // remove function
        updateFromSales,
        updateTotal,
        updateTaxAmount,
        clear_SalesItems
    }

    return (
        <SalesContext.Provider value={value}>
            {children}
        </SalesContext.Provider>
    )

}  // End SalesProvider function

export const useSales = () => {
    const context = useContext(SalesContext);
    return context;
}