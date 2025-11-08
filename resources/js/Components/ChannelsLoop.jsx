import React, { useState } from "react";
import { Link } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import { BsTagFill } from "react-icons/bs/index.js";
import { MdVideoLibrary } from "react-icons/md/index.js";
import {usePage} from "@inertiajs/inertia-react";

// --- INTERNAL COMPONENT TO HANDLE EACH CARD'S LOGIC ---
const ChannelItem = ({ channel }) => {
    const {logo} = usePage().props;
    // Har image ke liye alag state
    const [isCoverLoaded, setCoverLoaded] = useState(false);
    const [coverError, setCoverError] = useState(false);
    const [isProfileLoaded, setProfileLoaded] = useState(false);
    const [profileError, setProfileError] = useState(false);
    // --- DEFAULT IMAGES ---
    // In dono images ko public/images/ folder mein rakhein
    const defaultCover = logo; 
    const defaultAvatar = logo;
    return (
        <div className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900">
            <div className="relative">
                {channel.live_status === "online" && (
                    <div className="absolute top-3 left-0 z-10">
                        <span className="bg-pink-600 text-white font-bold px-2">
                            {__("LIVE")}
                        </span>
                    </div>
                )}

                {/* --- COVER IMAGE LOGIC --- */}
                {!isCoverLoaded && (
                    <div className="bg-gray-300 dark:bg-zinc-700 h-40 w-full rounded-tr-lg rounded-tl-lg animate-pulse"></div>
                )}
                <Link href={route("channel", { user: channel.username })}>
                    <img
                        src={coverError ? defaultCover : channel.cover_picture}
                        alt={`${channel.name} cover`}
                        loading="lazy"
                        onLoad={() => setCoverLoaded(true)}
                        onError={() => { setCoverError(true); setCoverLoaded(true); }}
                        className={`cursor-pointer rounded-tr-lg rounded-tl-lg w-full h-40 object-cover transition-opacity duration-300 ${isCoverLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                </Link>

                {/* --- PROFILE PICTURE LOGIC --- */}
                <div className="-mt-8 ml-2.5 absolute">
                    <Link href={route("channel", { user: channel.username })}>
                        <div className="relative h-16 w-16">
                            {!isProfileLoaded && (
                                 <div className="absolute inset-0 bg-gray-400 dark:bg-zinc-600 rounded-full animate-pulse"></div>
                            )}
                            <img
                                src={profileError ? defaultAvatar : channel.profile_picture}
                                alt={`${channel.name} profile`}
                                loading="lazy"
                                onLoad={() => setProfileLoaded(true)}
                                onError={() => { setProfileError(true); setProfileLoaded(true); }}
                                className={`rounded-full h-16 w-16 object-cover border-white shadow-sm dark:border-zinc-900 border-2 transition-opacity duration-300 ${isProfileLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </div>
                    </Link>
                </div>
            </div>
            
            <div className="mt-10 px-4">
                {/* ... baaki ka content waisa hi rahega ... */}
                <div className="flex items-center flex-wrap">
                    <div>
                        <Link
                            className="text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-black mt-1 text-lg"
                            href={route("channel", {
                                user: channel.username,
                            })}
                        >
                            {channel.name}
                        </Link>
                    </div>
                    <div>
                        <Link
                            className="ml-2 text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-light text-base"
                            href={route("channel", {
                                user: channel.username,
                            })}
                        >
                            @{channel.username}
                        </Link>
                    </div>
                </div>
                <div className="mt-1 flex items-center flex-wrap justify-between">
                    <div>
                        {channel.categories.map((category) => (
                            <div
                                className="mt-2 inline-flex items-center space-x-1 px-2 rounded-lg dark:bg-gray-700 bg-gray-100"
                                key={`category-${category.id}`}
                            >
                                <BsTagFill className="w-3 text-gray-500 dark:text-gray-100 " />{" "}
                                <Link
                                    href={route("channels.browse", {
                                        category: category.id,
                                        slug: `-${category.slug}`,
                                    })}
                                    className="text-gray-500 dark:text-gray-100 text-sm ml-1"
                                    key={`category-${category.id}`}
                                >
                                    {category.category}
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div>
                        <span className="flex items-center text-gray-500 dark:text-gray-300 text-sm">
                            <MdVideoLibrary className="mr-1" />{" "}
                            {__(":vidsCount videos", {
                                vidsCount: channel.videos_count,
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- AAPKA MAIN EXPORTED COMPONENT ---
export default function ChannelsLoop({ channels }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {channels.map((channel) => (
                <ChannelItem key={channel.id} channel={channel} />
            ))}
        </div>
    );
}