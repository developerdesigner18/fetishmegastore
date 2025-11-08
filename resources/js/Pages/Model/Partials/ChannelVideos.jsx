import {useState, useEffect} from "react";
import __ from "@/Functions/Translate";
import axios from "axios";
import {toast} from "react-toastify";
import Spinner from "@/Components/Spinner";
import {MdGeneratingTokens} from "react-icons/md/index.js";
import {Link} from "@inertiajs/inertia-react";
import {Tooltip} from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {AiOutlineEye} from "react-icons/ai/index.js";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import SingleVideo from "@/Pages/Videos/SingleVideo";
import {BsTagFill} from "react-icons/bs/index.js";
import VideosLoop from "@/Pages/Videos/Partials/VideosLoopNew";

export default function ChannelVideos({category, userLoginID}) {
    const [videos, setVideos] = useState({});
    const [loading, setLoading] = useState(true);
    const [playVideo, setPlayVideo] = useState(false);
    const [modal, setModal] = useState(false);
    const [hovered, setHovered] = useState({});
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
    }, [sortOption]);   

    const getVideos = (page) => {
        axios
            .get(
                `${route("model.videos", {
                    id: category.id,
                })}?page=${page}&sort=${sortOption}`
            )
            .then((resp) => {
                setVideos(resp.data);
                setLoading(false);
            })
            .catch((Err) => toast.error(Err.response?.data?.message));
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

            <VideosLoop videos={videos.data} userLoginID={userLoginID} />

            {/*<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">*/}
            {/*    {videos.data &&*/}
            {/*        videos.data.map((v) => (*/}
            {/*            <div*/}
            {/*                className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900"*/}
            {/*                key={`vid-${v.id}`}*/}
            {/*            >*/}
            {/*                <div className="relative">*/}
            {/*                    /!*<button onClick={(e) => playModal(e, v)}>*!/*/}
            {/*                    /!*    <img*!/*/}
            {/*                    /!*        src={v.thumbnail}*!/*/}
            {/*                    /!*        className="rounded-tl-lg rounded-tr-lg mb-3 "*!/*/}
            {/*                    /!*        alt=""*!/*/}
            {/*                    /!*    />*!/*/}
            {/*                    /!*</button>*!/*/}

            {/*                    /!*<Link*!/*/}
            {/*                    /!*    href={route("video.single.page", {*!/*/}
            {/*                    /!*        id: v.slug,*!/*/}
            {/*                    /!*    })}*!/*/}
            {/*                    /!*>*!/*/}
            {/*                    /!*    <img*!/*/}
            {/*                    /!*        src={v.thumbnail}*!/*/}
            {/*                    /!*        className="rounded-tl-lg rounded-tr-lg mb-3 "*!/*/}
            {/*                    /!*        alt=""*!/*/}
            {/*                    /!*    />*!/*/}
            {/*                    /!*</Link>*!/*/}


            {/*                    <a*/}
            {/*                        href={route("video.single.page", {*/}
            {/*                            id: v.slug,*/}
            {/*                        })}*/}
            {/*                        onClick={(e) => handleLinkClick(e, route("video.single.page", {id: v.slug}))}*/}
            {/*                    >*/}
            {/*                        {hovered[v.id] && v.videoGIF ? (*/}
            {/*                            <img*/}
            {/*                                src={v.videoGIF}*/}
            {/*                                className="hovered-gif thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"*/}
            {/*                                alt="Any Fetish Porn and Extreme XXX Porn Site – FetishMegaStore"*/}
            {/*                                onMouseLeave={() => handleMouseLeave(v.id)}*/}
            {/*                            />*/}
            {/*                        ) : (*/}
            {/*                            <img*/}
            {/*                                src={v.thumbnail}*/}
            {/*                                className="thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"*/}
            {/*                                alt="Watch Free Fetish and BDSM Porn Videos – FetishMegaStore"*/}
            {/*                                onMouseEnter={() => handleMouseEnter(v.id)}*/}
            {/*                            />*/}
            {/*                        )}*/}
            {/*                    </a>*/}

            {/*                    <div*/}
            {/*                        className="absolute top-5 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1">*/}
            {/*                        {v.price < 1 ? (*/}
            {/*                            __("Free")*/}
            {/*                        ) : (*/}
            {/*                            <div className="flex items-center">*/}
            {/*                                <MdGeneratingTokens className="h-4 w-4 mr-1"/>*/}
            {/*                                {v.price}*/}
            {/*                            </div>*/}
            {/*                        )}*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="inline-flex items-center px-3">*/}
            {/*                    <div className="w-10 flex-shrink-0 mr-2">*/}
            {/*                        <Link*/}
            {/*                            href={route("channel", {*/}
            {/*                                user: v.streamer.username,*/}
            {/*                            })}*/}
            {/*                        >*/}
            {/*                            <img*/}
            {/*                                src={v.streamer.profile_picture}*/}
            {/*                                className="w-10 h-10 rounded-full"*/}
            {/*                            />*/}
            {/*                        </Link>*/}
            {/*                    </div>*/}
            {/*                    <div>*/}
            {/*                        <div className="h-5 overflow-hidden">*/}
            {/*                            <Link*/}
            {/*                                href={route("video.single.page", {*/}
            {/*                                    id: v.slug,*/}
            {/*                                })}*/}
            {/*                            >*/}
            {/*                                {v.title}*/}
            {/*                            </Link>*/}
            {/*                            /!*<Link*!/*/}
            {/*                            /!*    data-tooltip-content={v.title}*!/*/}
            {/*                            /!*    data-tooltip-id={`tooltip-${v.id}`}*!/*/}
            {/*                            /!*    onClick={(e) => playModal(e, v)}*!/*/}
            {/*                            /!*    className="font-semibold  dark:text-gray-100 hover:text-gray-800 text-gray-600 dark:hover:text-gray-400"*!/*/}
            {/*                            /!*>*!/*/}
            {/*                            /!*    {v.title}*!/*/}
            {/*                            /!*</Link>*!/*/}
            {/*                        </div>*/}

            {/*                        <div*/}
            {/*                            className="mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-200"></div>*/}

            {/*                        <div*/}
            {/*                            className="mt-1.5 mb-1 flex items-center text-xs text-gray-500 dark:text-gray-200">*/}
            {/*                            <div>*/}
            {/*                                <Link*/}
            {/*                                    href={route("channel", {*/}
            {/*                                        user: v.streamer.username,*/}
            {/*                                    })}*/}
            {/*                                >*/}
            {/*                                    @{v.streamer.username}*/}
            {/*                                </Link>*/}

            {/*                                <Tooltip anchorSelect="a"/>*/}
            {/*                            </div>*/}
            {/*                            <div className="inline-flex items-center ml-2">*/}
            {/*                                <BsTagFill className="mr-0.5"/>*/}
            {/*                                {v.categoryNames}*/}
            {/*                            </div>*/}
            {/*                            /!*<div className="ml-2 inline-flex items-center">*!/*/}
            {/*                            /!*    <AiOutlineEye className="w-4 h-4 mr-0.5" />*!/*/}
            {/*                            /!*    {v.views === 1*!/*/}
            {/*                            /!*        ? __("1 view")*!/*/}
            {/*                            /!*        : __(":viewsCount views", {*!/*/}
            {/*                            /!*            viewsCount: v.views,*!/*/}
            {/*                            /!*        })}*!/*/}
            {/*                            /!*</div>*!/*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</div>*/}

            {videos.total > 9 && (
                <>
                    <SecondaryButton
                        className="mr-2"
                        processing={videos.prev_page_url ? false : true}
                        onClick={(e) => getVideos(videos.current_page - 1)}
                    >
                        {__("Prev")}
                    </SecondaryButton>

                    <SecondaryButton
                        processing={videos.next_page_url ? false : true}
                        onClick={(e) => getVideos(videos.current_page + 1)}
                    >
                        {__("Next")}
                    </SecondaryButton>
                </>
            )}
            {videos.total === 0 && (
                <div className="dark:text-white dark:bg-zinc-900 rounded-lg px-3 py-5 text-gray-600 bg-white shadow">
                    {__("No videos availavle in this model",)}
                </div>
            )}
        </div>
    );
}
