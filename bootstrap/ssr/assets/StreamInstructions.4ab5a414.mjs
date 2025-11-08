import { useState } from "react";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { usePage } from "@inertiajs/inertia-react";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function StreamInstructions({
  streamKey,
  streamUser
}) {
  var _a;
  const {
    auth,
    rtmp_url
  } = usePage().props;
  const [tab, setTab] = useState("desktop");
  if (((_a = auth == null ? void 0 : auth.user) == null ? void 0 : _a.username) !== streamUser) {
    return __("User offline!");
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "bg-white dark:bg-zinc-900 mr-10 p-5",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "my-5",
      children: [/* @__PURE__ */ jsx("button", {
        onClick: (e) => setTab("desktop"),
        className: `text-xl font-bold hover:text-indigo-800 dark:hover:text-indigo-600 ${tab === "desktop" ? "text-indigo-700 dark:text-indigo-500 underline" : "text-gray-700 dark:text-white"}`,
        children: __("Desktop Instructions")
      }), /* @__PURE__ */ jsx("button", {
        onClick: (e) => setTab("mobile"),
        className: `ml-3 text-xl font-bold hover:text-indigo-800 dark:hover:text-indigo-600 ${tab === "mobile" ? "text-indigo-700 dark:text-indigo-500 underline" : "text-gray-700 dark:text-white"}`,
        children: __("Mobile Instructions")
      })]
    }), /* @__PURE__ */ jsx("h2", {
      className: "text-2xl pb-2 mt-5 border-b dark:border-b-zinc-800 font-semibold dark:text-white text-gray-700",
      children: __("RTMP Server URL")
    }), /* @__PURE__ */ jsx(TextInput, {
      className: "text-xl mt-3 w-full",
      value: tab === "desktop" ? rtmp_url : `${rtmp_url}/${streamKey}`
    }), tab == "desktop" ? /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-xl pb-2 mt-5 border-b dark:border-b-zinc-800 font-semibold dark:text-white text-gray-700",
        children: __("RTMP Streaming Key")
      }), /* @__PURE__ */ jsx(Textarea, {
        className: "text-xl w-full",
        value: streamKey
      }), /* @__PURE__ */ jsx("h2", {
        className: "mt-5 text-2xl pb-2 border-b dark:border-b-zinc-800 font-semibold dark:text-white text-gray-700",
        children: __("Download OBS - Open Broadcaster Software")
      }), /* @__PURE__ */ jsx("a", {
        className: "flex dark:text-white text-xl hover:underline",
        target: "blank",
        href: "https://obsproject.com/",
        children: "https://obsproject.com"
      }), /* @__PURE__ */ jsx("h2", {
        className: "text-2xl pb-2 mt-5 border-b dark:border-b-zinc-800 font-semibold dark:text-white text-gray-700",
        children: __("Go to OBS->Settings->Stream")
      }), /* @__PURE__ */ jsx("img", {
        src: "/images/obs.png",
        alt: "obs.png"
      }), /* @__PURE__ */ jsx("h2", {
        className: "text-2xl pb-2 mt-5 border-b dark:border-b-zinc-800 font-semibold dark:text-white text-gray-700",
        children: __("Happy Streaming!")
      })]
    }) : /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-2xl pb-2 mt-5 border-b dark:border-b-zinc-800 font-semibold dark:text-white text-gray-700",
        children: __("Get a Mobile RTMP Ingesting App (ex. Larix Broadcaster)")
      }), /* @__PURE__ */ jsx("a", {
        className: "flex my-5 dark:text-white text-xl hover:underline",
        target: "blank",
        href: "https://apps.apple.com/us/app/larix-broadcaster/id1042474385",
        children: "Larix Broadcaster iOS"
      }), /* @__PURE__ */ jsx("a", {
        className: "flex my-5 dark:text-white text-xl hover:underline",
        target: "blank",
        href: "https://play.google.com/store/apps/details?id=com.wmspanel.larix_broadcaster&hl=en&gl=US&pli=1",
        children: "Larix Broadcaster Android"
      }), /* @__PURE__ */ jsx("p", {
        className: "dark:text-white text-gray-700",
        children: __("Click Settings Cog -> Connections -> New Connection")
      }), /* @__PURE__ */ jsx("a", {
        href: "https://www.youtube.com/watch?v=Dhj0_QbtfTw&t=24s",
        target: "_blank",
        children: /* @__PURE__ */ jsx("img", {
          src: "/images/larix.jpeg",
          alt: "larix app"
        })
      })]
    })]
  });
}
export {
  StreamInstructions as default
};
