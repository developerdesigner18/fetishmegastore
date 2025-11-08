import React, {useRef, useState, useEffect} from "react";
import {Head, usePage, Link} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import {FcEmptyFilter} from "react-icons/fc/index.js";
import {Inertia} from "@inertiajs/inertia";
import CategoryLoop from "@/Components/CategoryLoop";
import ModelLoop from "@/Components/ModelLoop";
import Spinner from "@/Components/Spinner";
import ShareLink from "@/Pages/Videos/ShareLink";
import Modal from "@/Components/Modal";
import Front from "@/Layouts/Front";
import TextInput from "@/Components/TextInput";
import {IoMdFunnel} from "react-icons/io/index.js";
import {Pagination} from 'antd';
import {BsTagFill, BsFillTagsFill, BsShare} from "react-icons/bs/index.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VideosLoop from "./Videos/Partials/VideosLoop";

export default function Blogs({blog, exploreImage, videos, blocks}) { // Add videos and blocks as props
    const settings = {
        dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1
    };

    const data = blog;

    const shadowRootRef = useRef(null);
    const [link, setLink] = useState(false);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        const shadowRoot = shadowRootRef.current.attachShadow({mode: 'open'});
        const content = document.createElement('div');
        content.innerHTML = blog.description;

        // Append the content with its inline styles
        shadowRoot.appendChild(content);
    }, [data.description]);

    const openSharingModal = (e, link) => {
        e.preventDefault();
        setLink(link);
        setModal(true);
    };

    return (
        <Front
            containerClass="w-full"
            extraHeader={true}
            extraHeaderTitle={data.title}
            extraHeaderImage={data.imageUrl}
            extraImageHeight={"h-14"}
        >
            <Head title={data.title}/>
            <Modal show={modal} onClose={() => setModal(false)}>
                {link && <ShareLink link={link} inModal={true}/>}
            </Modal>
            <div>
                <div className="flex flex-wrap text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                    <BsTagFill className="w-3"/>
                    {data?.categoryDetails?.map((category, index) => (
                        <Link
                            href={route("category", {
                                id: category.slug,
                            })}
                            key={`category-${index}`}
                            className="text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                        >
                            <span>{category.category}{index !== data.categoryDetails.length - 1 && ', '}</span>
                        </Link>
                    ))}
                </div>
                <div className="flex flex-wrap text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                    <BsFillTagsFill className="w-3"/>
                    {data?.tagsDetails?.map((tag, index) => (
                        <Link
                            href={route("tag", {
                                id: tag.slug,
                            })}
                            key={`tag-${index}`}
                            className="text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                        >
                            <span>{tag.name}{index !== data.tagsDetails.length - 1 && ', '}</span>
                        </Link>
                    ))}
                </div>

                <div
                    className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                    onClick={(e) => openSharingModal(e, document.URL)}
                >
                    <BsShare className="w-4 h-4 mr-1"/>
                    {__("Share")}
                </div>
            </div>

            <div ref={shadowRootRef}/>

            {/* Add Videos Section */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold dark:text-white mb-5">
                    {__("Related Videos")}
                </h2>
                {Array.isArray(videos) && videos.length > 0 ? (
                    <VideosLoop videos={videos.slice(0, 10)} blocks={blocks} />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No videos found</p>
                )}
            </div>



        </Front>
    );
}
