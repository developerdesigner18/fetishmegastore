import { _ as __ } from "./Translate.346b89d9.mjs";
import sanitizeHtml from "sanitize-html-react";
import TiersTab from "./TiersTab.9c624531.mjs";
import ScheduleTab from "./ScheduleTab.35a90b6a.mjs";
import ChannelVideos from "./ChannelVideos.78fb8485.mjs";
import { usePage, Link } from "@inertiajs/inertia-react";
import { AiFillPlayCircle } from "react-icons/ai/index.js";
import { j as jsxs, F as Fragment, a as jsx } from "../app.mjs";
import "./Spinner.a2c890cd.mjs";
import "axios";
import "react";
import "react-toastify";
import "react-icons/fa/index.js";
import "react-nl2br";
import "react-icons/md/index.js";
import "@inertiajs/inertia";
import "react-icons/vsc/index.js";
import "react-tooltip";
/* empty css                             */import "./SecondaryButton.09a51f74.mjs";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "@headlessui/react";
import "./SingleVideo.d5015c6c.mjs";
import "./AuthenticatedLayout.b5843aff.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/bs/index.js";
import "antd";
import "lodash.debounce";
import "./TextInput.7d39776a.mjs";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "react-icons/fc/index.js";
import "./PrimaryButton.9fb48a50.mjs";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function ProfileTabs({
  streamUser,
  activeTab,
  setActiveTab
}) {
  var _a, _b;
  const activeTabClass = "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500";
  const inactiveTabClass = "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";
  const {
    auth
  } = usePage().props;
  const changeTab = (e, tabName) => {
    e.preventDefault();
    setActiveTab(tabName);
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs("div", {
      className: "mt-4 bg-white dark:bg-zinc-900 rounded-lg shadow px-3 py-4 flex justify-between items-center flex-wrap",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("button", {
          className: activeTab == "Videos" ? activeTabClass : inactiveTabClass,
          onClick: (e) => changeTab(e, "Videos"),
          children: __("Videos")
        }), /* @__PURE__ */ jsx("button", {
          className: activeTab == "Tiers" ? activeTabClass : inactiveTabClass,
          onClick: (e) => changeTab(e, "Tiers"),
          children: __("Membership")
        }), /* @__PURE__ */ jsx("button", {
          className: activeTab == "About" ? activeTabClass : inactiveTabClass,
          onClick: (e) => changeTab(e, "About"),
          children: __("About")
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [((_a = auth.user) == null ? void 0 : _a.username) === streamUser.username && /* @__PURE__ */ jsxs(Link, {
          href: route("channel.livestream", {
            user: streamUser.username
          }),
          className: "inline-flex items-center text-pink-600 hover:text-pink-500 dark:text-pink-500 dark:hover:text-pink-600 text-lg font-bold",
          children: [/* @__PURE__ */ jsx(AiFillPlayCircle, {
            className: "mr-1"
          }), __("Start Streaming")]
        }), ((_b = auth.user) == null ? void 0 : _b.username) !== streamUser.username && streamUser.live_status === "online" && /* @__PURE__ */ jsxs(Link, {
          href: route("channel.livestream", {
            user: streamUser.username
          }),
          className: "inline-flex items-center text-pink-600 hover:text-pink-500 text-lg font-bold",
          children: [/* @__PURE__ */ jsx(AiFillPlayCircle, {
            className: "mr-1"
          }), __("Watch Stream")]
        })]
      })]
    }), activeTab == "About" && /* @__PURE__ */ jsx(Fragment, {
      children: /* @__PURE__ */ jsx("div", {
        className: "flex mt-4",
        children: /* @__PURE__ */ jsx("div", {
          className: " flex-grow",
          children: (streamUser == null ? void 0 : streamUser.about) ? /* @__PURE__ */ jsx("div", {
            className: "dark:text-zinc-200 dark:bg-zinc-900 bg-white rounded-lg shadow p-3",
            dangerouslySetInnerHTML: {
              __html: sanitizeHtml(streamUser.about, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "br"])
              })
            }
          }) : /* @__PURE__ */ jsx("div", {
            className: "bg-white dark:bg-zinc-900 dark:text-white rounded-lg shadow px-3 py-5 text-gray-600",
            children: __("Add channel description in Channel Settings page.")
          })
        })
      })
    }), activeTab == "Videos" && /* @__PURE__ */ jsx(ChannelVideos, {
      streamUser
    }), activeTab == "Tiers" && /* @__PURE__ */ jsx(TiersTab, {
      user: streamUser
    }), activeTab == "Schedule" && /* @__PURE__ */ jsx(ScheduleTab, {
      user: streamUser
    })]
  });
}
export {
  ProfileTabs as default
};
