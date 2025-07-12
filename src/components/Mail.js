import React, { useEffect, useState, useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';
import { useBaseUrl, MailSend_Service, Get_CustomerById_Service } from '../services/MailService';
import { RxCross2 } from "react-icons/rx";

export const Mail = ({ showMail, setShowMail, selectedQuote, setSelectedQuote }) => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);

    const form_InitialValue = {
        to: '',
        subject: 'Reg:- Quotation',
        text: 'Dear Sir, Please find the attached Quotation',
        cc: '',
        bcc: '',
    }
    const [formData, setFormData] = useState(form_InitialValue);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');


    useEffect(() => {

        const getCustomer = async () => {
            if (selectedQuote !== "" && selectedQuote.Cust_id) {
                const custData = await Get_CustomerById_Service(selectedQuote.Cust_id);
                console.log('custData :', custData[0].Email)
                setFormData({ ...formData, to: custData[0].Email });
            }
        }

        getCustomer();

    }, [selectedQuote])

    console.log('selectedQuote :', selectedQuote)
    console.log('formData :', formData)


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    // file attachment
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // button click
    const handleSendEmail = async () => {
        const data = new FormData();
        data.append('to', formData.to);
        data.append('subject', formData.subject);
        data.append('text', formData.text);
        data.append('html', `<p>${formData.text}</p>`); // Simple HTML fallback
        data.append('cc', formData.cc);
        data.append('bcc', formData.bcc);

        if (file) {
            data.append('attachment', file);
        }



        try {

            setStatus('📧 Mail Sending..!');

            const result = await MailSend_Service(data);
            console.log('result :', result);

            if (result) {
                setStatus(result);

            }

            // else {
            //     setStatus(`❌ Failed to send email: ${result.error}`);
            //     console.error(result);
            // }
        } catch (err) {
            setStatus(`❌ Error: ${err.message}`);
            console.error(err);
        }

    }

    return (
        <>
            <div className="max-w-md z-50 fixed top-20 right-0 left-0 p-4 mx-auto bg-white shadow-lg rounded-lg">
                <div className='flex items-start justify-between '>
                    <div>
                        <h2 className="text-xl font-bold mb-4">Email with Attachment</h2>
                    </div>
                    <div>
                        <button onClick={() => setShowMail(false)} className='  p-2'><RxCross2 /></button>
                    </div>

                </div>

                <label htmlFor='to'>To:</label>
                <input
                    type="email"
                    name="to"
                    placeholder="someone@domine.com"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={handleChange}
                    value={formData.to}
                />
                <label htmlFor='Subject'>Subject:</label>
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={handleChange}
                    value={formData.subject}
                />
                <label htmlFor='text'>Email Body</label>
                <textarea
                    name="text"
                    placeholder="Email Body"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={handleChange}
                    value={formData.text}
                />
                <label htmlFor='CC'>CC:</label>
                <input
                    type="email"
                    name="cc"
                    placeholder="someone@domine.com"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={handleChange}
                    value={formData.cc}
                />

                <label htmlFor='BCC'>BCC:</label>
                <input
                    type="email"
                    name="bcc"
                    placeholder="someone@domine.com"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={handleChange}
                    value={formData.bcc}
                />

                <input
                    type="file"
                    className="mb-2"
                    onChange={handleFileChange}
                />

                <button
                    onClick={handleSendEmail}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Send Email
                </button>

                {status && <p className="mt-2 text-sm">{status}</p>}
            </div>
        </>
    )
}

