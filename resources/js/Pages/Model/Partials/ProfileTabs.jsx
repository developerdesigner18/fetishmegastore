import __ from "@/Functions/Translate";
import sanitizeHtml from "sanitize-html-react";
import Tiers from "./TiersTab";
import ScheduleTab from "./ScheduleTab";
import ChannelVideos from "./ChannelVideos";
import ProfilePreviews from "./ProfilePreviews";
import ProfileGalleries from "./ProfileGalleries";


import { FaGrinStars, FaHandSparkles } from "react-icons/fa/index.js";
import { MdVideoLibrary } from "react-icons/md/index.js";
import { usePage } from "@inertiajs/inertia-react";
import { AiFillPlayCircle } from "react-icons/ai/index.js";
import { Link } from "@inertiajs/inertia-react";

export default function ProfileTabs({ category,activeTab, setActiveTab, userLoginID , preview , galleries }) {
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

  console.log(preview,"preview");
  console.log(galleries,"galleries");
  return (
    <>
      <div className="mt-4 bg-white dark:bg-zinc-900 rounded-lg shadow px-3 py-4 flex justify-between items-center flex-wrap">
        <div>
          <button
            className={
              activeTab == "Videos" ? activeTabClass : inactiveTabClass
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
                activeTab == "Galleries"
                    ? activeTabClass
                    : inactiveTabClass
            }
            onClick={(e) => changeTab(e, "Galleries")}
        >
            {__("Galleries")}
        </button> 
        </div>
      </div>

      {/* Videos Tab */}

      {activeTab == "Videos" && (
        <ChannelVideos category={category} userLoginID={userLoginID} />
      )}

      {/* {activeTab == "Previews" && (
        <ChannlePreviews category={category}/>
      )} */}

      {activeTab == "Previews" && (
        <div className="p-4 rounded">
           <ProfilePreviews preview={preview} />
          
        </div>
        )}

        {activeTab == "Galleries" && (
        <div className="p-4 rounded">
            <ProfileGalleries galleries={galleries} />
        </div>
        )}

      {/* {activeTab == "Models" && <ChannleModels category={category}/>}  */}
    </>
  );
}
