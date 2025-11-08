import React, { useEffect, useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ShortVideosLoop from "./Partials/ShortVideosLoop";
import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import { BsTagFill, BsFillTagsFill, BsShare, BsHeart, BsHeartFill, BsEyeFill } from "react-icons/bs/index.js";
import { AiOutlineEye } from "react-icons/ai/index.js";
import { FcUnlock, FcEmptyFilter } from "react-icons/fc/index.js";
import Spinner from "@/Components/Spinner";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from 'react-toastify';
import { MdGeneratingTokens, MdVideoLibrary, MdOutlinePeople } from "react-icons/md/index.js";
import { CgGirl } from "react-icons/cg";
import axios from "axios";
import { FaGrinStars } from "react-icons/fa/index.js";
import SecondaryButton from "@/Components/SecondaryButton";
import debounce from "lodash.debounce";
import Modal from "@/Components/Modal";
import ShareLink from "./ShareLink";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SubscribePopup from "../Channel/Partials/SubscribePopup";
import InputError from "@/Components/InputError";
import Textarea from "@/Components/Textarea";
import { Inertia } from "@inertiajs/inertia";
import Plyr from "plyr-react"
import "plyr-react/plyr.css"
import AdBar from "@/Components/AdBar";
//import { usePage } from '@inertiajs/react';

// const VideoComponent = ({ video, relatedvideos, inModal }) => {
const VideoComponent = ({ video, relatedvideos, url, slug, inModal, seo }) => {
    // const videoRef = useRef(null);
    const [duration, setDuration] = useState()
    const [link, setLink] = useState(false);
    const [modal, setModal] = useState(false);
    const [freeShow, setFreeShow] = useState(false);
    const [downloadError, setDownloadError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [viewIncreased, setViewIncreased] = useState(false);

    const [adVideoUrl, setAdVideoUrl] = useState(null);
    const [clickThroughUrl, setClickThroughUrl] = useState(null); // State for ClickThrough URL
    // const [showMainVideo, setShowMainVideo] = useState(false);
    const [showMainVideo, setShowMainVideo] = useState(true);
    const [skipButtonVisible, setSkipButtonVisible] = useState(false);
    const [countdown, setCountdown] = useState(5); // Countdown timer state

    const adTagUrl = 'https://ptwmcd.com/vast/v3?psid=6camgirl&ms_notrack=1&psprogram=revs&site=jasmin&categoryName=fetish&cobrandid=&campaign_id=&subAffId={SUBAFFID}';
    const mainVideoUrl = video.video; // Replace with your main video URL
    const { props } = usePage();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const isAuthenticated = props.auth?.user !== null;
    const canBePlayed = video.canBePlayed;

    useEffect(() => {
        handleIncreaseViews();
        if (props.popupMessage) {
            setPopupMessage(props.popupMessage);
            setShowPopup(true);
        }
    }, [props.popupMessage]);

    <Head title={video.title}>
        <meta name="keywords" content={seo?.meta_keyword || ''} />
        <meta name="description" content={seo?.desc || ''} />
        <meta name="robots" content={seo?.meta_robot || 'index,follow'} />

        <meta property="og:title" content={seo?.og_title || video.title} />
        <meta property="og:description" content={seo?.og_desc || ''} />
        <meta property="og:image" content={seo?.og_image_url || ''} />
        <meta property="og:url" content={seo?.cust_url || ''} />

        {seo?.json_id && (
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "VideoObject",
                    "identifier": seo?.json_id,
                    "name": seo?.og_title || video.title,
                    "description": seo?.desc || '',
                    "thumbnailUrl": seo?.og_image_url || '',
                    "uploadDate": video.uploadDate || '', // optional if you have
                    "contentUrl": window.location.href,
                })}
            </script>
        )}
    </Head>

    const mainVideoSrc = {
        type: 'video',
        autoplay: true,
        sources: [
            {
                src: mainVideoUrl,
                type: 'video/mp4',
                size: 720,
            },
        ],
    };

    // Styling for the video container
    const videoContainerStyle = {
        position: 'relative',
        width: '100%',
        maxWidth: '720px',
        margin: 'auto',
    };

    // Styling for the countdown message
    const countdownStyle = {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        fontSize: '16px',
    };

    // Styling for the skip button (overlayed on top of the player)
    const skipButtonStyle = {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const handleDownload = async () => {
        setLoading(true); // Start the loading spinner
        setDownloadError(null); // Reset any previous errors

        try {
            // Call the API using video.slug
            const response = await axios.post(route("video.download"), { slug: video.slug });

            // Check if the API returned a successful status
            if (response.data.status === 1) {
                // Fetch the video file as a Blob
                const downloadLink = response.data.link;

                const res = await fetch(downloadLink, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/octet-stream', // Ensure it's treated as a binary file
                    },
                });

                // Convert response to Blob
                const blob = await res.blob();

                // Create an object URL from the blob
                const url = window.URL.createObjectURL(blob);

                // Create a temporary anchor element to trigger the download
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${video.slug}.mp4`); // Set file name with video slug

                // Append anchor to the body
                document.body.appendChild(link);

                // Trigger the download
                link.click();

                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                // Handle error if video is not downloadable
                setDownloadError(response.data.message);
            }
        } catch (error) {
            setDownloadError("An error occurred while downloading the video.");
        } finally {
            setLoading(false); // Stop the loading spinner when the process is done
        }
    };

    const openSharigModal = (e, link) => {
        e.preventDefault();
        setLink(link);
        setModal(true);
    };

    const videoRef = useRef(null);

    const videoSrc = {
        type: "video",
        autoplay: true,
        sources: [
            {
                src: video.video,
                type: 'video/mp4',
                size: 720,
            },
        ]
    };

    const handleIncreaseViews = () => {
        axios.post(route("video.increaseShortViews", { shortVideo: video.id }))
            .then(() => {
                console.log(`Views increased for ${video.type} ID:`, video.id);
                setViewIncreased(true);
            })
            .catch(error => {
                console.error("Error increasing views:", error);
            });
    };

    return (
        <>
            <Modal show={modal} onClose={(e) => setModal(false)}>
                {link && <ShareLink link={link} inModal={true} />}
            </Modal>

            {isAuthenticated && showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white px-8 pt-12 pb-12 rounded-lg shadow-lg max-w-xl w-full text-center min-h-[400px] min-w-[800px] flex flex-col justify-center relative">

                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowPopup(false);
                                window.location.href = '/';
                            }}
                            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold mb-6">Notice</h2>
                        <p className="mb-8 text-lg">{popupMessage}</p>

                        <Link
                            href={route('token.packages')}
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold text-lg mx-auto"
                        >
                            Purchase Token Packs
                        </Link>
                    </div>
                </div>
            )}

            <div className={`justify-center w-full ${inModal ? "p-3" : "p-0"}`}>
                <div className="flex items-start">
                    <div>
                        <h3 className="text-lg md:text-2xl font-light dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                            {video.title}
                        </h3>
                        <div className="flex items-center flex-wrap md:space-x-2 mt-1">

                            <div
                                className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                                <BsTagFill className="w-3" />
                                {/*<span>{video.categoryNames}</span>*/}
                                {video?.categoryDetails?.map((category, index) => (
                                    <Link
                                        href={route("category", {
                                            id: category.slug,
                                        })}
                                        className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                                    >
                                        <span>{category.category} {index !== video.categoryDetails.length - 1 && ', '}</span>
                                    </Link>
                                ))}
                            </div>

                            <div
                                className="flex flex-wrap text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm contents">
                                <BsFillTagsFill className="w-3" />
                                {video?.tagsDetails?.map((tag, index) => (
                                    <Link
                                        href={route("tag", {
                                            id: tag.slug,
                                        })}
                                        className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                                    > <span>{tag.name} {index !== video.tagsDetails.length - 1 && ', '}</span>
                                    </Link>
                                ))}
                            </div>

                            <div
                                className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                                <CgGirl className="w-3" />
                                {video?.modelDetails?.map((category, index) => (
                                    <Link
                                        href={route("model", {
                                            id: category.slug,
                                        })}
                                        className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                                    >
                                        <span>{category.name} {index !== video.categoryDetails.length - 1 && ', '}</span>
                                    </Link>
                                ))}
                            </div>

                            <div
                                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                                // onClick={handleCopyUrl}
                                onClick={(e) => openSharigModal(e, document.URL)}
                            >
                                <BsShare className="w-4 h-4 mr-1" />
                                {__("Share ")}
                            </div>
                            
                            <div className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer" >
                                <BsEyeFill style={{ color: "red" }} className="w-4 h-4 mr-1" />
                                <span>{ video?.views }</span>
                            </div>

                            {slug && (
                                <div
                                    className="mt-1 md:mt-0 inline-flex items-center text-sm bg-yellow-300 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer">
                                    <Link
                                        href={route("video.single.page", {
                                            id: slug,
                                        })}
                                        className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                                    >
                                        <span>{__('Get Full Video')}</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-5" style={{ maxWidth: '720px', margin: 'auto' }}>
                    {isAuthenticated ? (
                        video.canBePlayed ? (
                            <>
                                <Plyr
                                    source={mainVideoSrc}
                                    options={{ controls: ['play-large', 'play', 'progress', 'current-time']}}
                                />
                            </>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden w-full">
                                <img
                                    src={video.video || "/images/access-denied.gif"} // video GIF or fallback
                                    alt="Video preview"
                                    className="w-full rounded-lg"
                                    style={{ maxHeight: '405px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/default-thumbnail.jpg";
                                    }}
                                />
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white p-4 text-center"
                                    style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                >
                                    <h2 className="text-xl font-bold mb-2">{__("Video Locked")}</h2>
                                    {video.price > 0 ? (
                                        <PrimaryButton
                                            onClick={() => Inertia.visit(route("video.unlock", { video: video.id }))}
                                            className="mb-3"
                                        >
                                            {__("Unlock with")} {video.price} {__("Tokens")}
                                        </PrimaryButton>
                                    ) : (
                                        <p className="mb-3">{__("You've reached your free watch limit today.")}</p>
                                    )}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="relative rounded-lg overflow-hidden w-full">
                            <img
                                src={video.video || "/images/access-denied.gif"} // show GIF or Thumbnail for non-logged-in user
                                alt="Login to watch preview"
                                className="w-full rounded-lg"
                                style={{ maxHeight: '405px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = video.thumbnail || "/default-thumbnail.jpg"; // Fallback to video thumbnail
                                }}
                            />
                            <div
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white p-4 text-center"
                                style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                            >
                                <h2 className="text-xl font-bold mb-2">{__("Please log in to watch the full video")}</h2>
                                <div className="flex space-x-4 justify-center">
                                    <Link
                                        href={route('login')}
                                        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-semibold"
                                    >
                                        {__("Login")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/*<ReactPlayer url='https://www.youtube.com/watch?v=y0r0KaML_4M' />*/}

                <div
                    className="mt-5 dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                    {video.description ? video.description : ''}
                </div>
            </div>
            <div className="mt-3">
                <AdBar />
            </div>
        </>
    );
};

const RelatedVideoComponent = ({ relatedvideos }) => {

    const [nextUrl, setNextUrl] = useState("")
    const [spinner, setSpinner] = useState(false);
    const [videos, setVideos] = useState("")

    useEffect(() => {
        setVideos(relatedvideos.data)
        setNextUrl(relatedvideos.next_page_url)
    }, [])

    const handleLoadNewVideos = async (next_page_url) => {
        setSpinner(true);
        // console.log(next_page_url,'next_page_url')
        try {
            const res = await axios.get(next_page_url)
            // console.log(res,'data//////')
            setVideos([...videos, ...res.data.data])
            setNextUrl(res.data.next_page_url)
            // console.log(videos,'video====')
            setSpinner(false);
        } catch (error) {
            console.log(error)
        }
        //
        // Inertia.reload(next_page_url,)
        // setLoading(true);

        // Inertia.reload(next_page_url,
        //     only: ["relatedvideos"],
        //     onFinish: () => setLoading(false),
        // });
    }

    // console.log(videos,'videossssssssssssss',relatedvideos.data)
    // console.log(relatedvideos.next_page_url, 'url==================q')

    return (
        <div>
            <div className={`flex justify-start items-center mt-20 mb-8`}>
                <MdVideoLibrary className="text-pink-600 text-4xl mr-1" />
                <h2 className="text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold">
                    {__("Related Videos")}
                </h2>
            </div>

            <div className="mt-5 mb-5">
                {relatedvideos.total === 0 && (
                    <div
                        className="text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center">
                        <FcEmptyFilter className="w-12 h-12 mr-2" />
                        {__("No videos to show")}
                    </div>
                )}
                {videos.length > 0 && <ShortVideosLoop videos={videos} />}

                {relatedvideos.last_page > 1 && (
                    <>
                        {spinner ? (
                            <div className="my-3">
                                <Spinner />
                            </div>
                        ) :
                            <SecondaryButton className="mt-2"
                                processing={relatedvideos.next_page_url ? false : true}
                                onClick={() => handleLoadNewVideos(nextUrl)}
                            >

                                {__("Load More")}
                            </SecondaryButton>
                        }

                    </>
                )}

            </div>

        </div>
    );
};

export default function SingleVideo({ video, relatedvideos, url, slug, popupMessage = null, inModal = false }) {
    const { props } = usePage();
    const loggedInUser = props.auth?.user;

    const seoDetails = video.seoDetails;
    if (inModal) {
        return <VideoComponent video={video} relatedvideos={relatedvideos} url={url} inModal={true} popupMessage={popupMessage} />;
    } else {
        return (
            <AuthenticatedLayout>
                <Head title={video.title} />
                <VideoComponent video={video} relatedvideos={relatedvideos} url={url} slug={slug} inModal={false} popupMessage={popupMessage} />
                <RelatedVideoComponent relatedvideos={relatedvideos} />
            </AuthenticatedLayout>
        );
    }
}