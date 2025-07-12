export const purchaseReducer = (state, action) => {
    const { type, payload } = action; // destructure

    switch (type) {
        case "ADD_TO_PURCHASE":
            return { ...state, purchaseList: payload.items } // return previous state and update purchaseList get from "addToPurchase" function in PurchaseContext
        case "REMOVE_FROM_PURCHASE":
            return { ...state, purchaseList: payload.items }
        case "UPDATE_FROM_PURCHASE":
            return { ...state, purchaseList: payload.items }
        case "UPDATE_TOTAL":
            return { ...state, total: payload.total }
        case "UPDATE_TAX_AMOUNT":
            return { ...state, taxTotal: payload.taxTotal }
        case "UPDATE_TAXABLE_AMOUNT":
            return { ...state, taxable_Amount: payload.taxable_Amount }
        case "CLEAR_PURCHASE_ITEMS":
            return {
                ...state,
                purchaseList: [],
                taxable_Amount: 0,
                taxTotal: 0,
                total: 0
            }
        default:
            throw new Error("No Case Found In purchaseReducer");
    }
}