import React, { useEffect, useState, useContext } from 'react';

import { useTitle } from '../hooks/useTitle';
import { ModalConfirm, ReactDateRangePicker, BarChart } from '../components';
import {
  useBaseUrl,
  Get_TotalExpense_Service,
  Get_TotalSales_Service,
  Get_TotalPurchase_Service,
  Get_Purchase_MonthWiseData_Service,
  Get_Expense_MonthWiseData_Service,
  Get_Sales_MonthWiseData_Service
} from '../services/HomeService';

import { ApiContext } from '../context/ApiProvider';

import { Get_BaseUrl, MoneyFormat } from '../helpers/custom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaCashRegister } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdCash } from "react-icons/io";

// const BASE_URL = Get_BaseUrl();

export const HomePage = () => {
  // ... start update API ....
  const { selectedApi } = useContext(ApiContext);
  // const { baseUrl: BASE_URL, updateBaseUrl } = useBaseUrl();
  // updateBaseUrl(selectedApi);
  // ... End update API ....

  useBaseUrl(selectedApi);

  const [dateRangeNow, setDateRangeNow] = useState({});

  useTitle('Home'); // set Title

  const [totalExpense, setTotalExpense] = useState(0);
  const [purchase, setPurchase] = useState({});
  const [sales, setSales] = useState({});
  const [purchaseMonthData, setPurchaseMonthData] = useState([]);
  const [expenseMonthData, setExpenseMonthData] = useState([]);
  const [salesMonthData, setSalesMonthData] = useState([]);


  // useEffect(() => {
  //   updateBaseUrl(selectedApi);
  // }, [selectedApi]);




  useEffect(() => {
    async function load_Data() {


      if (Object.keys(dateRangeNow).length !== 0) {
        const Expense_Output = await Get_TotalExpense_Service(dateRangeNow);
        // console.log(Expense_Output[0])
        setTotalExpense(Expense_Output[0].total);


        const Sales_Output = await Get_TotalSales_Service(dateRangeNow)
        // console.log(Sales_Output[0])
        setSales(Sales_Output[0]);

        const Purchase_Output = await Get_TotalPurchase_Service(dateRangeNow)
        setPurchase(Purchase_Output[0]);


        const purchase_MonthData = await Get_Purchase_MonthWiseData_Service();
        // console.log(purchaseMonthData)
        setPurchaseMonthData(purchase_MonthData);

        const expense_MonthData = await Get_Expense_MonthWiseData_Service();
        setExpenseMonthData(expense_MonthData);

        const sales_MonthData = await Get_Sales_MonthWiseData_Service();
        setSalesMonthData(sales_MonthData);

      }
    }

    load_Data()

  }, [dateRangeNow])

  // console.log('totalExpense', totalExpense)
  // console.log('dateRangeNow', dateRangeNow)
  // console.log('purchaseMonthData', purchaseMonthData)

  const handleClick = () => {

    Swal.fire({
      title: 'Delete Data !, Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete !'
    }).then(async (result) => {
      if (result.isConfirmed) {

        console.log('confirmed', 'ok')
      } else if (result.isDismissed) {
        console.log('dismiss', 'yes')
      }


    })


    // ------------------

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Duplicate Invoice Number...!!!',
      footer: 'Invoice Number Already Saved'
    })
  }








  return (
    <>
      <div className='border-2'>

        <div className='text-center bg-yellow-200 p-2 mb-4'>
          <span className='text-black font-semibold text-xl'>Home - DashBoard</span>
        </div>





        {/* <button onClick={handleClick} data-modal-target="popup-modal" data-modal-toggle="popup-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Toggle modal
      </button>

      <ModalConfirm /> */}

        <div className='flex  p-3'>

          <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
        </div>

        <div className="grid grid-rows-1 grid-flow-col gap-4 p-3">
          {/* Start Sales Div */}
          <div className='flex bg-white border-2 p-3 rounded-md '>
            <span className='bg-green-500 p-3 items-center rounded-sm px-4'>
              <FaCashRegister className='mt-8 text-white' size='2em' />
            </span>
            <div className=" flex flex-col ml-3 w-full mt-8">
              <span className="font-bold">Sales</span>
              <span className="info-box-number" id="txt_SalesCount" name="txt_SalesCount"><i className="fas fa-rupee-sign"></i> {MoneyFormat(sales.Total || 0)}</span>
            </div>
            <ul className="">
              <li className="flex flex-col">

                <span className="info-box-text">Received</span>
                <span className="bg-blue-600 px-2 py-1 rounded-md text-white" id="txt_SalesRecived" name="txt_SalesRecived"><i className="fas fa-rupee-sign"></i> {MoneyFormat(sales.Paid || 0)}</span>

              </li>
              <li className="flex flex-col mt-2">


                <span className="info-box-text">Balance</span>
                <span className="bg-red-600 px-2 py-1 rounded-md text-white" id="txt_SalesBalance" name="txt_SalesBalance"><i className="fas fa-rupee-sign"></i> {MoneyFormat(sales.Balance || 0)}</span>

              </li>
            </ul>


          </div>  {/* End Sales Div */}

          {/* Start Purchase Div */}
          <div className='flex bg-white border-2 p-3 rounded-md '>
            <span className=' p-3 items-center rounded-sm px-4' style={{ backgroundColor: '#17a2b8' }}>
              <FaShoppingCart className='mt-8 text-white' size='2em' />
            </span>
            <div className=" flex flex-col ml-3 w-full mt-8">
              <span className="font-bold">Purchase</span>
              <span className="info-box-number" id="txt_SalesCount" name="txt_SalesCount"><i className="fas fa-rupee-sign"></i> {MoneyFormat(purchase.Total || 0)}</span>
            </div>
            <ul className="">
              <li className="flex flex-col">

                <span className="info-box-text">Paid</span>
                <span className="bg-blue-600 px-2 py-1 rounded-md text-white" id="txt_SalesRecived" name="txt_SalesRecived"><i className="fas fa-rupee-sign"></i> {MoneyFormat(purchase.Paid || 0)}</span>

              </li>
              <li className="flex flex-col mt-2">


                <span className="info-box-text">Balance</span>
                <span className="bg-red-600 px-2 py-1 rounded-md text-white" id="txt_SalesBalance" name="txt_SalesBalance"><i className="fas fa-rupee-sign"></i> {MoneyFormat(purchase.Balance || 0)}</span>

              </li>
            </ul>
          </div>  {/* End Purchase Div */}

          {/* Start Expense Div */}
          <div className='flex bg-white border-2 p-3 rounded-md '>
            <span className=' p-3 items-center rounded-sm px-4' style={{ backgroundColor: '#dc3545' }}>
              <IoMdCash className='mt-8 text-white' size='2em' />
            </span>
            <div className=" flex flex-col ml-3 w-full mt-8">
              <span className="font-bold">Expense</span>
              <span className="info-box-number" id="txt_SalesCount" name="txt_SalesCount"><i className="fas fa-rupee-sign"></i> {MoneyFormat(totalExpense || 0)}</span>
            </div>

          </div>  {/* End Expense Div */}


        </div>

        {/* chart */}

        <div className="w-full   bg-white rounded-lg shadow dark:bg-gray-800  p-3    " >
          <div className=" mt-4 mb-4  border-2  rounded-md card-info p-3">
            <div className="bg-blue-400 p-3 text-white ">Monthly View</div>
            <div className='w-1/2' >
              <BarChart
                data1={purchaseMonthData}
                data2={expenseMonthData}
                data3={salesMonthData}
              />
            </div>

          </div>
        </div>




      </div>


    </>
  )
}
