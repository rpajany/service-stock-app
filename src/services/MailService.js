import { POST_Api, GET_Api } from '../services/ApiService';
let BASE_URL = "";

export const MailService = () => {
  return (
    null
  )
}

export const useBaseUrl = (baseURL) => {
  BASE_URL = baseURL;
};

export const MailSend_Service = async (mailData) => {
  console.log('mailData :', mailData)
  try {
    const mail_url = BASE_URL + `/send-email`;
    const result1 = await POST_Api(mail_url, '', mailData)
    return result1
  } catch (error) {
    console.log('❌ Error MailSend_Service :', error)
  }
}

export const Get_CustomerById_Service = async (Cust_id) => {
  try {
    const url_getCustomer = BASE_URL + `/customer/get_customer/${Cust_id}`;
    const result2 = await GET_Api(url_getCustomer, '');
    console.log('2. Load_CustomerData_Service... :', result2);
    return result2;
  } catch (error) {
    console.log('Error Load_CustomerData_Service :', error);
    return false
  }
}
