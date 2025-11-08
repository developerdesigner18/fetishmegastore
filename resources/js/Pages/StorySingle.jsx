import React, {useRef, useState, useEffect} from "react";
import {Head, usePage, Link} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import {FcEmptyFilter} from "react-icons/fc/index.js";
import {Inertia} from "@inertiajs/inertia";
import CategoryLoop from "@/Components/CategoryLoop";
import ModelLoop from "@/Components/ModelLoop";
import Spinner from "@/Components/Spinner";
import Front from "@/Layouts/Front";
import TextInput from "@/Components/TextInput";
import {IoMdFunnel} from "react-icons/io/index.js";
import {Pagination} from 'antd';
import {BsTagFill, BsFillTagsFill, BsShare, BsHeart, BsHeartFill} from "react-icons/bs/index.js";
import ShareLink from "@/Pages/Videos/ShareLink";
import Modal from "@/Components/Modal";
// import BlogSlider from "@/Components/BlogSlider"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VideosLoop from "./Videos/Partials/VideosLoop";


export default function StorySingle({blog, exploreImage, videos, blocks, seo}) {
    const settings = {
        dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1
    };

    const data = blog;

    const shadowRootRef = useRef(null);
    const [link, setLink] = useState(false);
    const [modal, setModal] = useState(false);

    const { props } = usePage(); // inertia.js
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false); 
    
     useEffect(() => {
                if (props.popupMessage) {
                    setPopupMessage(props.popupMessage);
                    setShowPopup(true);
                }
            }, [props.popupMessage]); 

    useEffect(() => {
        const shadowRoot = shadowRootRef.current.attachShadow({mode: 'open'});
        const content = document.createElement('div');
        content.innerHTML = blog.description;

        // Append the content with its inline styles
        shadowRoot.appendChild(content);
    }, [data.description]);

    const openSharigModal = (e, link) => {
        e.preventDefault();
        setLink(link);
        setModal(true);
    };

            <Head title={videos.title}>
                <meta name="keywords" content={seo?.meta_keyword || ''} />
                <meta name="description" content={seo?.desc || ''} />
                <meta name="robots" content={seo?.meta_robot || 'index,follow'} />
    
                <meta property="og:title" content={seo?.og_title || videos.title} />
                <meta property="og:description" content={seo?.og_desc || ''} />
                <meta property="og:image" content={seo?.og_image_url || ''} />
                <meta property="og:url" content={seo?.cust_url || ''} />
    
    
                {seo?.json_id && (
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "VideoObject",
                            "identifier": seo?.json_id,
                            "name": seo?.og_title || videos.title,
                            "description": seo?.desc || '',
                            "thumbnailUrl": seo?.og_image_url || '',
                            "uploadDate": videos.uploadDate || '', // optional if you have
                            "contentUrl": window.location.href,
                        })}
                    </script>
                )}
                
            </Head>

    // console.log('blogs', blog)

    return (<Front
        containerClass="w-full"
        extraHeader={true}
        extraHeaderTitle={data.title}
        extraHeaderImage={data.imageUrl}
        extraHeaderText={""}
        extraImageHeight={"h-14"}
    >
        <Head title={data.title}/>
        <Modal show={modal} onClose={(e) => setModal(false)}>
            {link && <ShareLink link={link} inModal={true}/>}
        </Modal>
         
         {popupMessage && showPopup && (
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

        <div>
            <div className="flex flex-wrap text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                <BsTagFill className="w-3"/>
                {data?.categoryDetails?.map((category, index) => (
                    <Link
                        href={route("category", {
                            id: category.slug,
                        })}
                        className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                    >
                        <span>{category.category} {index !== data.categoryDetails.length - 1 && ', '}</span>
                    </Link>
                ))}
            </div>
            <div className="flex flex-wrap text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                <BsFillTagsFill className="w-3"/>
                {data?.tagsDetails?.map((tag, index) => (
                    <Link
                        href={route("tag", {
                            id: tag.slug,
                        })}
                        className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                    > <span>{tag.name} {index !== data.tagsDetails.length - 1 && ', '}</span>
                    </Link>
                ))}
            </div>
            <div
                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                // onClick={handleCopyUrl}
                onClick={(e) => openSharigModal(e, document.URL)}
            >
                <BsShare className="w-4 h-4 mr-1"/>
                {__("Share ")}
            </div>
        </div>


        {/*<div className="">*/}
        {/*    <div dangerouslySetInnerHTML={{__html: transformData(data.description)}}/>*/}
        {/*</div>*/}


        <div ref={shadowRootRef}/>
        {/* Add Videos Section */}
                    <div className="mt-10">
                        <h2 className="text-xl font-semibold dark:text-white mb-5">{__("Related Videos")}</h2>
                        {Array.isArray(videos) && videos.length > 0 ? (
                    <VideosLoop videos={videos.slice(0, 10)} blocks={blocks} />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No videos found</p>
                )}
                    </div>

    </Front>);
}

