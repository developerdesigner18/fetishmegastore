import React from "react";
import {Link} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import {BsTagFill} from "react-icons/bs/index.js";
import {FaGrinStars, FaUsers, FaRegFlag, FaWeight} from "react-icons/fa/index.js";
import {MdVideoLibrary} from "react-icons/md/index.js";

export default function CategoryLoop({channels}) {
    return (
        // <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">

            {channels && channels.map((channel) => (
                <div
                    className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900"
                    key={channel.id}
                >
                    <div className="relative">
                        <Link
                            className="text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-black mt-1 text-lg"
                            href={route("model", {
                                id: channel.slug,
                            })}
                        >
                            <img
                                src={channel.imageUrl}
                                alt={channel.imageUrl}
                                className="cursor-pointer rounded-tr-lg rounded-tl-lg sm:w-auto"
                            />
                        </Link>


                    </div>
                    <div className="mt-10 px-4">
                        <div className="items-center flex-wrap">
                            <div className="h-5 overflow-hidden">
                                <Link
                                    className="text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-black mt-1 text-lg"
                                    href={route("model", {
                                        id: channel.slug,
                                    })}
                                >
                                    {channel.name}
                                </Link>

                            </div>
                            <div className="mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-200"></div>
                            <div className="mt-1.5 mb-1 flex items-center text-xs text-gray-500 dark:text-gray-200">
                                <div>
                                    <Link
                                        href={route("model", {
                                            id: channel.slug,
                                        })}
                                    >
                                        {__('Age:')} {channel?.age}
                                    </Link>

                                </div>
                                <div className="inline-flex items-center ml-2">
                                    <FaRegFlag className="mr-0.5"/>
                                    {__('Country:')} {channel?.country}
                                </div>
                                <div className="ml-2 inline-flex items-center">
                                    <FaWeight className="w-4 h-4 mr-0.5"/>
                                    {__('Weight:')} {channel?.weight}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            ))}

        </div>
    );
}
