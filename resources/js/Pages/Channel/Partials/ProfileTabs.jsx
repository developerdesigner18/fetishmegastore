import __ from "@/Functions/Translate";
import sanitizeHtml from "sanitize-html-react";
import Tiers from "./TiersTab";
import ScheduleTab from "./ScheduleTab";
import EbookTab from "./EbookTab";
import ChannelAudio from "./ChannelAudio";
import ChannelVideos from "./ChannelVideos";
import ChannleModels from "./ChannleModels";
import ChannleCategories from "./ChannleCategories";
import ChannlePreviews from "./ChannlePreviews";
import ChannleGalleries from "./ChannleGalleries";
import ChannleTags from "./ChannleTags";
import { FaGrinStars, FaHandSparkles } from "react-icons/fa/index.js";
import { MdVideoLibrary } from "react-icons/md/index.js";
import { usePage } from "@inertiajs/inertia-react";
import { AiFillPlayCircle } from "react-icons/ai/index.js";
import { Link } from "@inertiajs/inertia-react";

export default function ProfileTabs({ streamUser, activeTab, setActiveTab, userLoginID }) {
    // active tab class
    const activeTabClass =
        "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500";
    const inactiveTabClass =
        "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";

    const { auth } = usePage().props;

    const changeTab = (e, tabName) => {
        e.preventDefault();
        setActiveTab(tabName);
    };
    // console.log('videoCategories',videoCategories);
    return (
        <>
            <div
                className="mt-4 bg-white dark:bg-zinc-900 rounded-lg shadow px-3 py-4 flex justify-between items-center flex-wrap">
                <div>
                    <button
                        className={
                            activeTab == "About"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "About")}
                    >
                        {__("About")}
                    </button>

                    <button
                        className={
                            activeTab == "Categories"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "Categories")}
                    >
                        {__("Categories")}
                    </button>

                    <button
                        className={
                            activeTab == "Videos"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "Videos")}
                    >
                        {__("Videos")}
                    </button>

                    <button
                        className={
                            activeTab == "Previews"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "Previews")}
                    >
                        {__("Previews")}
                    </button>


                    <button
                        className={
                            activeTab == "Models"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "Models")}
                    >
                        {__("Models")}
                    </button>

                    <button
                        className={
                            activeTab == "Galleries"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "Galleries")}
                    >
                        {__("Galleries")}
                    </button>
                    <button
                        className={
                            activeTab == "Tags"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "Tags")}
                    >
                        {__("Tags")}
                    </button>

                    <button
                        className={
                            activeTab == "Tiers"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "Tiers")}
                    >
                        {__("Membership")}
                    </button>

                    <button
                        className={
                            activeTab == "Audio"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "Audio")}
                    >
                        {__("Audio")}
                    </button>

                    <button
                        className={
                            activeTab == "Ebook"
                                ? activeTabClass
                                : inactiveTabClass
                        }
                        onClick={(e) => changeTab(e, "Ebook")}
                    >
                        {__("Ebook")}
                    </button>

                    {/*<button*/}
                    {/*    className={*/}
                    {/*        activeTab == "Schedule"*/}
                    {/*            ? activeTabClass*/}
                    {/*            : inactiveTabClass*/}
                    {/*    }*/}
                    {/*    onClick={(e) => changeTab(e, "Schedule")}*/}
                    {/*>*/}
                    {/*    {__("Schedule")}*/}
                    {/*</button>*/}







                </div>
                {/*<div>*/}
                {/*    {auth.user?.username === streamUser.username && (*/}
                {/*        <Link*/}
                {/*            href={route("channel.livestream", {*/}
                {/*                user: streamUser.username,*/}
                {/*            })}*/}
                {/*            className="inline-flex items-center text-pink-600 hover:text-pink-500 dark:text-pink-500 dark:hover:text-pink-600 text-lg font-bold"*/}
                {/*        >*/}
                {/*            <AiFillPlayCircle className="mr-1"/>*/}
                {/*            {__("Start Streaming")}*/}
                {/*        </Link>*/}
                {/*    )}*/}
                {/*    {auth.user?.username !== streamUser.username &&*/}
                {/*        streamUser.live_status === "online" && (*/}
                {/*            <Link*/}
                {/*                href={route("channel.livestream", {*/}
                {/*                    user: streamUser.username,*/}
                {/*                })}*/}
                {/*                className="inline-flex items-center text-pink-600 hover:text-pink-500 text-lg font-bold"*/}
                {/*            >*/}
                {/*                <AiFillPlayCircle className="mr-1"/>*/}
                {/*                {__("Watch Stream")}*/}
                {/*            </Link>*/}
                {/*        )}*/}
                {/*</div>*/}
            </div>

            {/* About Tab */}
            {activeTab == "About" && (
                <>
                    <div className="flex mt-4">
                        {/*<div className="flex flex-col items-center mr-4">*/}
                        {/*    <div className="shadow bg-white dark:bg-zinc-900 dark:text-white rounded-lg p-5 mb-5 w-full">*/}
                        {/*        <h3 className="text-2xl justify-center flex items-center dark:text-white  text-gray-600">*/}
                        {/*            <FaHandSparkles className="w-10 h-10 mr-1" />*/}
                        {/*        </h3>*/}
                        {/*        <p className="mt-2 font-medium text-center dark:text-white text-gray-600">*/}
                        {/*            {streamUser.followers_count === 1*/}
                        {/*                ? __("1 Followers")*/}
                        {/*                : __(":count Followers", {*/}
                        {/*                      count: streamUser.followers_count,*/}
                        {/*                  })}*/}
                        {/*        </p>*/}
                        {/*    </div>*/}
                        {/*    <div className="shadow bg-white dark:bg-zinc-900 rounded-lg p-5 mb-5 w-full">*/}
                        {/*        <h3 className="text-2xl justify-center flex items-center dark:text-white  text-gray-600">*/}
                        {/*            <FaGrinStars className="w-10 h-10 mr-1" />*/}
                        {/*        </h3>*/}

                        {/*        <p className="mt-2 font-medium text-center dark:text-white text-gray-600">*/}
                        {/*            {streamUser.subscribers_count === 1*/}
                        {/*                ? __("1 Subscriber")*/}
                        {/*                : __(":count Subscribers", {*/}
                        {/*                      count: streamUser.subscribers_count,*/}
                        {/*                  })}*/}
                        {/*        </p>*/}
                        {/*    </div>*/}
                        {/*    <div className="shadow bg-white dark:bg-zinc-900 rounded-lg p-5 w-full">*/}
                        {/*        <h3 className="text-2xl justify-center flex items-center dark:text-white  text-gray-600">*/}
                        {/*            <MdVideoLibrary className="w-10 h-10 mr-1" />*/}
                        {/*        </h3>*/}
                        {/*        <p className="mt-2 font-medium text-center dark:text-white text-gray-700">*/}
                        {/*            {streamUser.videos_count === 1*/}
                        {/*                ? __("1 Video")*/}
                        {/*                : __(":count Videos", {*/}
                        {/*                      count: streamUser.videos_count,*/}
                        {/*                  })}*/}
                        {/*        </p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className=" flex-grow">
                            {streamUser?.about ? (
                                <div
                                    className="dark:text-zinc-200 dark:bg-zinc-900 bg-white rounded-lg shadow p-3"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(streamUser.about, {
                                            allowedTags:
                                                sanitizeHtml.defaults.allowedTags.concat(
                                                    ["img", "br"]
                                                ),
                                        }),
                                    }}
                                />
                            ) : (
                                <div
                                    className="bg-white dark:bg-zinc-900 dark:text-white rounded-lg shadow px-3 py-5 text-gray-600">
                                    {__(
                                        "Add channel description in Channel Settings page."
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/*{activeTab == "Categories" && (*/}
            {/*    <>*/}
            {/*        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">*/}
            {/*            {videoCategories &&*/}
            {/*                videoCategories.map((categoryObj, index) => {*/}
            {/*                    const [id, category] = Object.entries(categoryObj)[0];*/}
            {/*                    return (*/}
            {/*                        <Link*/}
            {/*                            key={index} // Use index as the key here*/}
            {/*                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-4 rounded-lg shadow text-center text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-bold text-lg"*/}
            {/*                            href={route("category", {*/}
            {/*                                id: id, // Pass the id (key)*/}
            {/*                            })}*/}
            {/*                        >*/}
            {/*                            {category} /!* Display the category name *!/*/}
            {/*                        </Link>*/}
            {/*                    );*/}
            {/*                })}*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)}*/}

            {/*{activeTab == "Tags" && (*/}
            {/*    <>*/}
            {/*        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">*/}
            {/*            {videoTags &&*/}
            {/*                videoTags.map((categoryObj, index) => {*/}
            {/*                    const [id, category] = Object.entries(categoryObj)[0]; // Extract the key (id) and value (category name)*/}
            {/*                    return (*/}
            {/*                        <Link*/}
            {/*                            key={index} // Use index as the key here*/}
            {/*                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-4 rounded-lg shadow text-center text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-bold text-lg"*/}
            {/*                            href={route("tag", {*/}
            {/*                                id: id, // Pass the id (key)*/}
            {/*                            })}*/}
            {/*                        >*/}
            {/*                            {category} /!* Display the category name *!/*/}
            {/*                        </Link>*/}
            {/*                    );*/}
            {/*                })}*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)}*/}

            {/* Videos Tab */}
            {activeTab == "Videos" && <ChannelVideos streamUser={streamUser} userLoginID={userLoginID} />}

            {activeTab == "Audio" && <ChannelAudio streamUser={streamUser} />}

            {activeTab == "Models" && <ChannleModels streamUser={streamUser} />}

            {activeTab == "Categories" && <ChannleCategories streamUser={streamUser} />}

            {activeTab == "Tags" && <ChannleTags streamUser={streamUser} />}

            {activeTab == "Previews" && <ChannlePreviews streamUser={streamUser} />}

            {activeTab == "Galleries" && <ChannleGalleries streamUser={streamUser} />}

            {/* Tiers Tab */}
            {activeTab == "Tiers" && <Tiers user={streamUser} />}

            {/* Schedule Tab */}
            {activeTab == "Schedule" && <ScheduleTab user={streamUser} />}

            {activeTab == "Ebook" && <EbookTab streamUser={streamUser} />}
        </>
    );
}
