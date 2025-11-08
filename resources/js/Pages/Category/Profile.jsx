import React from "react";
import { Head } from "@inertiajs/inertia-react";
import Front from "@/Layouts/Front";
import __ from "@/Functions/Translate";
import { useState } from "react";
import axios from "axios";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-toastify";
import { FaHandSparkles } from "react-icons/fa/index.js";
import ProfileTabs from "./Partials/ProfileTabs";
import { Inertia } from "@inertiajs/inertia";
import SubscribePopup from "./Partials/SubscribePopup";

export default function StartStream({
    category,
    userLoginID,
    ofTags,
    seo,
}) {
    const [activeTab, setActiveTab] = useState("Videos");
    //
    // const coverBg = {
    //     backgroundImage: `url(${category.imageUrl})`,
    // };
    const coverBg = category.imageUrl;

     <Head title={category.title}>
                     <meta name="keywords" content={seo?.meta_keyword || ''} />
                     <meta name="description" content={seo?.desc || ''} />
                     <meta name="robots" content={seo?.meta_robot || 'index,follow'} />
         
                     <meta property="og:title" content={seo?.og_title || category.title} />
                     <meta property="og:description" content={seo?.og_desc || ''} />
                     <meta property="og:image" content={seo?.og_image_url || ''} />
                     <meta property="og:url" content={seo?.cust_url || ''} />
         
         
                     {seo?.json_id && (
                         <script type="application/ld+json">
                             {JSON.stringify({
                                 "@context": "https://schema.org",
                                 "@type": "VideoObject",
                                 "identifier": seo?.json_id,
                                 "name": seo?.og_title || category.title,
                                 "description": seo?.desc || '',
                                 "thumbnailUrl": seo?.og_image_url || '',
                                 "uploadDate": category.uploadDate || '', // optional if you have
                                 "contentUrl": window.location.href,
                             })}
                         </script>
                     )}
                     
                 </Head>

    return (
        <Front>
            {/* STREAMING CENTER CONTENTS */}
            <div className="-mt-[60px] max-w-5xl mx-auto">
                <Head
                    title={__(":channelName's channel (:handle)", {
                        channelName: category.category,
                        handle: `@${category.category}`,
                    })}
                >
                    <meta property="og:title" content="The Rock"/>
                    <meta
                        property="og:url"
                        content="https://www.imdb.com/title/tt0117500/"
                    />
                    <meta
                        property="og:image"
                        content="https://ia.media-imdb.com/images/rock.jpg"
                    />
                </Head>

                {/*<div className="coverPic" style={coverBg}></div>*/}
                <div className="coverPic">
                    <img
                        src={coverBg}
                        alt=""

                    />
                </div>

                    <div
                        className="flex items-center flex-wrap justify-between bg-white dark:bg-zinc-900 text-gray-700 -mt-2 rounded-b-lg px-3 pt-5 pb-4 shadow">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="border-4 border-white shadow rounded-full -mt-[63px] z-10 ml-2">
                                    <img
                                        src={category.imageUrl}
                                        alt=""
                                        className="cursor-pointer rounded-full w-24 h-24 dark:border-red-100"
                                    />
                                </div>
                            </div>
                            <div className="ml-3 pb-2">
                                {/*<h3 className="dark:text-white text-xl lg:text-2xl text-indigo-700 font-bold">*/}
                                {/*    {streamUser.name}*/}
                                {/*</h3>*/}

                                <p className="text-indigo-800 dark:text-white">
                                    @{category.category}
                                </p>
                            </div>
                        </div>
                        {/*<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">*/}
                        {/*    <PrimaryButton onClick={(e) => followUser()}>*/}
                        {/*        <FaHandSparkles className="mr-1" />*/}
                        {/*        {userFollowsChannel ? __("Unfollow") : __("Follow")}*/}
                        {/*    </PrimaryButton>*/}
                        {/*    <SubscribePopup*/}
                        {/*        user={streamUser}*/}
                        {/*        userIsSubscribed={userIsSubscribed}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>
                    <p className="font-semibold  dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                        {category?.seo_desc}
                    </p>
                    <ProfileTabs
                        category={category}
                        userLoginID={userLoginID}

                    />
                </div>
        </Front>
);
}
