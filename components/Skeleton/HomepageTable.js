import React from "react";

const HomepageTableSkeleton = () => {
    const rows = Array.from({ length: 10 }); // 10 rows for skeleton

    return (
        <div className="lg:px-10 lg:p-5 pb-5 bg-gray-900 text-gray-100">
            <div className="overflow-x-auto rounded-lg">
                <table className="w-full min-w-[900px] border-collapse bg-gray-800 text-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-700 text-green-400">
                            <th className="px-4 py-3 uppercase font-medium text-left">#</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Name</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Chain</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Market Cap</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Listed Time</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Price</th>
                            <th className="px-4 py-3 uppercase font-medium text-left">Upvotes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((_, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-700 hover:bg-gray-700"
                            >
                                <td className="px-4 py-3">
                                    <div className="h-4 w-6 bg-gray-600 rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3 flex items-center gap-2">
                                    <div className="h-6 w-6 bg-gray-600 rounded-full animate-pulse"></div>
                                    <div className="h-4 w-32 bg-gray-600 rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-16 bg-gray-600 rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-20 bg-gray-600 rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-20 bg-gray-600 rounded animate-pulse"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-8 bg-gray-600 rounded animate-pulse"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HomepageTableSkeleton;
