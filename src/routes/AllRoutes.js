import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage, Login, AddUser, Customer, ItemMaster, SalesEntry, SalesPayment, PurchaseEntry, StockReport, SalesPrint, Expense, Quotation, QuotePrint, Business, EngStock, RMI, ServiceEntry, ServicePrint, DC, DC_Print,Page404 } from '../pages';


import { MainLayout } from '../components/MainLayout';
import { AuthLayout } from '../components/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import Logout from '../components/Logout';


export const AllRoutes = () => {



    return (
        <div>

            <Routes>
                {/* Wrap routes with the Layout to make SideNav persistent */}
                {/* <Route path="/" element={<Layout />} />
                <Route index element={<HomePage />} /> */}

                {/* Main Layout Routes */}

                <Route element={<MainLayout />}>
                    <Route element={<ProtectedRoute />}>

                        <Route path="/" element={<HomePage />} />

                        <Route path="/item_master" element={<ItemMaster />} />
                        <Route path="/purchase_entry" element={<PurchaseEntry />} />
                        <Route path="/sales_entry" element={<SalesEntry />} />
                        <Route path="/sales_payment" element={<SalesPayment />} />
                        <Route path="/stock_report" element={<StockReport />} />
                        <Route path="/sales_print" element={<SalesPrint />} />
                        <Route path="/expense" element={<Expense />} />
                        <Route path="/quotation" element={<Quotation />} />
                        <Route path="/quote_print" element={<QuotePrint />} />
                        <Route path="/business" element={<Business />} />
                        <Route path="/eng_stock" element={<EngStock />} />
                        <Route path="/rmi" element={<RMI />} />
                        <Route path="/add_user" element={<AddUser />} />
                        <Route path="/dc" element={<DC />} />
                        <Route path="/dc_print" element={<DC_Print />} />
                        <Route path="/customer" element={<Customer />} />



                        <Route path="/service" element={<ServiceEntry />} />
                        <Route path="/service_print" element={<ServicePrint />} />
                        {/* Add more main routes here */}
                    </Route>
                </Route>

                {/* Auth Layout Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path='/logout' element={<Logout />} />
                    {/* <Route path="/register" element={<RegisterPage />} /> */}
                    {/* Add more auth routes here */}
                </Route>



                {/* Catch-All Route for 404 */}

                <Route path='*' element={<Page404 />} />
            </Routes>

        </div>
    )
}
