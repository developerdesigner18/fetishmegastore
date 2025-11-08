import React, {useEffect, useRef, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import VideosLoop from "./Partials/VideosLoop";
import {Head, Link, useForm} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import {BsTagFill, BsFillTagsFill, BsShare, BsHeart, BsHeartFill} from "react-icons/bs/index.js";
import {AiOutlineEye} from "react-icons/ai/index.js";
import {FcUnlock, FcEmptyFilter} from "react-icons/fc/index.js";
import Spinner from "@/Components/Spinner";
import PrimaryButton from "@/Components/PrimaryButton";
import {toast} from 'react-toastify';
import {MdGeneratingTokens, MdVideoLibrary, MdOutlinePeople} from "react-icons/md/index.js";
import axios from "axios";
import {FaGrinStars} from "react-icons/fa/index.js";
import SecondaryButton from "@/Components/SecondaryButton";
import debounce from "lodash.debounce";
import Modal from "@/Components/Modal";
import ShareLink from "./ShareLink";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SubscribePopup from "../Channel/Partials/SubscribePopup";
import InputError from "@/Components/InputError";
import Textarea from "@/Components/Textarea";
import {Inertia} from "@inertiajs/inertia";
import Plyr from "plyr-react"
import "plyr-react/plyr.css"

// const VideoComponent = ({ video, relatedvideos, inModal }) => {
const VideoComponent = ({video, relatedvideos, url, inModal}) => {
    // const videoRef = useRef(null);
    const [duration, setDuration] = useState()
    const [link, setLink] = useState(false);
    const [modal, setModal] = useState(false);
    const [freeShow, setFreeShow] = useState(false);
    const [favourite, setFavourite] = useState(video.isUserFavorite)
    const [downloadError, setDownloadError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [downloadMessage, setDownloadMessage] = useState("");
    const handleDownload = async () => {
        setLoading(true); // Start the loading spinner
        setDownloadError(null); // Reset any previous errors

        try {
            console.log("Download request started...");
            const response = await axios.post(route("video.download"), { slug: video.slug });
            
            // Check if the API returned a successful status
            if (response.data.status === 1) {
                setDownloadMessage("Download will start in sometime...please wait.");
                // Fetch the video file as a Blob
                const downloadLink = response.data.link;

                console.log("Download URL:", downloadLink);

                /* const res = await fetch(downloadLink, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/octet-stream', // Ensure it's treated as a binary file
                    },
                });

                // Convert response to Blob
                const blob = await res.blob();

                // Create an object URL from the blob
                const url = window.URL.createObjectURL(blob); */

                const res = await fetch(downloadLink);
                const blob = await res.blob();
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
            console.error("Download error:", error);
            setDownloadError("An error occurred while downloading the video.");
        } finally {
            setLoading(false); // Stop the loading spinner when the process is done
        }
    };



    // const handleCopyUrl = () => {
    //     // let url = navigator.clipboard.writeText(url);
    //     let url2 = document.URL;
    //     console.log(url2)
    //     toast.success("Link copied successfully");
    // };

    // console.log('isCurrentSubscriber', video.isCurrentSubscriber)
    // console.log('canBePlayed', video.canBePlayed)

    const openSharigModal = (e, link) => {
        e.preventDefault();
        setLink(link);
        setModal(true);
    };

    const addToFav = () => {
        setFavourite(true)
        axios.post(route("video.addToFavorite", {id: video.id}));
    };

    const removeFromFav = () => {
        setFavourite(false)
        axios.post(route("video.removeFromFavorite", {id: video.id}));
    };
    const increaseViews = () => {
        axios.post(route("video.increaseViews", {video: video.id}));
    };
    const videoRef = useRef(null);
    const videoSrc = {
        type: "video",
        autoplay: true,
        sources: [
            {
                src: video.videoUrl,
                type: 'video/mp4',
                size: 720,
            },
            {
                src: video.videoUrl360p ?? video.videoUrl,
                type: 'video/mp4',
                size: 360,
            }
        ]
    };



    return (
        <>
            <Modal show={modal} onClose={(e) => setModal(false)}>
                {link && <ShareLink link={link} inModal={true}/>}
            </Modal>

            <div className={`justify-center w-full ${inModal ? "p-3" : "p-0"}`}>
                <div className="flex items-start">
                    <div className="mr-5 flex flex-col items-center flex-shrink-0">
                        <Link
                            href={route("channel", {
                                user: video.streamer.username,
                            })}
                        >
                            <img
                                src={video.streamer.profile_picture}
                                className="w-14 h-14 rounded-full"
                            />
                        </Link>
                    </div>
                    <div>
                        <h3 className="text-lg md:text-2xl font-light dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                            {video.title}
                        </h3>

                        <div className="flex items-center flex-wrap md:space-x-2 mt-1">
                            <Link
                                href={route("channel", {
                                    user: video.streamer.username,
                                })}
                                className="text-sm text-gray-600 mr-2  dark:text-white"
                            >
                                @{video.streamer.username}
                            </Link>


                            {video.selectedCategory?.map((category, index) => (
                                <Link
                                    href={route("videos.browse", {
                                        videocategory: category.value,
                                        slug: `-${category.label}`,
                                    })}
                                    className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                                >
                                    <BsTagFill className="w-3"/>
                                    <span>{category.label}</span>
                                </Link>
                            ))}
                            <BsFillTagsFill className="w-3"/>
                            <span>
                                {video?.tags?.map((tag, index) => (
                                    <Link
                                        href={route("tag", {
                                            id: tag.id
                                            ,
                                        })}
                                        className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                                    > <span>{tag.name} {index !== video.tags.length - 1 && ', '}</span>
                                    </Link>
                                ))}
                            </span>


                            {video.free_for_subs === "yes" && video.price !== 0 && (
                                <div
                                    className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                    <FaGrinStars className="w-4 h-4 mr-1"/>
                                    {__("Free For Subscribers")}
                                </div>
                            )}

                          

                            {video.canDownload && (
                                <div
                                    className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">

                                    <button
                                        onClick={handleDownload}
                                        className="relative flex items-center justify-center"
                                        disabled={loading} // Disable the button while loading
                                    >
                                        {loading ? (
                                            // Show loader when loading is true
                                            <span className="loader"></span> // You can replace this with your actual loader component
                                        ) : (
                                            __("Download")
                                        )}
                                    </button>
                                </div>
                            )}
                            {/* Display the message once the download request is successful */}
                            {downloadMessage && (
                                <p className="text-gray-600 mt-2 text-sm">{downloadMessage}</p>
                            )}
                            {downloadError && <p className="text-red-500">{downloadError}</p>}

                            <div
                                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <span> {__("Duration ")} : {video.duration.minute}</span>
                            </div>

                            <div
                                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <span> {__("Resolution ")} : {video.duration.resolution}</span>
                            </div>

                            <div
                                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                                // onClick={handleCopyUrl}
                                onClick={(e) => openSharigModal(e, document.URL)}
                            >
                                <BsShare className="w-4 h-4 mr-1"/>
                                {__("Share ")}
                            </div>

                            <div
                                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <SubscribePopup
                                    user={video.streamer}
                                    userIsSubscribed={video.isCurrentSubscriber}
                                />
                            </div>

                            {/*video.isUserFavorite*/}
                            {favourite ? (
                                <div
                                    className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer"
                                    // onClick={handleCopyUrl}
                                    onClick={(e) => removeFromFav()}
                                >
                                    <BsHeartFill style={{"color": "red"}} className="w-4 h-4 mr-1"/>
                                </div>
                            ) : (
                                <div
                                    className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer"
                                    // onClick={handleCopyUrl}
                                    onClick={(e) => addToFav()}
                                >
                                    <BsHeart style={{"color": "red"}} className="w-4 h-4 mr-1"/>
                                </div>

                            )
                            }


                            {!video.canBePlayed && (
                                <div
                                    className="mt-1 md:mt-0 inline-flex items-center text-sm bg-yellow-300 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                                    onClick={(e) =>
                                        Inertia.visit(
                                            route("video.unlock", {
                                                video: video.id,
                                            })
                                        )
                                    }
                                >
                                    <MdGeneratingTokens className="w-4 h-4 mr-1"/>
                                    {__("Unlock with :tokens tokens", {
                                        tokens: video.price,
                                    })}
                                </div>

                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    {video.canBePlayed ? (
                        
                        <Plyr source={videoSrc}/>
                        
                    ) : (
                        <div className="flex flex-col items-center  md:flex-row space-y-5 md:space-y-0 md:space-x-5 "
                             style={{"justify-content": "center"}}>


                            <div className="relative">
                                <img
                                    // src={video.thumbnail}
                                    src={video.videoGIF ? video.videoGIF : video.thumbnail}
                                    alt=""
                                    className="rounded-lg w-full"
                                />

                                <div
                                    className="absolute top-0 left-0 text-center bg-gray-700 w-full h-full bg-opacity-25 rounded-lg ">
                                    <div
                                        className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center">
                                        <div className="w-full">
                                            <div className="bg-white inline-flex bg-opacity-25 rounded-full p-2">
                                                <FcUnlock className="w-12 h-12"/>
                                            </div>
                                        </div>

                                        <div>
                                            <PrimaryButton
                                                className="h-12 mt-5 inline-flex"
                                                onClick={(e) =>
                                                    Inertia.visit(
                                                        route("video.unlock", {
                                                            video: video.id,
                                                        })
                                                    )
                                                }
                                            >
                                                <MdGeneratingTokens className="mr-2 w-6 h-6 md:w-8 md:h-8"/>
                                                {__("Unlock with :tokens tokens", {
                                                    tokens: video.price,
                                                })}
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    )}
                </div>

                <div
                    className="mt-5 dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                    {video.description ? video.description : ''}
                </div>


            </div>

        </>
    );
};

const RelatedVideoComponent = ({relatedvideos}) => {

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
        
    }
 

    return (
        <div>
            <div className={`flex justify-start items-center mt-20 mb-8`}>
                <MdVideoLibrary className="text-pink-600 text-4xl mr-1"/>
                <h2 className="text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold">
                    {__("Related Videos")}
                </h2>
            </div>

            <div className="mt-5 mb-5">
                {relatedvideos.total === 0 && (
                    <div
                        className="text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center">
                        <FcEmptyFilter className="w-12 h-12 mr-2"/>
                        {__("No videos to show")}
                    </div>
                )}
                {videos.length > 0 && <VideosLoop videos={videos}/>}


                {relatedvideos.last_page > 1 && (
                    <>
                        {spinner ? (
                                <div className="my-3">
                                    <Spinner/>
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

const RequestVideoComponent = ({video}) => {

    const [spinner, setSpinner] = useState(false);

    const {data, setData, post, processing, errors, reset} = useForm({
        description: "",
        video_id: video.id
    });


    const onHandleChange = (event) => {
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    const submit = async (e) => {
        e.preventDefault();

        setSpinner(true);


        try {
            await axios({
                method: "post",
                url: route('request.video'),
                data: data,
                headers: {"Content-Type": "multipart/form-data"},
            })
                .then(function (response) {
                    //handle success
                    toast.success(response.data.message)

                })
                .catch(function (response) {
                    //handle error
                    toast.error(response)

                });

            setSpinner(false);
        } catch (error) {
            console.log(error)
        }


    };

    return (
        <>
            <div className="mt-5 mb5">
                <h3 className="text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold">
                    {__("Request Video")}
                </h3>
                <form onSubmit={submit}>

                    <div className="mb-5">
                        <InputLabel for="description" value={__("Description")}/>

                        <Textarea
                            name="description"
                            value={data.description}
                            handleChange={onHandleChange}
                            required
                            className="mt-1 block w-full"
                        />

                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex items-center justify-end mt-4">

                        {spinner ? (
                                <div className="my-3">
                                    <Spinner/>
                                </div>
                            ) :
                            <PrimaryButton
                                className="ml-4"
                                processing={processing}
                            >
                                {__("Request Video")}
                            </PrimaryButton>
                        }


                    </div>
                </form>
            </div>
        </>
    )
};

export default function SingleVideo({video, relatedvideos, url, inModal = false,}) {
    // console.log('relatedvideos', relatedvideos)
    console.log("SingleVideo rendered with inModal:", inModal);
    if (inModal) {
        
       return <VideoComponent video={video} relatedvideos={relatedvideos} url={url} inModal={true}/>;
    } else {
       
        return (
            <AuthenticatedLayout>
                <Head title={video.title}/>
                <VideoComponent video={video} relatedvideos={relatedvideos} url={url} inModal={false}/>
                <RelatedVideoComponent relatedvideos={relatedvideos}/>
                <RequestVideoComponent video={video}/>
            </AuthenticatedLayout>
        );
    }
}
