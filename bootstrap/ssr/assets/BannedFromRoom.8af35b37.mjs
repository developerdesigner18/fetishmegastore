import { _ as __ } from "./Translate.346b89d9.mjs";
import { F as Front } from "./Front.602cce17.mjs";
import { Head } from "@inertiajs/inertia-react";
import { FaBan } from "react-icons/fa/index.js";
import { a as jsx, j as jsxs } from "../app.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "antd";
import "react";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "react-toastify";
import "lodash.debounce";
import "axios";
import "./TextInput.7d39776a.mjs";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Subscribe({
  streamUser
}) {
  return /* @__PURE__ */ jsx(Front, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "max-w-xl mx-auto",
      children: [/* @__PURE__ */ jsx(Head, {
        title: __("Banned from :channelName's channel (:handle)", {
          channelName: streamUser.name,
          handle: `@${streamUser.username}`
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "bg-white dark:bg-zinc-900 dark:text-white shadow sm:rounded-lg p-4 sm:p-8",
        children: [/* @__PURE__ */ jsx(FaBan, {
          className: "h-36 w-36 mx-auto mb-4 text-rose-600"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex mx-auto items-center",
          children: [/* @__PURE__ */ jsx("img", {
            src: streamUser.profile_picture,
            className: "rounded-full w-20 border-2 border-indigo-100"
          }), /* @__PURE__ */ jsx("h2", {
            className: "text-2xl text-center font-semibold text-gray-900 dark:text-gray-100",
            children: __("You have been banned from :handle's live", {
              channelName: streamUser.name,
              handle: `@${streamUser.username}`
            })
          })]
        })]
      })]
    })
  });
}
export {
  Subscribe as default
};
