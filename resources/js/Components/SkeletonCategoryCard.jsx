import React from 'react';

export default function SkeletonCategoryCard() {
    return (
        <div className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900 animate-pulse">
            {/* Image Placeholder */}
            <div className="bg-gray-200 dark:bg-zinc-700 h-48 w-full rounded-t-lg"></div>

            {/* Content Placeholder */}
            <div className="mt-2 px-4 pb-2">
                <div className="bg-gray-200 dark:bg-zinc-700 h-6 w-4/5 rounded"></div>
            </div>
        </div>
    );
}