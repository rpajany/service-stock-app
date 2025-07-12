import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiContext } from '../context/ApiProvider';
// import { Get_BaseUrl } from '../helpers/custom';
import { GetBaseURL } from '../helpers/GetBaseURL';
import { POST_Api, GET_Api, DELETE_Api } from '../services/ApiService';


import Logo from '../assest/logo.jpg';
import profile_default from '../assest/default-user.png'
import './SideNav.css'; // Create a separate CSS file for styling
import { TbPackages } from "react-icons/tb";



// Sample icons (you can use any icon library like FontAwesome or Material Icons)
const HomeIcon = () => <span className="icon">🏠</span>;
const SettingsIcon = () => <span className="icon">💠</span>;
const ProfileIcon = () => <span className="icon">👤</span>;
const BusinessIcon = () => <span className="icon">📮</span>;
const Purchase = () => <span className="icon">🛒</span>;
const Quotation = () => <span className="icon">📄</span>;
const Sales = () => <span className="icon">🗳</span>;
const SalesPay = () => <span className="icon">💵</span>;
const Expense = () => <span className="icon">💳</span>;
const Service = () => <span className="icon">🧰</span>;
const RMI = () => <span className="icon">💫</span>;
const EngStock = () => <span className="icon">🛄</span>;
const MainStoreReport = () => <span className="icon">🧾</span>;
const DC = () => <span className="icon">📑</span>;
const Customer = () => <span className="icon">🧞‍♂️</span>;

// const BASE_URL = GetBaseURL();// Get_BaseUrl();

