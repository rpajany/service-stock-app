import React, { useState } from 'react'
import Default_BrandLogo from '../assest/Default.png';

export const FileUpload = ({ handelFileUpload, filePreview, setFilePreview, setImageBase64 }) => {
    const [uploadFile, setUploadFile] = useState('');
    // const [filePreview, setFilePreview] = useState();
    const [errorMessage, setErrorMessage] = useState("");

    // Set a size limit (e.g., 2 MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSizeInMB = file.size / (1024 * 1024);
            console.log('File Size in Mbytes :', fileSizeInMB);

            if (file.size > MAX_FILE_SIZE) {
                // File is too large
                setErrorMessage("Error: File size exceeds 2 MB. Please upload a smaller file.");
                setImageBase64("");
                return;
            }

            setErrorMessage(""); // Clear any previous error message
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result); // Base64 string
            };
            reader.readAsDataURL(file); // This will trigger onloadend with a Base64 string


        }
        setUploadFile(e.target.files[0]); // set file
        handelFileUpload(e.target.files[0], e.target.files[0].name); // send file to upload
        setFilePreview('');
        setFilePreview(URL.createObjectURL(e.target.files[0]));

    }

    return (
        <div>
            <p>fileUpload</p>

            <div className=''>
                <img src={filePreview ? filePreview : Default_BrandLogo} width="300" height="300" alt="Preview" className='border-2' />
                <input
                    type="file"
                    id=""
                    name=""
                    accept="image/*"
                    onChange={handleChange} />
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>

        </div>
    )
}
