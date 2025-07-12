import { createContext, useContext, useReducer } from "react";
import { purchaseReducer } from '../reducer/purchseReducer';

// initial state when a user first visit the web page
const initialState = {
    purchaseList: [],
    taxable_Amount: 0,
    taxTotal: 0,
    total: 0
}

// create a context for purchase and pass initial value
const PurchaseContext = createContext(initialState);

// create a provider for purchase which can be raped around <app/> in index.js
export const PurchaseProvider = ({ children }) => {
    const [state, dispatch] = useReducer(purchaseReducer, initialState); // this return state

    // function addToPurchase get param product
    const addToPurchase = (item) => {
        // console.log(item)
        const updatedPurchaseList = state.purchaseList.concat(item); // add to end of initialState cartList array 

        updateTotal(updatedPurchaseList);  // call below updateTotal function and pass argu "updatedPurchaseList"
        updateTaxAmount(updatedPurchaseList);
        updateTaxable_Amount(updatedPurchaseList);

        dispatch({
            type: "ADD_TO_PURCHASE",
            payload: {
                items: updatedPurchaseList
            }
        })
    }

    // function delete ...
    const removeFromPurchase = (item) => {
        const updatedPurchaseList = state.purchaseList.filter((current) => current.Part_id !== item.Part_id) // remove the item match

        updateTotal(updatedPurchaseList);  // call below updateTotal function and pass argu "updatedPurchaseList"
        updateTaxAmount(updatedPurchaseList);
        updateTaxable_Amount(updatedPurchaseList);

        dispatch({
            type: "REMOVE_FROM_PURCHASE",
            payload: {
                items: updatedPurchaseList
            }
        })
    }

    // function update  ...
    const updateFromPurchase = (item) => {
        const updatedPurchaseList = state.purchaseList.map((current) => current.Part_id === item.Part_id ?
            { ...current, ...item } : current);


        // console.log('context update', item);
        // console.log('updatedPurchaseList', updatedPurchaseList);

        updateTotal(updatedPurchaseList);
        updateTaxAmount(updatedPurchaseList);
        updateTaxable_Amount(updatedPurchaseList);

        dispatch({
            type: "UPDATE_FROM_PURCHASE",
            payload: {
                items: updatedPurchaseList
            }
        })
    }

    // reset purchase items
    const clear_PurchaseItems = () => {
        console.log('PurchaseItems clear !!!');

        dispatch({
            type: "CLEAR_PURCHASE_ITEMS",
            payload: {
                purchaseList: [],
                taxable_Amount: 0,
                taxTotal: 0,
                total: 0

            }
        })
    }

    // calc total function
    const updateTotal = (products) => {
        let amtTotal = 0;

        // products.forEach(product => total = total + (product.qty * product.price));
        products.forEach(product => amtTotal = amtTotal + (product.Total));


        // console.log('state_total', state.total)


        dispatch({
            type: "UPDATE_TOTAL",
            payload: {
                total: amtTotal

            }
        })
    };

    // calc Tax Amount function
    const updateTaxAmount = (products) => {
        let taxAmount = 0;
        products.forEach(product => taxAmount = taxAmount + (product.Tax_Amount));

        // console.log('state_taxamount', state.taxTotal)

        dispatch({
            type: "UPDATE_TAX_AMOUNT",
            payload: {
                taxTotal: taxAmount
            }
        })
    };

    // calc Taxable Amount function
    const updateTaxable_Amount = (products) => {
        let taxableAmount = 0;
        products.forEach(product => taxableAmount = taxableAmount + (product.taxable_Amount));

        // console.log('state_taxable_Amount', state.taxable_Amount)

        dispatch({
            type: "UPDATE_TAXABLE_AMOUNT",
            payload: {
                taxable_Amount: taxableAmount
            }
        })
    };


    const value = {
        total: state.total, // pass useReducer initialState key value
        taxable_Amount: state.taxable_Amount,
        taxTotal: state.taxTotal,
        purchaseList: state.purchaseList,
        addToPurchase, // add function
        removeFromPurchase, // remove function
        updateFromPurchase,
        updateTotal,
        updateTaxAmount,
        clear_PurchaseItems


    }



    return (
        <PurchaseContext.Provider value={value}>
            {children}
        </PurchaseContext.Provider>
    )

}  // End PurchaseProvider function

export const usePurchase = () => {
    const context = useContext(PurchaseContext);
    return context;
}