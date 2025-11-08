import React, {useEffect, useRef, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ShortVideosLoop from "./Partials/ShortVideosLoop";
import {Head, Link, useForm, usePage} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import {BsTagFill, BsFillTagsFill, BsShare, BsHeart, BsHeartFill, BsEyeFill} from "react-icons/bs/index.js";
import {AiOutlineEye} from "react-icons/ai/index.js";
import {FcUnlock, FcEmptyFilter} from "react-icons/fc/index.js";
import Spinner from "@/Components/Spinner";
import PrimaryButton from "@/Components/PrimaryButton";
import {toast} from 'react-toastify';
import {MdGeneratingTokens, MdVideoLibrary, MdOutlinePeople} from "react-icons/md/index.js";
import { CgGirl } from "react-icons/cg";
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
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import AdBar from "@/Components/AdBar";

// const VideoComponent = ({ video, relatedvideos, inModal }) => {
const VideoComponent = ({video, url,slug ,inModal,auth,seo}) => {
    // const videoRef = useRef(null);
    const [duration, setDuration] = useState()
    const [link, setLink] = useState(false);
    const [modal, setModal] = useState(false);
    const [freeShow, setFreeShow] = useState(false);
    const [downloadError, setDownloadError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showLimitPopup, setShowLimitPopup] = useState(false);

    const { props } = usePage(); // inertia.js
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupMessage1, setPopupMessage1] = useState("");
    const isAuthenticated = props.auth?.user !== null;
    const canBePlayed = video.canBePlayed;



    const openSharigModal = (e, link) => {
        e.preventDefault();
        setLink(link);
        setModal(true);
    };

        useEffect(() => {
            if (props.popupMessage1) {
                setPopupMessage1(props.popupMessage1);
                setShowPopup(true);
            }
        }, [props.popupMessage1]);


    useEffect(() => {
        if (auth?.user && !video.canBePlayed && video.popupMessage) {
            setShowLimitPopup(true);
        }
    }, [video]);

    const handleClosePopup = () => {
        setShowLimitPopup(false);
        // Redirect to gallery index or fallback page

        window.location.href = route('gallery.browse'); // or use route('gallery.index') if route helper is available
    };

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

    return (
        <>
            <Modal show={modal} onClose={() => setModal(false)}>
                {link && <ShareLink link={link} inModal={true} />}
            </Modal>

            {popupMessage1 && showPopup && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white px-8 pt-12 pb-12 rounded-lg shadow-lg max-w-xl w-full text-center min-h-[400px] min-w-[800px] flex flex-col justify-center relative">
            
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
            <p className="mb-8 text-lg">{popupMessage1}</p>

            <Link
                href={route('token.packages')}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold text-lg mx-auto"
            >
                Purchase Token Packs
            </Link>
        </div>
    </div>
            )}



            <Modal show={showLimitPopup} onClose={() => handleClosePopup()}>
                <div className="p-6 text-center relative">
                    {/* Close button */}
                    <button
                        onClick={() => handleClosePopup()}
                        className="absolute top-2 right-2 text-gray-500 text-lg"
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    <h2 className="text-xl font-semibold text-red-600 mb-4">
                        {video.popupMessage}
                    </h2>
                    <p className="text-gray-700 mb-6">
                        You’ve used your free previews for today. Please purchase tokens to continue.
                    </p>
                     <Link
                        className="bg-violet-600 p-1.5 rounded-lg border-violet-600 font-semibold px-4 text-zinc-200 hover:bg-violet-500"
                        onClick={() => {
                            setShowLimitPopup(false);
                            Inertia.visit(route('tokens.index')); // ✅ Update this route as needed
                        }}
                    >
                        Buy Tokens
                     </Link>
                </div>
            </Modal>


            <div className={`justify-center w-full ${inModal ? "p-3" : "p-0"}`}>
                <div className="flex items-start">
                    <div>
                        <h3 className="text-lg md:text-2xl font-light dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                            {video.title}
                        </h3>

                        <div className="flex items-center flex-wrap md:space-x-2 mt-1">
                            {/* Categories */}
                            <div className="text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                                <BsTagFill className="w-3" />
                                {video?.categoryDetails?.map((category, index) => (
                                    <Link
                                        key={category.slug}
                                        href={route("category", { id: category.slug })}
                                        className="mr-2"
                                    >
                                        <span>{category.category}{index !== video.categoryDetails.length - 1 && ','}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm contents">
                                <BsFillTagsFill className="w-3" />
                                {video?.tagsDetails?.map((tag, index) => (
                                    <Link
                                        key={tag.slug}
                                        href={route("tag", { id: tag.slug })}
                                        className="mr-2"
                                    >
                                        <span>{tag.name}{index !== video.tagsDetails.length - 1 && ','}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Models */}
                            <div className="text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                                <CgGirl className="w-3" />
                                {video?.modelDetails?.map((model, index) => (
                                    <Link
                                        key={model.slug}
                                        href={route("model", { id: model.slug })}
                                        className="mr-2"
                                    >
                                        <span>{model.name}{index !== video.modelDetails.length - 1 && ','}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Share Button */}
                            <div
                                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                                onClick={(e) => openSharigModal(e, document.URL)}
                            >
                                <BsShare className="w-4 h-4 mr-1" />
                                Share
                            </div>

                            <div className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer" >
                                <BsEyeFill style={{ color: "red" }} className="w-4 h-4 mr-1" />
                                <span>{ video?.views }</span>
                            </div>

                            {/* Get Full Video Link */}
                            {slug && (
                                <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-yellow-300 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer">
                                    <Link
                                        href={route("video.single.page", { id: slug })}
                                        className="text-gray-600 mr-2"
                                    >
                                        <span>Get Full Video</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gallery Display */}
                <div className="mt-5 flex justify-center">
                    {!auth?.user ? (
                        // User not logged in - show blur image and login prompt
                        <div>
                            <img
                                src={video.thumbnail}
                                alt="Thumbnail"
                                className="rounded-lg filter blur-sm max-w-md w-full"
                            />

                            <div className="mt-4 text-center">
                                <Link
                                    href={route('login')}
                                    className="bg-violet-600 p-1.5 rounded-lg border-violet-600 font-semibold px-4 text-zinc-200 hover:bg-violet-500"
                                >
                                    Login to Watch more from this gallery
                                </Link>
                            </div>
                        </div>

                    ) : video.canBePlayed ? (
                        <ImageGallery items={video.imageGallery} />
                    ) : (
                        // Locked gallery with unlock option
                        <div className="relative">
                            <img
                                src={video.thumbnail}
                                alt=""
                                className="rounded-lg w-full"
                            />
                            <div className="absolute top-0 left-0 text-center bg-gray-700 w-full h-full bg-opacity-25 rounded-lg">
                                <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center">
                                    <div className="bg-white inline-flex bg-opacity-25 rounded-full p-2">
                                        <FcUnlock className="w-12 h-12" />
                                    </div>
                                    <PrimaryButton
                                        className="h-12 mt-5 inline-flex"
                                        onClick={() =>
                                            Inertia.visit(
                                                route("gallery.unlock", {
                                                    video: video.id,
                                                })
                                            )
                                        }
                                    >
                                        <MdGeneratingTokens className="mr-2 w-6 h-6 md:w-8 md:h-8" />
                                        Unlock with {video.price} tokens
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                    {video.description}
                </p>

                <div className="mt-3">
                    <AdBar />
                </div>
            </div>
            
        </>
    );
};

// export default function SingleGallery({video, url,slug ,inModal = false,}) {
//     // console.log('relatedvideos', relatedvideos)
//     if (inModal) {
//         return <VideoComponent video={video} url={url} inModal={true}/>;
//     } else {
//         return (
//             <AuthenticatedLayout>
//                 <Head title={video.title}/>
//                 <VideoComponent video={video} url={url} slug={slug} inModal={false}/>
//             </AuthenticatedLayout>
//         );
//     }
// }

export default function SingleGallery({ video, url, slug, inModal = false, auth }) {
    if (inModal) {
        return <VideoComponent video={video} url={url} inModal={true} auth={auth} />;
    } else {
        return (
            <AuthenticatedLayout>
                <Head title={video.title} />
                <VideoComponent video={video} url={url} slug={slug} inModal={false} auth={auth} />
            </AuthenticatedLayout>
        );
    }
}

