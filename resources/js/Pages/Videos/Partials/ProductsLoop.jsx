import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { FaVideo, FaMusic, FaBookOpen, FaPlayCircle, FaImages } from 'react-icons/fa';
import { MdOutlineShortText } from 'react-icons/md';
import __ from '@/Functions/Translate';

export default function ProductsLoop({ products = [], blocks = [] }) {
    if (!products || products.length === 0) {
        return null;
    }
 
    const generateUrl = (product) => {
        let routeName = "";
        let routeParams = { id: product.slug || product.id };
        switch (product.type?.toLowerCase()) {
            case "video": routeName = "video.single.page"; break;
            case "audio": routeName = "audio.single.page"; break;
            case "ebook": routeName = "ebook.single.page"; break;
            case "short-video": routeName = "short.video.single.page"; break;
            case "gallery": routeName = "single.gallery"; routeParams = { slug: product.slug }; break;
            default: return '#';
        }
        return route(routeName, routeParams);
    };

    const getThumbnailUrl = (product) => {
        const defaultThumbnail = "/images/default-thumbnail.jpg";
        if (product && product.thumbnail) {
            if (product.thumbnail.startsWith('http')) return product.thumbnail;
            return `/${product.thumbnail}`;
        }
        return defaultThumbnail;
    };

    const getProfilePicUrl = (streamer) => {
        const defaultProfilePic = "/images/default-profile.png";
        if (streamer && streamer.profile_picture) {
            if (streamer.profile_picture.startsWith('http')) return streamer.profile_picture;
            return `/${streamer.profile_picture}`;
        }
        return defaultProfilePic;
    };

    const getVideoGifUrl = (product) => {
        if (product && product.videoGIF) {
            if (product.videoGIF.startsWith('http')) return product.videoGIF;
            return `/${product.videoGIF}`;
        }
        return null;
    };

    const renderProductMedia = (product) => {
        const thumbnailUrl = getThumbnailUrl(product);
        const gifUrl = getVideoGifUrl(product);
        const isVideoType = product.type === 'video' || product.type === 'short-video';

        // Case 1: Agar product video type ka hai aur uske paas GIF hai
        if (isVideoType && gifUrl) {
            return (
                <>
                    {/* Thumbnail (default me chupa hua) */}
                    <img
                        src={thumbnailUrl}
                        alt={product.title}
                        className="w-full h-52 object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300 ease-in-out"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/images/default-thumbnail.jpg"; }}
                    />
                    {/* GIF Preview (hover par dikhega) */}
                    <img
                        src={gifUrl}
                        alt={`${product.title} preview`}
                        className="w-full h-52 object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    />
                </>
            );
        }

        // Case 2: Agar product video type ka nahi hai (Audio, Ebook, etc.)
        // Ya video type ka hai lekin GIF nahi hai
        return (
            <img
                src={thumbnailUrl}
                alt={product.title}
                className="w-full h-52 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110" // Sirf zoom effect
                onError={(e) => { e.target.onerror = null; e.target.src = "/images/default-thumbnail.jpg"; }}
            />
        );
    };
    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case "video":
                return <FaVideo className="text-indigo-600 text-lg" />;
            case "audio":
                return <FaMusic className="text-pink-500 text-lg" />;
            case "ebook":
                return <FaBookOpen className="text-green-600 text-lg" />;
            case "short-video":
                return <FaPlayCircle className="text-yellow-500 text-lg" />;
            case "gallery":
                return <FaImages className="text-blue-500 text-lg" />;
            default:
                return <MdOutlineShortText className="text-gray-500 text-lg" />;
        }
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((product) => (
                <Link
                    key={`${product.type}-${product.id}`}
                    href={generateUrl(product)}
                    className="group border dark:border-zinc-800 shadow-sm rounded-lg overflow-hidden bg-white dark:bg-zinc-900 hover:shadow-lg cursor-pointer relative block"
                >
                    {/* Is div me 'overflow-hidden' zaroori hai zoom effect ke liye */}
                    <div className="relative overflow-hidden">

                        {/* --- YAHAN SIRF EK FUNCTION CALL HO RAHA HAI --- */}
                        {renderProductMedia(product)}

                        {/* Price/Free badge */}
                        <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg z-10">
                            {product.price > 0 ? `${product.price} ${__("Tokens")}` : __("Free")}
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="text-gray-800 dark:text-white font-semibold truncate">{product.title}</h3>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center space-x-2">
                                <img src={getProfilePicUrl(product.streamer)} alt="Creator" className="w-8 h-8 rounded-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "/images/default-profile.png"; }} />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{product.streamer?.username || "Unknown"}</span>
                            </div>
                            <div>{getTypeIcon(product.type)}</div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}