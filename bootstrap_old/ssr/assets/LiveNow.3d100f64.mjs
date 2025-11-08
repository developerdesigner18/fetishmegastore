import "react";
import { usePage, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { RiLiveLine } from "react-icons/ri/index.js";
import { Inertia } from "@inertiajs/inertia";
import { C as ChannelsLoop } from "./ChannelsLoop.3b274267.mjs";
import { F as Front } from "./Front.602cce17.mjs";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "react-icons/bs/index.js";
import "react-icons/md/index.js";
import "react-icons/ai";
import "react-icons/bi/index.js";
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
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function LiveNow({
  channels
}) {
  usePage().props;
  return /* @__PURE__ */ jsxs(Front, {
    containerClass: "w-full",
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Channels Streaming Live Now")
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-2",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center flex-wrap",
        children: [/* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(RiLiveLine, {
            className: "text-2xl text-pink-600 mr-1 h-6 w-6"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "ml-2",
          children: /* @__PURE__ */ jsx("h3", {
            className: "text-2xl font-medium text-gray-600 dark:text-white",
            children: __("Channels Live Streaming Right Now")
          })
        })]
      }), channels.total === 0 && /* @__PURE__ */ jsxs("div", {
        className: "flex items-center",
        children: [/* @__PURE__ */ jsx("img", {
          src: "/images/channels-offline.png",
          alt: "",
          className: "h-8"
        }), /* @__PURE__ */ jsx("h3", {
          className: "ml-3 text-lg text-gray-600 font-light dark:text-gray-400",
          children: __("No one is live streaming at the moment.")
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-5",
        children: [/* @__PURE__ */ jsx(ChannelsLoop, {
          channels: channels.data
        }), channels.last_page > 1 && /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex text-gray-600 mt-10 mb-5 text-sm",
            children: __("Page: :pageNumber of :lastPage", {
              pageNumber: channels.current_page,
              lastPage: channels.last_page
            })
          }), /* @__PURE__ */ jsx(SecondaryButton, {
            processing: channels.prev_page_url ? false : true,
            className: "mr-3",
            onClick: (e) => Inertia.visit(channels.prev_page_url),
            children: __("Previous")
          }), /* @__PURE__ */ jsx(SecondaryButton, {
            processing: channels.next_page_url ? false : true,
            onClick: (e) => Inertia.visit(channels.next_page_url),
            children: __("Next")
          })]
        })]
      })]
    })]
  });
}
export {
  LiveNow as default
};
