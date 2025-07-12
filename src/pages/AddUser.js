import React, { useEffect, useState, useContext } from 'react';
import { useBaseUrl, Load_User_Service, Save_User_Service, Delete_User_Service } from '../services/AddUserService';
import { DataTableVIew } from '../components';
import { ApiContext } from '../context/ApiProvider';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";


// css 
const label_css = ' block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'block  border-1 rounded-sm border-gray-200  text-gray-900 text-sm  focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';


export const AddUser = () => {
    // ... start update API ....
    const { selectedApi } = useContext(ApiContext);
    useBaseUrl(selectedApi);

    const [activeTab, setActiveTab] = useState(1);
    const [isEdit, setIsEdit] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state

    const userData_initialValue = {
        username: '',
        password: '',
        confirm_password: '',
        role: ''
    }

    const [userData, setUserData] = useState(userData_initialValue);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((preve) => ({
            ...preve,
            [name]: value
        }))
    }

    // console.log('userData', userData)


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }



        setIsSubmitting(true); // Lock the form during submission

        // <Loader isLoading={isSubmitting} />



        try {

            if (userData.password.trim() === userData.confirm_password.trim()) {
                console.log('Password Match !!!');
                const result = await Save_User_Service(userData);

                if (result) {
                    setUserData(userData_initialValue);
                }

            } else {
                console.log('Password Dosnt Match !!!');
                return
            }

        } catch (error) {
            console.log('Error :', error)
        } finally {
            setIsSubmitting(false); // Unlock the form
        }


    }


    async function load_Data() {
        const output = await Load_User_Service();
        // console.log(output)
        setApiData(output);

    }

    useEffect(() => {
        if (activeTab === 1) {
            load_Data();
        }
    }, [activeTab])


    const handleEdit = (row) => {

    }

    const handleDelete = async (row) => {

        const result = await Delete_User_Service(row);
        if (result) {
            load_Data();
        }
    }




    // Define table columns
    const columns = [
        {
            name: 'user_id',
            selector: row => row.user_id,
            sortable: true
        },
        {
            name: 'UserName',
            selector: row => row.username,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row.role,
            sortable: true
        },

        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1'>

                    <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1 cursor-not-allowed' title='Edit' disabled><span><FaEdit /></span></button>
                    <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm ' title='Delete' ><RiDeleteBin2Line /></button>
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowoverflow: true, // Ensure the buttons are visible / allowOverflow
            button: true, // Makes it clear they are buttons
        }
    ];


    return (
        <> <div className="w-full mx-auto p-1">
            {/* Tab navigation */}
            <ul className="flex space-x-4 border-b-2 border-gray-200">
                <li className={`cursor-pointer p-2 ${activeTab === 1 ? 'text-blue-600 border-blue-600 border-b-2  bg-green-200 rounded-t-lg px-2' : ''}`}
                    onClick={() => setActiveTab(1)}>
                    ViewUser
                </li>
                <li className={`cursor-pointer p-2 ${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2 bg-green-200 rounded-t-lg px-2' : ''}`}
                    onClick={() => setActiveTab(2)}>
                    AddUser
                </li>
            </ul>

            {/* Tab content */}
            <div className="mt-4">
                {activeTab === 1 && (
                    <div className="p-4 bg-green-300 rounded-lg">
                        {/*  Content for Tab 1  */}
                        <DataTableVIew tbl_title={''} columns={columns} apiData={apiData} />
                    </div>
                )}
                {activeTab === 2 && (
                    <div className="p-4 bg-green-300 rounded-lg">
                        {/*  Content for Tab 2  */}

                        <form onSubmit={handleFormSubmit}>
                            <div className='border-2'>


                                <div className='border-2 bg-red-300 p-2'>
                                    <p>Add User</p>
                                </div>


                                <div className='mt-4 p-2'>
                                    <div>
                                        <label htmlFor='username' className={`${label_css}`}>User Name</label>
                                        <input type="text"
                                            id="username"
                                            name="username"
                                            onChange={handleChange}
                                            value={userData.username}
                                            required
                                            className={`${input_css} w-1/4`}
                                        />
                                    </div>

                                    <div className='mt-4'>
                                        <label htmlFor='password' className={`${label_css}`}>Password</label>
                                        <input type="password"
                                            id="password"
                                            name="password"
                                            onChange={handleChange}
                                            value={userData.password}
                                            required
                                            className={`${input_css} w-1/4`}
                                        />
                                    </div>
                                    <div className='mt-4 mb-4'>
                                        <label htmlFor='confirm_password' className={`${label_css}`}>Confirm Password</label>
                                        <input type="password"
                                            id="confirm_password"
                                            name="confirm_password"
                                            onChange={handleChange}
                                            value={userData.confirm_password}
                                            required
                                            className={`${input_css} w-1/4`}
                                        />
                                    </div>

                                    <div className="mt-4'">
                                        <label htmlFor="role" className='mr-3'>Role</label>
                                        <select className={`${input_css} w-1/4`} id="role" name="role" onChange={handleChange} value={userData.role} required>
                                            <option value="">- Select -</option>
                                            <option value="admin">admin</option>
                                            <option value="Engineer">Engineer</option>
                                            <option value="Staff">Staff</option>

                                        </select>
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className={`${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'}  ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} w-40  mt-4  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>

                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}
