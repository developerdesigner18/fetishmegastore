import { useState } from "react";
import { Head } from "@inertiajs/inertia-react";
import { F as Front } from "./Front.602cce17.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import axios from "axios";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { toast } from "react-toastify";
import { FaHandSparkles } from "react-icons/fa/index.js";
import ProfileTabs from "./ProfileTabs.5e094ed8.mjs";
import { Inertia } from "@inertiajs/inertia";
import SubscribePopup from "./SubscribePopup.6080bc24.mjs";
import { a as jsx, j as jsxs } from "../app.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "lodash.debounce";
import "./TextInput.7d39776a.mjs";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "sanitize-html-react";
import "./TiersTab.9c624531.mjs";
import "./Spinner.a2c890cd.mjs";
import "react-nl2br";
import "react-icons/ai/index.js";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
import "./ScheduleTab.35a90b6a.mjs";
import "react-icons/vsc/index.js";
import "./ChannelVideos.78fb8485.mjs";
import "react-tooltip";
/* empty css                             */import "./SecondaryButton.09a51f74.mjs";
import "./SingleVideo.d5015c6c.mjs";
import "./AuthenticatedLayout.b5843aff.mjs";
import "react-icons/fc/index.js";
function StartStream({
  user,
  streamUser,
  userFollowsChannel,
  userIsSubscribed,
  totalVideos
}) {
  const [activeTab, setActiveTab] = useState("Videos");
  const coverBg = streamUser.cover_picture;
  const followUser = () => {
    if (!user) {
      toast.error(__("Please login to follow this channel"));
    } else {
      axios.get(route("follow", {
        user: streamUser.id
      })).then((apiRes) => {
        console.log(Inertia.reload({
          only: ["userFollowsChannel", "streamUser"]
        }));
      }).catch((Error) => {
        var _a, _b;
        return toast.error((_b = (_a = Error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.error);
      });
    }
  };
  return /* @__PURE__ */ jsx(Front, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "-mt-[20px] max-w-5xl mx-auto",
      children: [/* @__PURE__ */ jsxs(Head, {
        title: __(":channelName's channel (:handle)", {
          channelName: streamUser.name,
          handle: `@${streamUser.username}`
        }),
        children: [/* @__PURE__ */ jsx("meta", {
          property: "og:title",
          content: "The Rock"
        }), /* @__PURE__ */ jsx("meta", {
          property: "og:url",
          content: "https://www.imdb.com/title/tt0117500/"
        }), /* @__PURE__ */ jsx("meta", {
          property: "og:image",
          content: "https://ia.media-imdb.com/images/rock.jpg"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "coverPic",
        children: [/* @__PURE__ */ jsx("img", {
          src: coverBg,
          alt: ""
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center flex-wrap justify-between bg-white dark:bg-zinc-900 text-gray-700 -mt-2 rounded-b-lg px-3 pt-5 pb-4 shadow",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center",
            children: [/* @__PURE__ */ jsx("div", {
              className: "relative",
              children: /* @__PURE__ */ jsx("div", {
                className: "border-4 border-white shadow rounded-full -mt-[63px] z-10 ml-2",
                children: /* @__PURE__ */ jsx("img", {
                  src: streamUser.profile_picture,
                  alt: "",
                  className: "cursor-pointer rounded-full w-24 h-24 dark:border-red-100"
                })
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "ml-3 pb-2",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "dark:text-white text-xl lg:text-2xl text-white font-bold",
                children: streamUser.name
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-white dark:text-white",
                children: ["@", streamUser.username]
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-white dark:text-white",
                children: [__("Total Videos"), " : ", totalVideos]
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2",
            children: [/* @__PURE__ */ jsxs(PrimaryButton, {
              onClick: (e) => followUser(),
              children: [/* @__PURE__ */ jsx(FaHandSparkles, {
                className: "mr-1"
              }), userFollowsChannel ? __("Unfollow") : __("Follow")]
            }), /* @__PURE__ */ jsx(SubscribePopup, {
              user: streamUser,
              userIsSubscribed
            })]
          })]
        })]
      }), /* @__PURE__ */ jsx(ProfileTabs, {
        streamUser,
        activeTab,
        setActiveTab
      })]
    })
  });
}
export {
  StartStream as default
};
