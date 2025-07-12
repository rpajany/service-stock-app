import { useEffect } from 'react';
import { Datepicker } from 'flowbite';

export const DatePicker = ({ setDate }) => {
    useEffect(() => {
        const datepickerEl = document?.getElementById("datepicker");
        // optional options with default values and callback functions
        const options = {
            defaultDatepickerId: null,
            autohide: false,
            format: 'dd-mm-yyyy',
            maxDate: null,
            minDate: null,
            orientation: 'bottom',
            buttons: true,
            autoSelectToday: true,
            title: null,
            rangePicker: false,
            onShow: () => { },
            onHide: () => { },
        };

        // const instanceOptions = {
        //     id: 'datepicker-custom-example',
        //     override: true
        // };
        // console.log(datepickerEl);
        new Datepicker(datepickerEl, options);
    }, []);
    return (
        <div className="">


            <div className="relative max-w-sm">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                </div>
                <input
                    type="text"
                    id="datepicker"
                    // value={Date.now()}
                    // onSelect={(e) => setDate(e.target.value)}
                    //   onSelect={(e) => console.log(e.target.value)}
                    // onClick={(e) => dobHandler(e)}
                    // onClick={(e) => console.log(e.target.value)}
                    // onChange={(e) => console.log(e)}

                    // datepicker
                    // inline-datepicker
                    // data-date
                    // datepicker-buttons
                    // datepicker-autoselect-today

                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
            </div>
        </div>
    )
}
