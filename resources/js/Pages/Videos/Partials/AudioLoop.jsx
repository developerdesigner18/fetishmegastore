import __ from "@/Functions/Translate";
import {Link} from "@inertiajs/inertia-react";
import {Tooltip} from "react-tooltip";
import {MdGeneratingTokens} from "react-icons/md/index.js";
import "react-tooltip/dist/react-tooltip.css";
import {AiOutlineEye} from "react-icons/ai/index.js";
import Modal from "@/Components/Modal";
import SingleAudio from "../SingleAudio";
import {useState, useEffect} from "react";
import {BsTagFill, BsEyeFill} from "react-icons/bs/index.js";
import Loader from '@/Components/Loader'; // Import your loader component

export default function AudioLoop({audio, blocks}) {
    console.log('browse-audio', audio);
    const [playAudio, setPlayAudio] = useState(false);
    const [modal, setModal] = useState(false);
    const [hovered, setHovered] = useState({});
    const [loading, setLoading] = useState(false);

    const handleMouseEnter = (id) => {
        setHovered((prev) => ({ ...prev, [id]: true }));
    };

    const handleMouseLeave = (id) => {
        setHovered((prev) => ({ ...prev, [id]: false }));
    };

    // console.log('blocks', blocks);

    // const [videoArr, setVideoArr] = useState([...audio])

    // function addAdObjects(array) {
    //     const adObject = { ad: true };
    //
    //     let index = 3; // Start inserting from the 4th index
    //     while (index < array.length) {
    //         // Insert adObject at the current index
    //         array.splice(index, 0, adObject);
    //         // Insert adObject at the next index
    //         array.splice(index + 1, 0, adObject);
    //         // Move to the next set of indices (12, 13, 20, 21, etc.)
    //         index += 8; // Move 8 positions ahead to maintain the pattern
    //     }
    //
    //     return array;
    //
    // }

    // console.log("vjideo array", videoArr)

    // useEffect(() => {
    //   let arr =  addAdObjects(audio)
    //     setVideoArr(arr)
    //     return () => {
    //         let arr =  addAdObjects(audio)
    //         setVideoArr(arr)
    //     }
    // }, [audio]);

    const playModal = (e, audio) => {
        e.preventDefault();
        setPlayAudio(audio);
        setModal(true);

    };

    const handleLinkClick = (e, url) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            window.location.href = url;
        }, 500); // Simulate loading delay
    };

    return (
        <>
            {loading && <Loader />}
            <Modal show={modal} onClose={(e) => setModal(false)}>
                {playAudio && <SingleAudio audio={playAudio} inModal={true}/>}
            </Modal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {audio?.map((v, index) => {
                    // if(index == 3 || index == 4 || index == 11 || index == 12){
                    //     return <h1> Add Section </h1>
                    // }

                    // Find the block that matches the current index and has non-null html
                    // if(blocks){
                    //     const matchingBlock = blocks.find(block => block.number === index && block.html !== null);
                    //
                    //     // If there's a matching block, render its HTML
                    //     if (matchingBlock) {
                    //         return (
                    //             <div
                    //                 className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900"
                    //
                    //             >
                    //                 <div className="relative"
                    //                      key={`block-${matchingBlock.id}`}
                    //                      dangerouslySetInnerHTML={{ __html: matchingBlock.html }}
                    //                 />
                    //             </div>
                    //         );
                    //     }
                    // }


                    return <div
                        className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900"
                        key={`vid-${v.id}`}
                    >
                        <div className="relative">
                            {/*<button onClick={(e) => playModal(e, v)}>*/}
                            {/*    <img*/}
                            {/*        src={v.thumbnail}*/}
                            {/*        className="rounded-tl-lg rounded-tr-lg mb-3 "*/}
                            {/*        alt=""*/}
                            {/*    />*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href={route("video.single.page", {*/}
                            {/*        id: v.id,*/}
                            {/*    })}*/}
                            {/*>*/}
                            {/*    {hovered[v.id] && v.videoGIF ? (*/}
                            {/*        <img*/}
                            {/*            src={v.videoGIF}*/}
                            {/*            className="hovered-gif thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"*/}
                            {/*            alt="Any Fetish Porn and Extreme XXX Porn Site – FetishMegaStore"*/}
                            {/*            onMouseLeave={() => handleMouseLeave(v.id)}*/}
                            {/*        />*/}
                            {/*    ) : (*/}
                            {/*        <img*/}
                            {/*            src={v.thumbnail}*/}
                            {/*            className="thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"*/}
                            {/*            alt="Watch Free Fetish and BDSM Porn audio – FetishMegaStore"*/}
                            {/*            onMouseEnter={() => handleMouseEnter(v.id)}*/}
                            {/*        />*/}
                            {/*    )}*/}
                            {/*</Link>*/}


                            <a
                                href={route("audio.single.page", {
                                    id: v.slug,
                                })}
                                //href="javascript:void(0)"
                                onClick={(e) => handleLinkClick(e, route("audio.single.page", {id: v.slug}))}

                            >
                                {hovered[v.id] && v.videoGIF ? (
                                    <img
                                        src={`/${v.videoGIF}`}
                                        className="hovered-gif thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"
                                        alt="Any Fetish Porn and Extreme XXX Porn Site – FetishMegaStore"
                                        onMouseLeave={() => handleMouseLeave(v.id)}
                                    />
                                ) : (
                                    <img
                                        src={`/${v.thumbnail}`}
                                        className="thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"
                                        alt="Watch Free Fetish and BDSM Porn Audio – FetishMegaStore"
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
                                        <MdGeneratingTokens className="h-4 w-4 mr-1"/>
                                        {v.price}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="inline-flex items-center">
                            <div className="w-10 flex-shrink-0 mr-2">
                                {/* <Link
                                    href={route("channel", {
                                        user: v.streamer.username,
                                    })}
                                >
                                    <img
                                        src={v.streamer.profile_picture}
                                        className="w-10 h-10 rounded-full"
                                    />
                                </Link> */}
                                <Link
                                        href={v.streamer ? route("channel", { user: v.streamer.username }) : "#"} // Check if v.streamer exists
                                    >
                                        {v.streamer && v.streamer.profile_picture ? ( // Check if v.streamer exists and has a profile_picture
                                            <img
                                                src={`/${v.streamer.profile_picture}`}
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
                                    {/*<Link*/}
                                    {/*    href={route("video.single.page", {*/}
                                    {/*        id: v.id,*/}
                                    {/*    })}*/}
                                    {/*>*/}
                                    {/*    {v.title}*/}
                                    {/*</Link>*/}


                                    <a
                                        className="font-semibold  dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400"
                                         //href="javascript:void(0)"
                                        href={route("audio.single.page", {
                                            id: v.slug,
                                        })}
                                        onClick={(e) => handleLinkClick(e, route("audio.single.page", {id: v.slug}))}
                                    >
                                        {v.title_en}
                                    </a>

                                    {/*<Link*/}
                                    {/*    data-tooltip-content={v.title}*/}
                                    {/*    data-tooltip-id={`tooltip-${v.id}`}*/}
                                    {/*    onClick={(e) => playModal(e, v)}*/}
                                    {/*    className="font-semibold  dark:text-gray-100 hover:text-gray-800 text-gray-600 dark:hover:text-gray-400"*/}
                                    {/*>*/}
                                    {/*    {v.title}*/}
                                    {/*</Link>*/}
                                </div>

                                <div
                                    className="mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-200"></div>

                                <div className="mt-1.5 mb-1 flex items-center text-xs text-gray-500 dark:text-gray-200">
                                    <div>
                                        {/* <Link
                                            href={route("channel", {
                                                user: v.streamer.username,
                                            })}
                                        >
                                            @{v.streamer.username}
                                        </Link> */}

                                    <Link
                                        href={v.streamer ? route("channel", { user: v.streamer.username }) : "#"} // Check if v.streamer exists
                                    >
                                        {v.streamer && v.streamer.profile_picture ? ( // Check if v.streamer exists and has a profile_picture
                                            <img
                                                src={`/${v.streamer.profile_picture}`}
                                                className="w-10 h-10 rounded-full"
                                                alt={v.streamer.username || "Streamer profile"} // Fallback alt text
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300" /> // Fallback if no profile picture
                                        )}
                                    </Link>
                                        <Tooltip anchorSelect="a"/>
                                    </div>
                                    <div className="inline-flex items-center ml-2">
                                        <BsTagFill className="mr-0.5"/>
                                        {v.categoryNames}
                                    </div>
                                    <div className="inline-flex items-center ml-2">
                                        <BsEyeFill className="mr-0.5"/>
                                        {v?.views}
                                    </div>
                                    {/*<div className="ml-2 inline-flex items-center">*/}
                                    {/*    <AiOutlineEye className="w-4 h-4 mr-0.5" />*/}

                                    {/*    {v.views === 1*/}
                                    {/*        ? __("1 view")*/}
                                    {/*        : __(":viewsCount views", {*/}
                                    {/*              viewsCount: v.views,*/}
                                    {/*          })}*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </>
    );
}
