import React from "react";
import Navbar from "../Navbar";

const DetailPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-professional">
      <Navbar />
      
      {/* Breadcrumb Skeleton */}
      <div className="bg-green-50 p-2">
        <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex p-4 gap-8">
        {/* Right Section (Chart & Content) */}
        <div className="w-2/3">
          {/* Chart Area Skeleton */}
          <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse"></div>

          {/* Agent Showcase Skeleton */}
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-gray-100 p-4 rounded-lg flex gap-4 animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section Skeleton */}
          <div className="mt-6 bg-gray-100 p-6 rounded-lg">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 bg-white rounded-lg shadow animate-pulse">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Section (Token Info) */}
        <div className="w-1/3">
          <div className="bg-green-50 p-6 rounded-lg animate-pulse">
            {/* Token Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Vote Buttons Skeleton */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
            </div>

            {/* Description Skeleton */}
            <div className="mt-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Token Info Skeleton */}
            <div className="mt-6 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Social Links Skeleton */}
            <div className="mt-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="h-8 w-8 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Chart Area */}
        <div className="h-[400px] bg-gray-100 animate-pulse"></div>

        {/* Agent Showcase */}
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-100 p-4 rounded-lg flex gap-4 min-w-[250px] animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-around bg-green-600 text-white py-3">
          <div className="h-6 w-20 bg-green-500 rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-green-500 rounded animate-pulse"></div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          <div className="bg-green-50 p-4 rounded-lg animate-pulse">
            {/* Token Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Mobile Description */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPageSkeleton;