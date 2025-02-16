import React from "react";

const HomepageTableSkeleton = () => {
    const rows = Array.from({ length: 10 }); // 10 rows for skeleton
    
    return (
        <div className="lg:px-10 lg:p-5 pb-5 bg-gradient-to-r from-white to-[#f0f7f4] text-gray-800">
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full min-w-[900px] border-collapse bg-white text-gray-700 text-sm">
                    <thead>
                        <tr className="border-b border-[#e6f3ed] text-[#00cc6a]">
                            <th className="px-4 py-3 uppercase font-medium text-left">#</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Name</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Ticker</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Chain</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Market Cap</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Listed Time</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((_, index) => (
                            <tr
                                key={index}
                                className="border-b border-[#e6f3ed] hover:bg-[#f0f7f4]"
                            >
                                <td className="px-4 py-3">
                                    <div className="h-4 w-6 bg-[#e6f3ed] rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3 flex items-center gap-2">
                                    <div className="h-6 w-6 bg-[#e6f3ed] rounded-full animate-pulse"></div>
                                    <div className="h-4 w-32 bg-[#e6f3ed] rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-16 bg-[#e6f3ed] rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-20 bg-[#e6f3ed] rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-24 bg-[#e6f3ed] rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-20 bg-[#e6f3ed] rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-16 bg-[#e6f3ed] rounded animate-pulse"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Skeleton */}
            <div className="flex justify-center my-6 gap-2 flex-wrap">
                {Array(5).fill(null).map((_, index) => (
                    <div 
                        key={index} 
                        className="w-8 h-8 bg-[#e6f3ed] rounded animate-pulse"
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default HomepageTableSkeleton;