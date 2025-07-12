import React, { useContext } from 'react'
import { ApiContext } from '../context/ApiProvider';


export const GetBaseURL = () => {
    const { selectedApi } = useContext(ApiContext);

    // useEffect(() => {
    //     document.title = `${title}  - Stock App`;
    // }, [title]);

    return selectedApi;
    
}
