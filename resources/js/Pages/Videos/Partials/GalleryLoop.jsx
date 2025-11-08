import __ from "@/Functions/Translate";
import {Link} from "@inertiajs/inertia-react";
import {Tooltip} from "react-tooltip";
import {MdGeneratingTokens} from "react-icons/md/index.js";
import "react-tooltip/dist/react-tooltip.css";
import {AiOutlineEye} from "react-icons/ai/index.js";
import Modal from "@/Components/Modal";
import SingleVideo from "../SingleVideo";
import {useState, useEffect} from "react";
import {BsTagFill, BsEyeFill} from "react-icons/bs/index.js";
import {IoIosPricetags} from "react-icons/io";
import {CgGirl} from "react-icons/cg";
import Loader from '@/Components/Loader'; // Import your loader component

export default function GalleryLoop({videos}) {
    const [playVideo, setPlayVideo] = useState(false);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const playModal = (e, video) => {
        e.preventDefault();
        setPlayVideo(video);
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

    return (<>
        {loading && <Loader/>}
        <Modal show={modal} onClose={(e) => setModal(false)}>
            {playVideo && <SingleVideo video={playVideo} inModal={true}/>}
        </Modal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {videos?.map((v, index) => {
                return (
                    <div
                        className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900"
                        key={`vid-${v.id}`}
                    >
                        <div className="relative">
                            {/*single.gallery*/}
                            <a
                                href={route("single.gallery", {
                                    slug: v.slug,
                                })}
                                onClick={(e) => handleLinkClick(e, route("single.gallery", { slug: v.slug }))}
                            >
                                <img
                                    src={v.thumbnail}
                                    className="thumbnail-image rounded-tl-lg rounded-tr-lg mb-3 h-[181px] w-full"
                                    alt="Gallery thumbnail"
                                />
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
                        <div className="px-3 py-2">
                            <div className="h-auto">
                                <a
                                    className="font-semibold dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400 block break-words whitespace-normal"
                                    href={route("single.gallery", {
                                        slug: v.slug,
                                    })}
                                    onClick={(e) => handleLinkClick(e, route("single.gallery", { slug: v.slug }))}
                                >
                                    {v.title}
                                </a>
                            </div>

                            <div
                                className="mt-1.5 mb-1 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-200 space-y-2">
                                <div className="inline-flex items-center w-full">
                                    <BsTagFill className="mr-0.5 text-base"/> {/* Adjusted icon size */}
                                    <span className="break-words whitespace-normal">{v.categoryNames}</span>
                                </div>

                                <div className="inline-flex items-center w-full">
                                    <BsEyeFill className="mr-0.5"/>
                                    {v?.views}
                                </div>
                                <div className="inline-flex items-center w-full">
                                    <IoIosPricetags className="mr-0.5 text-base"/> {/* Adjusted icon size */}
                                    <span className="break-words whitespace-normal">{v.tagNames}</span>
                                </div>

                                <div className="inline-flex items-center w-full">
                                    <CgGirl className="mr-0.5 text-base"/> {/* Adjusted icon size */}
                                    <span className="break-words whitespace-normal">{v.modelNames}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>


    </>);
}
