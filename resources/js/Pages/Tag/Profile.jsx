import React from "react";
import {Head} from "@inertiajs/inertia-react";
import Front from "@/Layouts/Front";
import __ from "@/Functions/Translate";
import {useState,useEffect} from "react";
import axios from "axios";
import PrimaryButton from "@/Components/PrimaryButton";
import {toast} from "react-toastify";
import {FaHandSparkles} from "react-icons/fa/index.js";
import ProfileTabs from "./Partials/ProfileTabs";
import {Inertia} from "@inertiajs/inertia";
import SubscribePopup from "./Partials/SubscribePopup";

export default function StartStream({
                                        tags,
                                        video,
                                        userLoginID,
                                        ofTags,

                                    }) {
    const [activeTab, setActiveTab] = useState("Videos");
    const [seoData, setSeoData] = useState(null);

    // const coverBg = {
    //     backgroundImage: `url(${tags.imageUrl})`,
    // };
    const coverBg = tags.imageUrl;




    useEffect(() => {
        if (tags.seo) {
            const parsedSeoData = JSON.parse(tags.seo);
            setSeoData(parsedSeoData);
        }
    }, []);


    return (
        <Front>
            {/* STREAMING CENTER CONTENTS */}
            <div className="-mt-[60px] max-w-5xl mx-auto">
                <Head
                    title={__(":channelName's channel (:handle)", {
                        channelName: tags.name,
                        handle: `@${tags.name}`,
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
                    <img src={coverBg} alt=""/>
                </div>

                <div
                    className="flex items-center flex-wrap justify-between bg-white dark:bg-zinc-900 text-gray-700 -mt-2 rounded-b-lg px-3 pt-5 pb-4 shadow">
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="border-4 border-white shadow rounded-full -mt-[63px] z-10 ml-2">
                                <img
                                    src={tags.imageUrl}
                                    alt=""
                                    className="cursor-pointer rounded-full w-24 h-24 dark:border-red-100"
                                />
                            </div>
                        </div>
                        <div className="ml-3 pb-2">
                            <h3 className="dark:text-white text-xl lg:text-2xl text-indigo-700 font-bold">
                                {tags.name}
                            </h3>

                            {/*<p className="text-indigo-800 dark:text-white">*/}
                            {/*    @{tags.name}*/}
                            {/*</p>*/}
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
                <p className="font-semibold dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                    {tags?.description}
                </p>
                <ProfileTabs
                    tags={tags}
                    userLoginID = {userLoginID}
                />
            </div>
        </Front>
    );
}
