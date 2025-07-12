import React from 'react';
import ReactApexChart from "react-apexcharts";

export const BarChart = ({ data1, data2, data3 }) => {

    // console.log('purchaseMonthData', data1)

    const options = {
        chart: {
            sparkline: {
                enabled: false,
            },
            type: "bar",
            width: "100%",
            height: 400,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: "100%",
                borderRadiusApplication: "end",
                borderRadius: 6,
                dataLabels: {
                    position: "top",
                },
            },
        },
        legend: {
            show: true,
            position: "bottom",
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            shared: true,
            intersect: false,
            formatter: function (value) {
                return "₹" + value;
            },
        },
        xaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
                },
                formatter: function (value) {
                    return "₹" + value.toFixed(2); // Add Rupee symbol and format value
                },
            },
            categories: ["Jan", "Feb", "Mar", "Apl", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
                },
            },
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -20,
            },
        },
        fill: {
            opacity: 1,
        },
    };

    const series = [
        {
            name: "Sales",
            color: "#0e9f6e",
            // data: [1420, 1620, 1820, 1420, 1650, 2120, 1420, 1620, 1820, 1420, 1650, 2120],
            data: data3 ? data3 : [],
        },
        {
            name: "Purchase",
            color: "#17a2b8",
            // data: [1420, 1620, 1820, 1420, 1650, 2120, 1420, 1620, 1820, 1420, 1650, 2120],
            data: data1 ? data1 : [],
        },
        {
            name: "Expense",
            color: "#dc3545",
            // data: [1420, 1620, 1820, 1420, 1650, 2120, 788, 810, 866, 788, 1100, 1200],
            data: data2 ? data2 : [],
        },
    ];
    return (
        <div>
            <ReactApexChart options={options} series={series} type="bar" height={400} />
        </div>
    )
}
