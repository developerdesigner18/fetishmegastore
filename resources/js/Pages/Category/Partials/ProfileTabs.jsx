import __ from "@/Functions/Translate";
import sanitizeHtml from "sanitize-html-react";
import Tiers from "./TiersTab";
import ScheduleTab from "./ScheduleTab";
import ChannelVideos from "./ChannelVideos";
import { FaGrinStars, FaHandSparkles } from "react-icons/fa/index.js";
import { MdVideoLibrary } from "react-icons/md/index.js";
import { usePage } from "@inertiajs/inertia-react";
import { AiFillPlayCircle } from "react-icons/ai/index.js";
import { Link } from "@inertiajs/inertia-react";

export default function ProfileTabs({ category,userLoginID }) {
    // active tab class
    const activeTabClass =
        "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500";
    const inactiveTabClass =
        "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";



    return (
        <>

            {/* Videos Tab */}
            <ChannelVideos userLoginID={userLoginID}  category={category} />

        </>
    );
}
