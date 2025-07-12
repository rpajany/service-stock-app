import { Hourglass } from 'react-loader-spinner'


import React from 'react'

export const Loader = ({ isLoading }) => {
    // https://github.com/davidhu2000/react-spinners
    // https://www.davidhu.io/react-spinners/storybook/?path=/docs/puffloader--docs

    // https://www.npmjs.com/package/react-loader-spinner

    // https://mhnpd.github.io/react-loader-spinner/docs/components/hourglass

    // https://mhnpd.github.io/react-loader-spinner/docs/components/rotating-lines/

    // render(<RotatingLines
    //     visible={true}
    //     height="96"
    //     width="96"
    //     color="grey"
    //     strokeWidth="5"
    //     animationDuration="0.75"
    //     ariaLabel="rotating-lines-loading"
    //     wrapperStyle={{}}
    //     wrapperClass=""
    // />)

    return (
        <Hourglass
            visible={isLoading}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={['#306cce', '#72a1ed']}
        />
    )
}
