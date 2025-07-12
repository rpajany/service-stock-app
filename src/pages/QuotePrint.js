import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Get_BaseUrl,
  date_strToObject,
  date_objToFormat,
} from "../helpers/custom";
import { ApiContext } from "../context/ApiProvider";
import { ToWords } from "to-words";
import { GET_Api } from "../services/ApiService";
import Logo from "../assest/logo.jpg";
import Magnanim_Sign from "../assest/Magnanim_Sign.PNG";
import GLobal_Sign from "../assest/GLobal_Sign.PNG";

// const BASE_URL = Get_BaseUrl();
let BASE_URL = "";

export const QuotePrint = () => {
  // ... start update API ....
  const { selectedApi } = useContext(ApiContext);
  BASE_URL = selectedApi;

  const { state } = useLocation();
  const [quoteDetails, setQuoteDetails] = useState(state);

  const business_initialState = {
    Business: "",
    Contact: "",
    Address: "",
    Email: "",
    Website: "",
    Mobile: "",
    Landline: "",
    City: "",
    State: "",
    Zip: "",
    Country: "",
    GSTIN: "",
    BankName: "",
    Branch: "",
    AccountNumber: "",
    IFSC_Code: "",
    MICR_Code: "",
    Brand_Logo: "",
  };

  const [businessData, setBusinessData] = useState(business_initialState);

  const [quoteData, setQuoteData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [print, setPrint] = useState(false);

  let rowID = 0;

//   console.log("customerData :", customerData);

  // get business data
  async function Get_BusinessData() {
    try {
      const url_business = BASE_URL + `/business/get_business`;
      const req_0 = await GET_Api(url_business, "");
      // console.log('1. Get Business Details : ', req_0);
      setBusinessData(req_0[0]);
    } catch (error) {
      console.log("Error Get Business Details : ", error);
    }
  }

  // get quote items ....
  async function Get_QuoteData() {
    try {
      const url_Quote =
        BASE_URL + `/quotation/get_quotation/${quoteDetails.Quot_Number}`;
      const req_1 = await GET_Api(url_Quote, "");
      // console.log('2. Get sales Items : ', req_1);
      setQuoteData(req_1);
    } catch (error) {
      console.log("Error Get_QuoteData : ", error);
    }
  }

  // get customer data
  async function Get_CustomerData() {
    try {
      const url_Customer =
        BASE_URL + `/customer/get_customer/${quoteDetails.Cust_id}`;
      const req_1 = await GET_Api(url_Customer, "");
    //   console.log("3. Get_CustomerData : ", req_1[0]);

      setCustomerData(req_1[0]);
    } catch (error) {
      console.log("Error Get_CustomerData : ", error);
    }
  }

  useEffect(() => {
    const getData = async () => {
      await Get_BusinessData();
      await Get_QuoteData();
      await Get_CustomerData();
      setPrint(true);
    };
    getData();
  }, []);

  useEffect(() => {
    if (print)
      setTimeout(() => {
        window.print();
      }, 1500);
  }, [print]);

  return (
    <div style={{ fontSize: "11px" }}>
      <div
        className="flex flex-col items-center"
        style={{ textAlign: "center" }}
      >
        <div className="flex   align-middle">
          {/* <img src={businessData.Brand_Logo} style={{ height: '50px', width: '50px' }} className="rounded-full mr-2" alt="logo" /> */}
          <h5
            className="text-2xl font-bold"
            style={{ font: "ElGar", fontFamily: "ElGar" }}
          >
            {businessData.Business}{" "}
          </h5>
        </div>

        <span style={{ fontSize: "15px" }}>
          {businessData.Address}, {businessData.City},{businessData.State} -{" "}
          {businessData.Zip}.
        </span>
        {/* <span style={{ fontSize: '15px' }}> </span>
                    <span style={{ fontSize: '15px' }}></span><br></br> */}
        <span style={{ fontSize: "15px" }}>
          Phone: {businessData.Mobile}, {businessData.Landline},{" "}
          {businessData.Email},{" "}
          {businessData.Website ? "Website: " + businessData.Website : null}
        </span>
        {/* <span style={{ fontSize: '15px' }}> </span> */}
      </div>
      <hr></hr>

      <div className="gap-8 columns-3 mt-2">
        <div className="col-sm-4 px-0">
          <span>
            {"Quotation No."}
            <b>{quoteDetails.Quot_Number}</b>
          </span>
          <br></br>
          <span>
            {"Date : "} {quoteDetails.Date}
          </span>
          {/* <span>{'Ref. No.:'} Your enquiry Dt.</span> */}
        </div>
        <div className="col-sm-4">
          <p
            style={{
              textAlign: "center",
              marginBottom: "2px",
              fontSize: "25px",
              textDecoration: "underline",
            }}
          >
            <b>QUOTATION</b>
          </p>
        </div>
        <div className="col-sm-4">
          {/* <span>{'Date : '} {quoteDetails.Date}</span><br></br> */}
          <span>
            {"GSTIN : "}
            {businessData.GSTIN}
          </span>
          <br></br>
          <span>
            {"MSME : "}
            {businessData.MSME}
          </span>
        </div>
      </div>

      <div className="flex mt-2">
        <div className="w-80 ">
          <span>To:</span>
          <br></br>
          <span>{customerData.Customer_Name}</span>
          <br></br>
          <span>
            {customerData.Address}, {customerData.State}
          </span>
          <br></br>

          <span>{customerData.Mobile}</span>
          <br></br>
          <span>GSTIN : {customerData.GSTIN}</span>
          <br></br>
          <br></br>
        </div>

        <div className="w-1/2 ">
          <span>Ref :- </span>
          <br></br>
          <span>Model : {quoteDetails.Model}</span>
          <br></br>
          <span>Serial : {quoteDetails.Serial}</span>
          <br></br>
          <span>Job_No : {quoteDetails.Job_No}</span>
        </div>
      </div>
      <span>
        <b>Kind Attn : </b> Ms. {quoteDetails.Contact}
      </span>

      <p className="italic">
        With reference to your enquiry and we are Pleasure to quote the best
        price for the below Item.
      </p>

      <div className=" px-3" style={{ marginTop: "15px" }}>
        <table className="tbl_salesItem w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs border-b-2 border-t-2   text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-2 py-1">
                #
              </th>
              <th scope="col" className="px-2 py-1">
                Description
              </th>
              <th scope="col" className="px-2 py-1">
                HSN Code
              </th>
              <th scope="col" className="px-2 py-1">
                Qty
              </th>
              <th scope="col" className="px-2 py-1">
                Rate
              </th>
              <th
                scope="col"
                className="px-2 py-1"
                style={{ textAlign: "center" }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {quoteData &&
              quoteData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b-2 bg-white  dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-2 py-1">{index + 1}</td>
                  <td className="px-2 py-1">{item.Description}</td>
                  <td className="px-2 py-1">{item.HSN_Code}</td>
                  <td className="px-2 py-1">{item.Qty}</td>
                  <td className="px-2 py-1">{item.Rate.toFixed(2)}</td>
                  <td
                    className="px-2 py-1"
                    style={{ textAlign: "center", paddingRight: "0px " }}
                  >
                    {item.Amount.toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>

          <tfooter></tfooter>
        </table>
      </div>

      {/* <div className='flex flex-row'>
                <p>Taxable Amount : {quoteDetails.Taxable_Amount.toFixed(2) }</p>
                <p>Tax ({quoteDetails.Tax_Perc} %) : {quoteDetails.TaxAmount.toFixed(2) }</p>
                <p>Total : {quoteDetails.Total.toFixed(2) }</p>
            </div> */}

      <div className="grid grid-cols-3 gap-12 mt-2">
        <div className="cols"></div>
        <div className="cols"></div>
        <div>
          <table className="text-sm">
            <tr className="">
              <td className=" ">Taxable Amount : </td>
              <td className="ml-8 float-right">
                {quoteDetails.Taxable_Amount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td> Tax ({quoteDetails.Tax_Perc} %) : </td>
              <td className="float-right">
                {quoteDetails.TaxAmount.toFixed(2)}
              </td>
            </tr>

            <tr className="border-t-2 border-b-2">
              <td>
                <b>Total :</b>{" "}
              </td>
              <td className="float-right">{quoteDetails.Total.toFixed(2)}</td>
            </tr>
          </table>
        </div>
      </div>

      {quoteDetails.Not_InScope !== "" && (
        <div className="mb-2 font-thin text-sm">
          <p className="mt-3 " style={{ textDecoration: "underline" }}>
            <u>
              <b>NOT IN SCOPE:</b>
            </u>
          </p>

          <p>*{quoteDetails.Not_InScope}</p>
        </div>
      )}

      <div className="mb-2 font-thin " style={{ fontSize: "10px" }}>
        <p className="">
          <b>
            <u>The Engineer Repair fees consists of :</u>
          </b>
        </p>
        <p>
          1. On site or customer directly get the product to the shop our
          engineer will examine the product.
        </p>
        <p>2. Testing and identifying issues with the product.</p>
        <p>3. Giving a quote for repair/spare parts</p>
      </div>

      <div className="mb-2 font-thin" style={{ fontSize: "10px" }}>
        <p className="">
          <b>
            <u>Chargeable Call Terms & Conditions :</u>
          </b>
        </p>
        <p>
          You have to pay the charges when the Date of engineer examine the
          product on hand or Gpay. If we sort out the issue without changing any
          spares you will pay service charge or if problem not solve you have to
          pay Rs.300/- as visiting charges. Visiting charges are non refundable
        </p>
      </div>

      <div className="mb-2 font-thin " style={{ fontSize: "10px" }}>
        <p>
          <b>
            <u>Terms and Condition :</u>
          </b>
        </p>
        <p>
          <b>Taxes : </b>
          {quoteDetails.Tax_Terms}
        </p>
        <p>
          <b>Payment : </b>
          {quoteDetails.Payment_Terms}
        </p>
        <p>
          <b>BankDetails : </b> Bank : {businessData.BankName}, Branch :{" "}
          {businessData.Branch}, A/C : {businessData.AccountNumber},IFSC :{" "}
          {businessData.IFSC_Code}, MICR : {businessData.MICR_Code}{" "}
        </p>
        <p>
          <b>Validity : </b>
          {quoteDetails.Validity_Terms}
        </p>
        <p>
          <b>Delivery : </b> {quoteDetails.Delivery_Terms}
        </p>
      </div>

      {/* 
            <div className='mt-1 italic'>
                <p>Trust our offer is in line with your requirement and looking forward to the pleasure of receiving your valued purchase order at anearly date.Thanking you and assuring you of our best services always.</p>
            </div> */}

      <div className="mt-1">
        <p>Thanking You,</p>
        <p>for {businessData.Business}</p>
        <br></br>
        {/* <p>{businessData.Contact}</p>
                <p>{businessData.Mobile}</p> */}

        {businessData.Business === "Magnanim Systems" ? (
          <img src={Magnanim_Sign} alt="sign" h="" w="" />
        ) : businessData.Business === "Global Systems" ? (
          <img src={GLobal_Sign} alt="sign" h="" w="" />
        ) : (
          ""
        )}

        <p>
          <b>Authorized Signature</b>
        </p>
      </div>
    </div>
  );
};
