import React from "react";
import { Link } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import { BsTagFill } from "react-icons/bs/index.js";
import { FaGrinStars, FaUsers } from "react-icons/fa/index.js";
import { MdVideoLibrary } from "react-icons/md/index.js";

export default function TagsLoop({ channels }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {channels.map((channel) => (
                <div
                    className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900"
                    key={channel.id}
                >
                    <div className="relative">

                        <img
                            src={channel.imageUrl}
                            alt={channel.imageUrl}
                            className="cursor-pointer rounded-tr-lg rounded-tl-lg sm:w-auto"
                        />

                    </div>
                    <div className="mt-10 px-4">
                        <div className="flex items-center flex-wrap">
                            <div>
                                <Link
                                    className="text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-black mt-1 text-lg"
                                    href={route("tag", {
                                        id: channel.slug,
                                    })}
                                >
                                    {channel.name}
                                </Link>
                            </div>

                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}
