import { createContext, useState, useContext } from "react";

// Create the context
export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const [selectedApi, setSelectedApi] = useState(""); // Tracks selected API




    
    return (
        <ApiContext.Provider
            value={{ selectedApi, setSelectedApi}}
        >
            {children}
        </ApiContext.Provider>
    );

}

export function ApiContextFunction() {
    // Custom hook for accessing context
    return useContext(ApiContext);
}