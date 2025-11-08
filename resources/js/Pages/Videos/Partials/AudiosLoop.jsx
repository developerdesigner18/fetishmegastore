import __ from "@/Functions/Translate";
import { Link } from "@inertiajs/inertia-react";
import { Tooltip } from "react-tooltip";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import "react-tooltip/dist/react-tooltip.css";
import { AiOutlineEye } from "react-icons/ai/index.js";
import Modal from "@/Components/Modal";
import SingleVideo from "../SingleVideoNew";
import { useState, useEffect } from "react";
import { BsTagFill } from "react-icons/bs/index.js";
import Loader from '@/Components/Loader'; // Import your loader component

export default function AudiosLoop({ audio, userLoginID }) {
    console.log(audio,"audio");
    
    const [playVideo, setPlayVideo] = useState(false);
    const [modal, setModal] = useState(false);
    const [hovered, setHovered] = useState({}); 
    const [loading, setLoading] = useState(false);

    const handleMouseEnter = (id) => {
        setHovered((prev) => ({ ...prev, [id]: true }));
    };

    const handleMouseLeave = (id) => {
        setHovered((prev) => ({ ...prev, [id]: false }));
    };

    const playModal = (e, video) => {
        e.preventDefault();
        setPlayVideo(video);
        setModal(true);

    };

    const handleLinkClick = (e, price, slug, type) => {
        e.preventDefault();
        if (price === 0 && type === 'short-video') {
            window.location.href = route("short.video.single.page", { id: slug });
        } else if (price === 0 && type === 'video') {
            window.location.href = route("audio.single.page", { id: slug });
        } else if (price > 0) {
            if (userLoginID) {
                window.location.href = route("audio.single.page", { id: slug });
            } else {
                window.location.href = route("audio.single.page", { id: slug });
            }
        }
    };

    return (
        <>
            {loading && <Loader />}
            <Modal show={modal} onClose={(e) => setModal(false)}>
                {playVideo && <SingleVideo video={playVideo} inModal={true} />}
            </Modal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {audio?.map((v, index) => {
                    const type = v.type;

                    return <div
                        className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900"
                        key={`vid-${v.id}`}
                    >
                        <div className="relative">
                            <a
                                href={route("audio.single.page", {
                                    id: v.slug,
                                })}
                                onClick={(e) => handleLinkClick(e, route("audio.single.page", { id: v.slug }), v.price, v.slug, v.id, v.type)}
                                data-price={v.price}>
                                {hovered[v.id] && v.videoGIF ? (
                                    <img
                                        src={v.videoGIF}
                                        className="hovered-gif thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"
                                        alt="Any Fetish Porn and Extreme XXX Porn Site – FetishMegaStore"
                                        onMouseLeave={() => handleMouseLeave(v.id)}
                                    />
                                ) : (
                                    <img
                                        src={`/${v.thumbnail}`}
                                        className="thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"
                                        width={"100%"}
                                        alt="Watch Free Fetish and BDSM Porn Videos – FetishMegaStore"
                                        onMouseEnter={() => handleMouseEnter(v.id)}
                                    />
                                )}
                            </a>

                            <div
                                className="absolute top-5 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1">
                                {v.price < 1 ? (
                                    __("Free")
                                ) : (
                                    <div className="flex items-center">
                                        <MdGeneratingTokens className="h-4 w-4 mr-1" />
                                        {v.price}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="inline-flex items-center">
                            <div className="w-10 flex-shrink-0 mr-2">
                                <Link
                                    href={v.streamer ? route("channel", { user: v.streamer.username }) : "#"} // Check if v.streamer exists
                                >
                                    {v.streamer && v.streamer.profile_picture ? ( // Check if v.streamer exists and has a profile_picture
                                        <img
                                            src={v.streamer.profile_picture}
                                            className="w-10 h-10 rounded-full"
                                            alt={v.streamer.username || "Streamer profile"} // Fallback alt text
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-300" /> // Fallback if no profile picture
                                    )}
                                </Link>
                            </div>
                            <div>
                                <div className="h-5 overflow-hidden">
                                    <a
                                        className="font-semibold dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400"
                                        href={route("audio.single.page", { id: v.slug })}
                                        onClick={(e) => handleLinkClick(e, v.price, v.slug, v.type)}
                                    >
                                        {v.title}
                                    </a>
                                </div>

                                <div className="mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-200"></div>

                                <div className="mt-1.5 mb-1 flex items-center text-xs text-gray-500 dark:text-gray-200">

                                    <div className="inline-flex items-center ml-2">
                                        <BsTagFill className="mr-0.5" />
                                        {v.categoryNames}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </>
    );
}