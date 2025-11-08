import React, { useState } from "react";
import { Link } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SkeletonCategoryCard from './SkeletonCategoryCard'; // Naya component import karein

// --- DEFAULT IMAGE ---
// Is image ko public/images/ folder mein rakhein
// IMPORTANT: Hum 'import' nahi use kar rahe hain taaki build error na aaye
const defaultImagePath = '/images/default_category.png'; 

// --- INTERNAL COMPONENT TO HANDLE EACH CARD'S LOGIC ---
const CategoryItem = ({ channel }) => {
    const [isLoaded, setLoaded] = useState(false);
    const [hasError, setError] = useState(false);

    // Agar data abhi tak nahi aaya hai, to skeleton dikhao
    if (!channel) {
        return <SkeletonCategoryCard />;
    }

    return (
        <div
            className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900"
            key={channel.id}
        >
            <div className="relative h-48"> {/* Fixed height for consistency */}
                
                {/* --- SKELETON UI --- */}
                {/* Jab tak image load na ho, yeh skeleton dikhega */}
                {!isLoaded && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-700 rounded-t-lg animate-pulse"></div>
                )}

                <Link href={route("category", { id: channel.slug })}>
                    <img
                        src={hasError ? defaultImagePath : channel.imageUrl}
                        alt={channel.category}
                        // NATIVE LAZY LOADING!
                        loading="lazy"
                        // Event handlers
                        onLoad={() => setLoaded(true)}
                        onError={() => {
                            setError(true);
                            setLoaded(true); // Error ke baad bhi skeleton hatana hai
                        }}
                        // Smoothly fade-in the image
                        className={`cursor-pointer rounded-t-lg w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                </Link>
            </div>
            <div className="mt-2 px-4 pb-2">
                <div className="flex items-center flex-wrap">
                    <div>
                        <Link
                            className="text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-black mt-1 text-lg"
                            href={route("category", {
                                id: channel.slug,
                            })}
                        >
                            {channel.category}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- AAPKA MAIN EXPORTED COMPONENT ---
export default function CategoryLoop({ channels }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {channels?.map((channel) => (
                <CategoryItem key={channel.id} channel={channel} />
            ))}
        </div>
    );
}