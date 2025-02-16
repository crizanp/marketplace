import React, { useState } from "react";
import Navbar from "../Navbar";
import HomepageTableSkeleton from "./HomepageTable";

const ExplorerSkeleton = () => {
    const [showMessage, setShowMessage] = useState(false);

    return (
        <>
            <Navbar />
            {showMessage && (
                <div className="fixed top-0 left-0 w-full bg-[#00cc6a] text-white py-3 text-center shadow-lg z-50 animate-slideIn">
                    Full version will be released on Jan 1, this is just a prototype.
                </div>
            )}
            <div className="lg:px-10 p-0 bg-gradient-to-r from-white to-[#f0f7f4] text-gray-800 overflow-x-hidden">
                {/* Trending Agents */}
                <div className="flex gap-4 my-5 py-2 mx-4 overflow-x-auto scrollbar-hide sm:justify-center">
                    {Array(8)
                        .fill(null)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col items-center bg-white rounded-lg w-20 h-20 text-center gap-2 p-2 shadow-md shrink-0 border border-[#e6f3ed]"
                            >
                                <div className="h-10 w-10 bg-[#e6f3ed] rounded-full animate-pulse"></div>
                                <div className="w-16 h-4 bg-[#e6f3ed] animate-pulse"></div>
                            </div>
                        ))}
                </div>

                {/* Search Bar */}
                <div className="flex justify-center items-center mb-6 px-4 gap-2">
                    <div className="w-full max-w-md px-4 py-2 border border-[#00cc6a] rounded bg-white text-gray-700">
                        <div className="w-full h-4"></div>
                    </div>
                    <div className="p-2 bg-[#00cc6a] text-white rounded h-10 w-10"></div>
                </div>

                {/* Sorting and Chain Filtering */}
                <div className="flex flex-row items-center gap-4 mb-6 px-4">
                    <div className="w-32 h-8 bg-[#e6f3ed] animate-pulse rounded"></div>
                    <div className="w-32 h-8 bg-[#e6f3ed] animate-pulse rounded"></div>
                </div>

                {/* Table Skeleton */}
                <HomepageTableSkeleton />
            </div>
        </>
    );
};

export default ExplorerSkeleton;