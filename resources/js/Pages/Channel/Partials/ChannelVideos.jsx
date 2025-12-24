import {useState, useEffect} from "react";
import __ from "@/Functions/Translate";
import axios from "axios";
import {toast} from "react-toastify";
import Spinner from "@/Components/Spinner";
import {MdGeneratingTokens} from "react-icons/md/index.js";
import {Link} from "@inertiajs/inertia-react";
import {Tooltip} from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {AiOutlineEye} from "react-icons/ai";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import SingleVideo from "@/Pages/Videos/SingleVideo";
import VideosLoop from "@/Pages/Videos/Partials/VideosLoopNew";

export default function ChannelVideos({streamUser, userIsSubscribed, userLoginID}) {
    const [videos, setVideos] = useState({});
    const [loading, setLoading] = useState(true);
    const [playVideo, setPlayVideo] = useState(false);
    const [hovered, setHovered] = useState({});
    const [modal, setModal] = useState(false);
    const [sortOption, setSortOption] = useState('Latest');

    const handleMouseEnter = (id) => {
        setHovered((prev) => ({...prev, [id]: true}));
    };

    const handleMouseLeave = (id) => {
        setHovered((prev) => ({...prev, [id]: false}));
    };
    const playModal = (e, video) => {
        e.preventDefault();
        setPlayVideo(video);
        setModal(true);
    };

    useEffect(() => {
        getVideos(1);
    }, [sortOption]); // Re-fetch when sort option changes

    const getVideos = (page) => {
        setLoading(true);
        axios
            .get(
                `${route("channel.videos", {
                    user: streamUser.id,
                })}?page=${page}&sort=${sortOption}`
            )
            .then((resp) => {
                setVideos(resp.data);
                setLoading(false);
            })
            .catch((Err) => {
                toast.error(Err.response?.data?.message);
                setLoading(false);
            });
    };

    const sortOptions = [
        { value: 'Latest', label: __('Latest') },
        { value: 'Most', label: __('Most Viewed') },
        { value: 'Recently', label: __('Recently Added') },
        { value: 'Older', label: __('Oldest') },
        { value: 'Highest', label: __('Highest Price') },
        { value: 'Lowest', label: __('Lowest Price') },
        { value: 'Only Free', label: __('Only Free') }
    ];

    return (
        <div className="mt-5">
            {/* Sort Dropdown */}
            <div className="mb-4 flex justify-end">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="my-3">
                    <Spinner/>
                </div>
            )}

            <Modal show={modal} onClose={(e) => setModal(false)}>
                {playVideo && <SingleVideo video={playVideo} inModal={true}/>}
            </Modal>

            <VideosLoop videos={videos.data} userLoginID={userLoginID}/>
            
            {videos.total > 9 && (
                <div className="flex justify-center mt-4 space-x-2">
                    <SecondaryButton
                        disabled={videos.current_page === 1}
                        onClick={(e) => getVideos(videos.current_page - 1)}
                    >
                        {__("Prev")}
                    </SecondaryButton>

                    <SecondaryButton
                        disabled={videos.current_page === videos.last_page}
                        onClick={(e) => getVideos(videos.current_page + 1)}
                    >
                        {__("Next")}
                    </SecondaryButton>
                </div>
            )}
            {videos.total === 0 && (
                <div className="dark:text-white dark:bg-zinc-900 rounded-lg px-3 py-5 text-gray-600 bg-white shadow">
                    {__("No videos uploaded by :streamer", {
                        streamer: streamUser.username,
                    })}
                </div>
            )}
        </div>
    );
}