import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { PurchaseProvider } from './context/purchaseContext';
import { SalesProvider } from './context/salesContext';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './context/ApiProvider';
import { ItemMasterProvider } from './context/ItemMasterContext';
import { DateRangeProvider } from './context/DateRangeContext';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <DateRangeProvider>
        <ApiProvider> {/* ApiProvider must wrap ItemMasterProvider */}
          <AuthProvider>
            <ItemMasterProvider>
              <SalesProvider>
                <PurchaseProvider>
                  <App />
                </PurchaseProvider>
              </SalesProvider>
            </ItemMasterProvider>
          </AuthProvider>
        </ApiProvider>
      </DateRangeProvider>
    </Router>
  </React.StrictMode>
);