export const Header = () => {
    // ... start update API ....
    const { selectedApi: BASE_URL } = useContext(ApiContext);
    // const { baseUrl: BASE_URL, updateBaseUrl } = useBaseUrl();
    // updateBaseUrl(selectedApi);
    // ... End update API ....
    // const BASE_URL = GetBaseURL();


    // const { selectedApi, setSelectedApi } = useContext(ApiContext);
    const { authData, setAuthData } = useAuth();


    // console.log('authData', authData)
    // Check if user is not null and destructure
    // if (authData) {
    //     const { role, username } = authData;
    //     // console.log('role', role)
    // }

    // console.log('BASE_URL', BASE_URL)


    const [menuDisplay, setMenuDisplay] = useState(false) // menu dropdown
    const [isHovered, setIsHovered] = useState(false);

    // const apiOptions = [
    //     { label: "Magnanum System", value: process.env.REACT_APP_BACKEND1_BASE_URL },
    //     { label: "Canon", value: process.env.REACT_APP_BACKEND2_BASE_URL },
    // ];


    //const [selectedApi, setSelectedApi] = useState(apiOptions[0].value); // State for selected API



    // const [data, setData] = useState([]); // State for fetched data
    // console.log('selectedApi', selectedApi)

    // useEffect(() => {

    //     if (selectedApi) {
    //         const fetchData = async () => {
    //             try {
    //                 const response = await fetch(selectedApi);
    //                 const result = await response.json();
    //                 setData(result);
    //             } catch (error) {
    //                 console.error("Error fetching data:", error);
    //             }
    //         };
    //         fetchData();
    //     }

    // }, [selectedApi])



    // console.log(data)


    useEffect(() => {


        async function Get_userAuthData() {

            const url_UserAuth = BASE_URL + `/user/user_details`;
            const res = await GET_Api(url_UserAuth, '');
            // console.log('res', res)
            if (res) {
                // console.log('user_data', res)
                // return res[0]
                setAuthData(res);
            }


        }

        if (!authData) {
            // Get_userAuthData();
        }





    }, [setAuthData]);


    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (

        <header className='header'>
            <nav className='h-14 py-2 px-4 shadow-sm bg-gray-400  text-white fixed w-full z-40  dark:text-white dark:bg-gray-900 '>
                <div className='max-w-full flex flex-wrap justify-between' > {/* max-w-screen-xl */}
                    <Link to='/' className='flex items-center space-x-3 whitespace-nowrap'>
                        <img src={Logo} className='h-10 w-10 rounded-full' alt="brand-logo" />
                        <span>{authData && authData.Company}</span>
                        {/* <select id="company" name="comapany" value={selectedApi} onChange={(e) => setSelectedApi(e.target.value)} className='bg-gray-400 border-0 text-white'>
                            {apiOptions.map((api) => (
                                <option key={api.value} value={api.value} >{api.label}</option>
                            ))}
                        </select> */}

                    </Link>

                    <div className='flex items-center'>
                        <span className='mr-2'>{authData && authData.username}</span>
                        <div onClick={() => setMenuDisplay(!menuDisplay)} className='relative focus:ring-4   focus:ring-red-300 dark:focus:ring-gray-600 cursor-pointer   '>
                            <img src={profile_default} className='w-8 h-8 border-2 rounded-full ' alt='user-profile' />
                            {menuDisplay && (
                                <div className='absolute  w-40 h-fit top-11 right-5 bg-white border-2 shadow-md rounded p-4  '>
                                    {/* <Link to='/Profile' className='text-black hover:text-slate-500 hover:font-bold'>Profile</Link> */}
                                    {/* <hr></hr> */}
                                    {/* <Link to='/Profile' className='text-black hover:text-slate-500 hover:font-bold'>Password</Link> */}
                                    <hr className='mb-2'></hr>
                                    <Link to='/logout' className='text-black hover:text-slate-500 hover:font-bold'>Logout</Link>
                                </div>
                            )}

                        </div>

                    </div>
                </div>


            </nav>


            {/* Drawer */}

            <div className='sidebar fixed   top-15  left-0 w-16 h-lvh  border-r-2 z-30 '>
                <div
                    className={`sidenav ${isHovered ? 'expanded' : ''}`}
                    onMouseDownCapture={handleMouseEnter}
                    // onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ paddingTop: '60px' }}

                >
                    {authData && authData['role'] === 'admin' ?
                        <ul>
                            {/* Use the Link component to create links to different pages */}
                            <li>
                                <Link to="/">
                                    <HomeIcon />
                                    {isHovered && <span className="nav-text">Home</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/business">
                                    <BusinessIcon />
                                    {isHovered && <span className="nav-text">Business</span>}
                                </Link>
                            </li>

                            <li>
                                <Link to="/customer">
                                    <Customer />
                                    {isHovered && <span className="nav-text">Customer</span>}
                                </Link>
                            </li>

                            <li>
                                <Link to="/item_master">
                                    <SettingsIcon />
                                    {isHovered && <span className="nav-text">Item Master</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/quotation">
                                    <Quotation />
                                    {isHovered && <span className="nav-text">Quotation</span>}
                                </Link>
                            </li>

                            <li>
                                <Link to="/purchase_entry">
                                    <Purchase />
                                    {isHovered && <span className="nav-text">Purchase</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/sales_entry">
                                    <Sales />
                                    {isHovered && <span className="nav-text">Sales</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/dc">
                                    <DC />
                                    {isHovered && <span className="nav-text">DC</span>}
                                </Link>
                            </li>
                            {/* <li>
                                <Link to="/sales_payment">
                                    <SalesPay />
                                    {isHovered && <span className="nav-text">SalesPayment</span>}
                                </Link>
                            </li> */}
                            <li>
                                <Link to="/stock_report">
                                    <MainStoreReport />
                                    {isHovered && <span className="nav-text">MainStore_Report</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/eng_stock">
                                    <EngStock />
                                    {isHovered && <span className="nav-text">Eng Stock</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/rmi">
                                    <RMI />
                                    {isHovered && <span className="nav-text">RMI</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/expense">
                                    <Expense />
                                    {isHovered && <span className="nav-text">Expense</span>}
                                </Link>
                            </li>

                            <li>
                                <Link to="/service">
                                    <Service />
                                    {isHovered && <span className="nav-text">Service</span>}
                                </Link>
                            </li>


                            {/* {authData && authData['role'] === 'admin' ? */}
                            <li>
                                <Link to="/add_user">
                                    <ProfileIcon />
                                    {isHovered && <span className="nav-text">Add_User</span>}
                                </Link>
                            </li>
                            {/* : '' */}
                            {/* } */}
                        </ul> : ''
                    }

                    {authData && authData['role'] === 'Engineer' ?
                        <ul>
                            <li>
                                <Link to="/">
                                    <HomeIcon />
                                    {isHovered && <span className="nav-text">Home</span>}
                                </Link>
                            </li>

                            <li>
                                <Link to="/service">
                                    <SettingsIcon />
                                    {isHovered && <span className="nav-text">Service</span>}
                                </Link>
                            </li>
                        </ul>
                        : ""
                    }





                </div>
            </div>




        </header>



    )
}
