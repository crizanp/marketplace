import React from "react";

const DetailPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-professional animate-pulse">
      {/* Navbar Skeleton */}
      <div className="bg-gray-800 p-4">
        <div className="h-10 w-1/4 bg-gray-700 rounded"></div>
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="bg-gray-800 p-2">
        <div className="h-6 w-1/2 bg-gray-700 rounded"></div>
      </div>

      <div className="hidden lg:flex p-4 gap-8">
        {/* Left Section Skeleton */}
        <div className="bg-gray-800 p-6 rounded-lg w-1/3">
          {/* Logo and Token Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
            <div>
              <div className="h-6 w-32 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Price Info */}
          <div className="mt-4">
            <div className="h-6 w-24 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-16 bg-gray-700 rounded"></div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex gap-4">
            <div className="h-10 w-20 bg-gray-700 rounded"></div>
            <div className="h-10 w-20 bg-gray-700 rounded"></div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <div className="h-6 w-1/2 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded mb-2"></div>
          </div>

          {/* Token Info */}
          <div className="mt-6 space-y-4">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
          </div>

          {/* Social Info */}
          <div className="mt-6">
            <div className="h-6 w-1/2 bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Right Section Skeleton */}
        <div className="w-2/3">
          <div className="h-[400px] bg-gray-700 rounded-lg"></div>

          {/* Agent Showcase */}
          <div className="mt-6 flex gap-4 overflow-x-auto">
            <div className="bg-gray-800 p-4 rounded-lg flex gap-4 min-w-[250px]">
              <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg flex gap-4 min-w-[250px]">
              <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Community Replies */}
          <div className="mt-6 bg-gray-800 p-6 rounded-lg">
            <div className="h-6 w-1/4 bg-gray-700 rounded mb-4"></div>
            <div className="h-24 w-full bg-gray-700 rounded mb-4"></div>
            <div className="h-10 w-32 bg-gray-700 rounded"></div>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-700 rounded-md">
                <div className="h-4 w-3/4 bg-gray-600 rounded"></div>
              </div>
              <div className="p-4 bg-gray-700 rounded-md">
                <div className="h-4 w-2/3 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout Skeleton */}
      <div className="lg:hidden p-4">
        <div className="h-96 bg-gray-700 rounded-lg mb-4"></div>
        <div className="flex justify-around bg-gray-800 p-4 rounded-lg">
          <div className="h-6 w-20 bg-gray-700 rounded"></div>
          <div className="h-6 w-20 bg-gray-700 rounded"></div>
        </div>

        {/* Mobile Replies */}
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <div className="h-6 w-1/4 bg-gray-700 rounded mb-4"></div>
          <div className="h-24 w-full bg-gray-700 rounded mb-4"></div>
          <div className="h-10 w-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailPageSkeleton;
