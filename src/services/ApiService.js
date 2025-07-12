import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export async function POST_Api(url, token = '', data) {
    // console.log('Post Data :', data)
    try {

        let options = {
            method: 'POST',
            credentials: 'include',
            headers: {},
            body: null,
        };

        if (data instanceof FormData) {
            options.body = data;
            // ❌ Don't set Content-Type — the browser will do it with the boundary
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        const dataResponse = await fetch(url, options);

        const dataApi = await dataResponse.json(); // convert to json

        // console.log('Api message', dataApi.success);

        if (dataApi.success) {  // on success     

            // toast.success(dataApi.message);
            return dataApi.data; // correct method return dataApi; // instead of dataApi.data // Optional: Return full response instead of only .data
        }

        if (dataApi.error) {  // on error
            console.log(dataApi.message)
            toast.error(dataApi.message);
            return dataApi.message;
        }

    } catch (error) {
        console.log('Error :', error)
        toast.error(error.message)
    }
}

// export async function GET_Api(url, token = '', setApiData) {
export async function GET_Api(url, token = '') {
    // console.log('APIService GET_Api url :', url);
    try {

        const dataResponse = await fetch(url, {
            method: 'get',
            credentials: 'include',  // add token to client browser
            headers: { "content-Type": "application/json" }
        });

        const dataApi = await dataResponse.json();  // convert to json

        if (dataApi.success) {  // on success  
            // setApiData(dataApi.data);
            return (dataApi.data);
        }

        if (dataApi.error) {  // on error
            console.log(dataApi.message)
            toast.error(dataApi.message)
        }

    } catch (error) {
        console.log('Error :', error)
        toast.error(error.message)
    }
}

export async function DELETE_Api(url, token, data) {
    try {

        const dataResponse = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',  // add token to client browser
            headers: { "content-Type": "application/json" }
        });

        const dataApi = await dataResponse.json();  // convert to json

        if (dataApi.success) {  // on success  
            return true;
        }

        if (dataApi.error) {  // on error
            console.log(dataApi.message)
            toast.error(dataApi.message)
            return false;
        }

    } catch (error) {
        console.log('Error :', error)
        toast.error(error.message)
    }
}

export async function insert_Api(requestData) {
    try {
        const response = await fetch('http://localhost:8080/api/sales/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) { // on error
            const errorData = await response.json();
            throw new Error('Error: ' + errorData.message || response.status);
        }

        const data = await response.json();
        return data; // Return the response data if successful

    } catch (error) {
        console.error('Error:', error.message);
        throw error; // Propagate the error to the caller if needed
    }
}

// example call function above
const requestData = {
    Discount_Amount: 2,
    Discount_Percent: 1,
    Invoice_Date: '2024-10-19',
    Invoice_Number: '3',
    Item_Name: 'FAN',
    PartNumber: '101-1234567',
    Qty: 1,
    Sale_Price: 200,
    Tax_Amount: 35.64,
    Tax_Percent: 18,
    Total: 235.64
};

try {
    // const result = await insert_Api(requestData);
    //console.log('Insert successful:', result); // Handle success
} catch (error) {
    console.error('Insert failed:', error.message); // Handle error
}
