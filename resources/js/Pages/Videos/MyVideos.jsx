import __ from "@/Functions/Translate";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { Head, Link, usePage } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { AiOutlineEdit } from "react-icons/ai/index.js";
import { RiDeleteBin5Line } from "react-icons/ri/index.js";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Modal from "@/Components/Modal";
import { BsTagFill } from "react-icons/bs/index.js";
import AccountNavi from "../Channel/Partials/AccountNavi";
import { MdOutlineVideoLibrary, MdSearch } from "react-icons/md/index.js";
import { useState, useRef, useEffect } from "react";
import PlyrComponent from "plyr-react"
import "plyr-react/plyr.css"
export default function MyVideos({ videos }) {
    console.log(videos,'videos');
    
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(usePage().props.ziggy.query?.search || '');

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Use a timeout to debounce the search
        const timer = setTimeout(() => {
            Inertia.get(route('videos.list'), { search: query }, {
                preserveState: true,
                replace: true,
                only: ['videos']
            });
        }, 500);

        return () => clearTimeout(timer);
    };

    const confirmDelete = (e, id) => {
        e.preventDefault();
        setShowDeleteConfirmation(true);
        setDeleteId(id);
    };

    const deleteVideo = () => {
        Inertia.visit(route("videos.delete"), {
            method: "POST",
            data: { video: deleteId },
            preserveState: false,
        });
    };
    const playerInstances = useRef({});

    const handlePlay = (videoId) => {
        // If clicking the same video that's already playing, do nothing
        if (playingVideoId === videoId) return;

        // If another video is playing, clean it up first
        if (playingVideoId && playerInstances.current[playingVideoId]) {
            const player = playerInstances.current[playingVideoId];
            if (player && typeof player.pause === 'function') {
                player.pause();
            }
            // Remove the player element from DOM
            const playerElement = document.getElementById(`player-container-${playingVideoId}`);
            if (playerElement) {
                playerElement.innerHTML = '';
            }
            delete playerInstances.current[playingVideoId];
        }

        setPlayingVideoId(videoId);
    };

    const handleStopPlay = () => {
        if (playingVideoId && playerInstances.current[playingVideoId]) {
            const player = playerInstances.current[playingVideoId];
            if (player && typeof player.pause === 'function') {
                player.pause();
            }
            // Remove the player element from DOM
            const playerElement = document.getElementById(`player-container-${playingVideoId}`);
            if (playerElement) {
                playerElement.innerHTML = '';
            }
            delete playerInstances.current[playingVideoId];
        }
        setPlayingVideoId(null);
    };

    // Clean up all players on unmount
    useEffect(() => {
        return () => {
            Object.keys(playerInstances.current).forEach(videoId => {
                const player = playerInstances.current[videoId];
                if (player && typeof player.destroy === 'function') {
                    player.destroy();
                }
                const playerElement = document.getElementById(`player-container-${videoId}`);
                if (playerElement) {
                    playerElement.innerHTML = '';
                }
            });
        };
    }, []);

    const VideoPlayer = ({ video }) => {
        const playerRef = useRef(null);

        useEffect(() => {
            if (playingVideoId === video.id && playerRef.current) {
                // Initialize the player instance
                const player = playerRef.current.plyr;
                if (player) {
                    playerInstances.current[video.id] = player;
                }

                return () => {
                    if (playerInstances.current[video.id]) {
                        delete playerInstances.current[video.id];
                    }
                };
            }
        }, [playingVideoId, video.id]);

        if (playingVideoId !== video.id) {
            return (
                <div
                    className="relative cursor-pointer group"
                    onClick={() => handlePlay(video.id)}
                >
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full rounded-lg aspect-video object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
                        <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-200">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="relative" id={`player-container-${video.id}`}>
                <PlyrComponent
                    ref={playerRef}
                    source={{
                        type: 'video',
                        sources: [{
                            src: video.videoUrl,
                            type: 'video/mp4',
                        }],
                        poster: video.thumbnail
                    }}
                    options={{
                        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                        autoplay: true
                    }}
                />
                <button
                    onClick={handleStopPlay}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                >
                    {__("Close Player")}
                </button>
            </div>
        );
    };

    // active tab class
    const activeTabClass =
        "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
    const inactiveTabClass =
        "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";

    return (
        <AuthenticatedLayout>
            <Head title={__("Videos")} />

            <Modal
                show={showDeleteConfirmation}
                onClose={(e) => setShowDeleteConfirmation(false)}
            >
                <div className="px-5 py-10 text-center">
                    <h3 className="text-xl mb-3 text-zinc-700 dark:text-white">
                        {__("Are you sure you want to remove this Video?")}
                    </h3>
                    <DangerButton onClick={(e) => deleteVideo()}>
                        {__("Yes")}
                    </DangerButton>
                    <SecondaryButton
                        className="ml-3"
                        onClick={(e) => setShowDeleteConfirmation(false)}
                    >
                        {__("No")}
                    </SecondaryButton>
                </div>
            </Modal>

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"upload-videos"} />
                <div className="ml-0">
                    <Link
                        href={route("videos.list")}
                        className={activeTabClass}
                    >
                        {__("Upload Videos")}
                    </Link>
                    <Link
                        href={route("audio.list")}
                        className={inactiveTabClass}
                    >
                        {__("Upload Audio")}
                    </Link>
                    <Link
                        href={route("ebook.list")}
                        className={inactiveTabClass}
                    >
                        {__("Upload Ebook")}
                    </Link>
                    <Link
                        href={route("textFile.list")}
                        className={inactiveTabClass}
                    >
                        {__("Upload TextFile")}
                    </Link>
                    <Link
                        href={route("videos.ordered")}
                        className={inactiveTabClass}
                    >
                        {__("Videos Ordered")}
                    </Link>
                    <Link
                        href={route("preview.list")}
                        className={inactiveTabClass}
                    >
                        {__("Upload Preview")}
                    </Link>
                    <Link
                        href={route("gallery.list")}
                        className={inactiveTabClass}
                    >
                        {__("Upload Gallery")}
                    </Link>
                    <Link
                        href={route("model.list")}
                        className={inactiveTabClass}
                    >
                        {__("Upload Model")}
                    </Link>

                    <div className="mt-5 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg">
                        <header>
                            <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                                <MdOutlineVideoLibrary className="mr-2" />
                                {__("My Videos")}
                            </h2>

                            <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                                {__("Upload & manage videos for the channel")}
                            </p>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <PrimaryButton
                                    onClick={(e) =>
                                        Inertia.visit(route("videos.upload"))
                                    }
                                >
                                    {__("Upload Video")}
                                </PrimaryButton>

                                {/* Search Input */}
                                <div className="relative w-full md:w-64">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <MdSearch className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                        placeholder={__("Search videos...")}
                                    />
                                </div>
                            </div>
                        </header>

                        <hr className="my-5" />

                        {videos.total === 0 && (
                            <div className="text-gray-600 dark:text-white">
                                {searchQuery ?
                                    __("No videos found matching your search.") :
                                    __("You didn't upload any videos yet.")
                                }
                            </div>
                        )}

                        {videos.total !== 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-5 gap-y-10">
                                {videos.data.map((v) => (
                                    <div
                                        key={`video-${v.id}`}
                                        className={
                                            "w-full md:w-[340px] xl:w-[420px] mt-5"
                                        }
                                    >
                                        <VideoPlayer video={v} />

                                        <div className="my-3 h-6 overflow-hidden text-gray-600 text-sm font-semibold dark:text-white">
                                            <a
                                                data-tooltip-content={v.title}
                                                data-tooltip-id={`tooltip-${v.id}`}
                                            >
                                                {v.title}
                                            </a>

                                            <Tooltip anchorSelect="a" />
                                        </div>

                                        <div className="dark:text-white text-gray-600 flex items-center space-x-2 text-xs">
                                            <BsTagFill className="mr-1" />{" "}
                                            {v.categoryNames}
                                        </div>

                                        <div className="mt-3 flex items-center space-x-2 text-sm justify-between">
                                            <span className="text-gray-600 dark:text-white">
                                                {__("Price")}{" "}
                                            </span>
                                            <span className="px-2 py-1 text-sm rounded-lg bg-sky-500 text-white">
                                                {v.price > 0
                                                    ? __(
                                                        ":tokensPrice tokens",
                                                        {
                                                            tokensPrice:
                                                            v.price,
                                                        }
                                                    )
                                                    : __("Free")}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center space-x-2 text-sm justify-between">
                                            <span className="text-gray-600 dark:text-white">
                                                {__("Free for subs")}{" "}
                                            </span>
                                            <span className="px-2 py-1 rounded-lg bg-teal-500 text-white">
                                                {v.free_for_subs}
                                            </span>
                                        </div>

                                        <div className="flex mt-2 items-center space-x-2 text-sm justify-between">
                                            <span className="text-gray-600 dark:text-white">
                                                {__("Views")}{" "}
                                            </span>
                                            <span className="px-2 py-1 rounded-lg bg-gray-500 text-white">
                                                {v.views}
                                            </span>
                                        </div>

                                        <div className="flex mt-2 items-center space-x-2 text-sm justify-between">
                                            <span className="text-gray-600 dark:text-white">
                                                {__("Earnings")}{" "}
                                            </span>
                                            <span className="px-2 py-1 rounded-lg bg-pink-500 text-white">
                                                {v.sales_sum_price
                                                    ? __(
                                                        ":salesTokens tokens",
                                                        {
                                                            salesTokens:
                                                            v.sales_sum_price,
                                                        }
                                                    )
                                                    : "--"}
                                            </span>
                                        </div>

                                        <div className="border-t pt-3 mt-3  flex items-center">
                                            <Link
                                                href={route("videos.edit", {
                                                    video: v.id,
                                                })}
                                            >
                                                <AiOutlineEdit className="w-6 h-6 mr-2 text-sky-600" />
                                            </Link>
                                            <button
                                                onClick={(e) =>
                                                    confirmDelete(e, v.id)
                                                }
                                            >
                                                <RiDeleteBin5Line className="text-red-600 w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {videos.last_page > 1 && (
                            <>
                                <hr className="my-5" />

                                <div className="flex text-gray-600 my-3 text-sm">
                                    {__("Page: :pageNumber of :lastPage", {
                                        pageNumber: videos.current_page,
                                        lastPage: videos.last_page,
                                    })}
                                </div>

                                <SecondaryButton
                                    processing={
                                        videos.prev_page_url ? false : true
                                    }
                                    className="mr-3"
                                    onClick={(e) =>
                                        Inertia.visit(videos.prev_page_url)
                                    }
                                >
                                    {__("Previous")}
                                </SecondaryButton>

                                <SecondaryButton
                                    processing={
                                        videos.next_page_url ? false : true
                                    }
                                    onClick={(e) =>
                                        Inertia.visit(videos.next_page_url)
                                    }
                                >
                                    {__("Next")}
                                </SecondaryButton>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}