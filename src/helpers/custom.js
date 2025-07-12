import { useState, useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';
import moment from 'moment';
import Swal from 'sweetalert2';



let BASE_URL = "";


export const Custom = () => {
    const { selectedApi } = useContext(ApiContext);
    BASE_URL = selectedApi;

    return null
}







// Hook to manage the BASE_URL
// export const useBaseUrl = () => {
//     const [baseUrl, setBaseUrl] = useState("");

//     const updateBaseUrl = (selectedApi) => {
//         console.log(selectedApi);
//         setBaseUrl(selectedApi);
//         // BASE_URL = selectedApi;
//     };

//     return { baseUrl, updateBaseUrl };
// };

// export function Set_BaseUrl(selectedApi) {
//     console.log('selectedApi', selectedApi)
//     // BASE_URL = selectedApi; //process.env.REACT_APP_BACKEND_BASE_URL
// }

export const Get_BaseUrl = () => {

    // console.log('Get_BaseUrl  is called !!!')

    // console.log('localStorage :', localStorage.getItem('selectedApi'))


    return localStorage.getItem('selectedApi'); //process.env.REACT_APP_BACKEND_BASE_URL
}


export const useGetBaseUrl = () => {
    const { selectedApi } = useContext(ApiContext);
    // return selectedApi;

    const getBaseUrl = () => {
        console.log(selectedApi);
        // Perform any processing if needed.
        return selectedApi;
    };

    return getBaseUrl;
}

export function date_strToObject(strDate) {
    const dateStr = strDate;
    const [day, month, year] = dateStr.split("-").map(Number); // Split the string and convert to numbers
    const dateObj = new Date(year, month - 1, day); // Month is zero-indexed in JS Date
    return dateObj;
}

export function date_strToFormat(strDate) {
    let objDate = date_strToObject(strDate);
    let localDate = moment(objDate).format('DD-MM-YYYY');

    return localDate;
}

export function date_objToFormat(objDate) {
    let localDate = moment(objDate).format('DD-MM-YYYY');

    return localDate;
}


export function SweetAlert_Delete() {
    return Swal.fire({
        title: 'Delete Data !, Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete !'
    }).then(async (result) => {
        if (result.isConfirmed) {
            // console.log('confirmed', 'ok');
            return true;

        } else if (result.isDismissed) {
            console.log('dismiss', 'yes')
            return false;
        }
    })
}

export function MoneyFormat(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal', // Format as a regular number
        minimumFractionDigits: 2, // Optional: Ensures 2 decimal places
        maximumFractionDigits: 2,
    });

    return (formatter.format(amount)); // Output: "1,234,567.89"
}


