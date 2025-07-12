import React, { useState } from 'react'

export const RadioButton = ({ title, selectedOption, setSelectedOption, dataArray }) => {
    // const [selectedOption, setSelectedOption] = useState('option1');


    const handle_Select_OptionChange = (e) => {
        setSelectedOption(e.target.value);
    }


    return (
        <>
            <div className=' mt-4'>
                <h3>{title}</h3>

                {dataArray.map((item, index) =>
                    <label className='mr-3'>
                        <input
                            type="radio"
                            value={item}
                            checked={selectedOption === item}
                            onChange={handle_Select_OptionChange}
                            className='mr-3'
                        />
                        {item}
                    </label>
                )}


                {/* <label className='mr-3'>
                  <input
                      type="radio"
                      value="option2"
                      checked={selectedOption === 'option2'}
                      onChange={handle_Select_OptionChange}
                      className='mr-3'
                  />
                  Option 2
              </label>

              <label className='mr-3'>
                  <input
                      type="radio"
                      value="option3"
                      checked={selectedOption === 'option3'}
                      onChange={handle_Select_OptionChange}
                      className='mr-3'
                  />
                  Option 3
              </label> */}


            </div>

            {/* <p>Selected option: {selectedOption}</p> */}
        </>
    )
}
