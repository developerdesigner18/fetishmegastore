import React from 'react';

export default function SkeletonCard() {
    return (
        <div className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900 animate-pulse">
            {/* Cover Image Placeholder */}
            <div className="relative">
                <div className="bg-gray-300 dark:bg-zinc-700 h-40 w-full rounded-tr-lg rounded-tl-lg"></div>
                {/* Profile Picture Placeholder */}
                <div className="absolute -mt-8 ml-2.5">
                    <div className="bg-gray-400 dark:bg-zinc-600 rounded-full h-16 w-16 border-white dark:border-indigo-200 border-2"></div>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="mt-10 px-4">
                <div className="bg-gray-300 dark:bg-zinc-700 h-6 w-3/5 rounded mb-2"></div>
                <div className="bg-gray-300 dark:bg-zinc-700 h-4 w-2/5 rounded"></div>

                <div className="mt-3 flex justify-between">
                    <div className="bg-gray-300 dark:bg-zinc-700 h-5 w-1/3 rounded"></div>
                    <div className="bg-gray-300 dark:bg-zinc-700 h-5 w-1/4 rounded"></div>
                </div>
            </div>
        </div>
    );
}