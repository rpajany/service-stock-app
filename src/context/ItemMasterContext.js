import React, { useState, createContext, useContext, useEffect } from "react";
import { ApiContext } from '../context/ApiProvider';
import { Get_BaseUrl } from '../helpers/custom';
import { GET_Api } from '../services/ApiService';

// const BASE_URL = Get_BaseUrl();
// let BASE_URL = "";

const ItemMasterContext = createContext();

export const ItemMasterProvider = ({ children }) => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);



    const [itemsMasterData, setItemMasterData] = useState([]);

    const BASE_URL = selectedApi; // Keep it scoped within the component

    async function load_ItemMasterData() {
        // console.log('ItemMasterContext load function called !!!')
        if (BASE_URL !== '') {
            try {
                const url = `${BASE_URL}/item_master/load`;
                const apiResponse = await GET_Api(url, ''); // Await resolves the promise
                setItemMasterData(apiResponse); // Use the resolved data directly
            } catch (error) {
                console.error('Error loading item master data:', error);

            }
        }

    }


    useEffect(() => {

        load_ItemMasterData(); // Automatically load data when selectedApi changes

    }, []); // Dependency on selectedApi

    // console.log('itemsMasterData', itemsMasterData)

    // const value = {
    //     itemsMasterData,
    //     load_ItemMasterData
    // }

    return (
        <ItemMasterContext.Provider value={{ itemsMasterData, load_ItemMasterData }}>
            {children}
        </ItemMasterContext.Provider>
    );
}

export const useItemMasterContext = () => useContext(ItemMasterContext);


// export function ItemMasterContextFunction() {
//     // Custom hook for accessing context
//     return useContext(ItemMasterContext);
// }