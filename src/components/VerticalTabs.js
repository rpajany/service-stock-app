import React, { useState } from 'react'

export const VerticalTabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);


    
    return (
        <div className="flex flex-col md:flex-row border rounded-lg w-full max-w-4xl mx-auto mt-10 shadow-lg">
            {/* Tabs */}
            <div className="flex flex-row md:flex-col border-b md:border-r md:border-b-0 bg-gray-100">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`p-4 text-left w-full md:w-auto md:pl-6 md:pr-12 ${activeTab === index
                                ? "bg-white font-semibold border-r-4 border-blue-500"
                                : "hover:bg-gray-200"
                            }`}
                    >
                        {tab.label}
                    </button>

                   
                ))}
                {/* Content */}
                <div className="p-6 flex-1">
                    <h2 className="text-xl font-bold mb-4">{tabs[activeTab].label}</h2>
                    <div className="text-gray-700">{tabs[activeTab].content}</div>
                </div>
            </div>
           
        </div>
    )
}
