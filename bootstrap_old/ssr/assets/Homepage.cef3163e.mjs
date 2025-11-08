import { usePage, Head, Link } from "@inertiajs/inertia-react";
import { F as Front } from "./Front.602cce17.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { MdVideoLibrary } from "react-icons/md/index.js";
import { C as ChannelsLoop } from "./ChannelsLoop.3b274267.mjs";
import { RiLiveLine } from "react-icons/ri/index.js";
import VideosLoop from "./VideosLoop.3f1be340.mjs";
import { useEffect } from "react";
import "@inertiajs/inertia";
import { BiUserPlus } from "react-icons/bi/index.js";
import { j as jsxs, a as jsx } from "../app.mjs";
import "react-icons/ai";
import "react-icons/bs/index.js";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "react-toastify";
import "lodash.debounce";
import "axios";
import "./TextInput.7d39776a.mjs";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "react-tooltip";
/* empty css                             */import "./SingleVideo.d5015c6c.mjs";
import "./AuthenticatedLayout.b5843aff.mjs";
import "react-icons/fc/index.js";
import "./PrimaryButton.9fb48a50.mjs";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Homepage({
  channels,
  livenow,
  videos,
  meta_title,
  meta_keys,
  meta_description,
  hide_live_channels
}) {
  usePage().props;
  const userIcon = "/images/user-signup-icon.png";
  useEffect(() => {
  }, []);
  return /* @__PURE__ */ jsxs(Front, {
    containerClass: "w-full",
    headerShow: false,
    children: [/* @__PURE__ */ jsxs(Head, {
      children: [/* @__PURE__ */ jsx("title", {
        children: meta_title
      }), /* @__PURE__ */ jsx("meta", {
        name: "description",
        content: meta_description
      }), /* @__PURE__ */ jsx("meta", {
        name: "keywords",
        content: meta_keys
      })]
    }), livenow.length > 0 && /* @__PURE__ */ jsxs("div", {
      className: "mb-20",
      children: [/* @__PURE__ */ jsxs("div", {
        className: `flex justify-center items-center mt-20 mb-8`,
        children: [/* @__PURE__ */ jsx(RiLiveLine, {
          className: "text-pink-600 text-4xl mr-1"
        }), /* @__PURE__ */ jsx("h2", {
          className: "text-indigo-900 text-center dark:text-zinc-200 text-4xl font-bold",
          children: __("Live Channels")
        })]
      }), /* @__PURE__ */ jsx(ChannelsLoop, {
        channels: livenow
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: `flex justify-center items-center mt-20 mb-8`,
      children: [/* @__PURE__ */ jsx(MdVideoLibrary, {
        className: "text-pink-600 text-4xl mr-1"
      }), /* @__PURE__ */ jsx("h2", {
        className: "text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold",
        children: __("Videos")
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mb-8",
      children: [videos.length < 1 && /* @__PURE__ */ jsx("div", {
        className: "text-center text-xl font-medium dark:text-white text-gray-700",
        children: __("No videos to show")
      }), /* @__PURE__ */ jsx(VideosLoop, {
        videos
      })]
    }), videos.length > 0 && /* @__PURE__ */ jsx("div", {
      className: "mx-auto text-center mt-10",
      children: /* @__PURE__ */ jsx(Link, {
        href: route("videos.browse"),
        className: "px-8 bg-violet-700 hover:bg-violet-500 dark:bg-zinc-800 dark:hover:bg-zinc-900 text-white font-semibold text-lg py-2.5 rounded-lg",
        children: __("View All Videos")
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-20 flex items-center flex-col lg:flex-row flex-wrap border-t px-5 dark:border-zinc-800",
      children: [/* @__PURE__ */ jsxs("div", {
        className: `flex flex-col justify-center items-center mb-8`,
        children: [/* @__PURE__ */ jsx(BiUserPlus, {
          className: "text-pink-600 text-4xl mr-1"
        }), /* @__PURE__ */ jsx("h2", {
          className: "text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold",
          children: __("Join Our Platform")
        }), /* @__PURE__ */ jsx("p", {
          className: "text-lg mt-2 text-gray-600 font-medium dark:text-white",
          children: __("We are welcoming both Streamers and Users")
        }), /* @__PURE__ */ jsx("p", {
          className: "text-lg text-gray-600 font-medium dark:text-white",
          children: __("It's completely free to join both as an user or as a streamer")
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "max-w-lg mx-auto",
        children: /* @__PURE__ */ jsx("div", {
          className: "grid grid-cols-2 mt-10 gap-5",
          children: /* @__PURE__ */ jsxs("div", {
            className: "col text-center",
            children: [/* @__PURE__ */ jsx(Link, {
              href: route("register"),
              children: /* @__PURE__ */ jsx("img", {
                src: userIcon,
                alt: "",
                className: "max-h-96 rounded-full mx-auto border-zinc-200  dark:border-indigo-200 border-4"
              })
            }), /* @__PURE__ */ jsx(Link, {
              href: route("register"),
              className: "bg-indigo-700 inline-block mt-5 text-white font-bold py-2 px-4 rounded mb-4 hover:bg-indigo-600",
              children: __("I am an User")
            })]
          })
        })
      })]
    })]
  });
}
export {
  Homepage as default
};
