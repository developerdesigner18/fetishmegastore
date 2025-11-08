import { useState } from "react";
import { Head } from "@inertiajs/inertia-react";
import { F as Front } from "./Front.602cce17.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { a as jsx, j as jsxs } from "../app.mjs";
import "react-toastify";
import ProfileTabs from "./ProfileTabs.201a2187.mjs";
import "@inertiajs/inertia";
import "react-dom";
import "react-nl2br";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
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
import "sanitize-html-react";
import "./ChannelVideos.240a405b.mjs";
import "./Spinner.a2c890cd.mjs";
import "react-tooltip";
/* empty css                             */import "./SecondaryButton.09a51f74.mjs";
import "./SingleVideo.d5015c6c.mjs";
import "./AuthenticatedLayout.b5843aff.mjs";
import "react-icons/fc/index.js";
import "./PrimaryButton.9fb48a50.mjs";
function StartStream({
  category,
  ofTags
}) {
  useState("Videos");
  const coverBg = {
    backgroundImage: `url(${category.imageUrl})`
  };
  return /* @__PURE__ */ jsx(Front, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "-mt-[60px] max-w-5xl mx-auto",
      children: [/* @__PURE__ */ jsxs(Head, {
        title: __(":channelName's channel (:handle)", {
          channelName: category.category,
          handle: `@${category.category}`
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
      }), /* @__PURE__ */ jsx("div", {
        className: "coverPic",
        style: coverBg
      }), /* @__PURE__ */ jsx("div", {
        className: "flex items-center flex-wrap justify-between bg-white dark:bg-zinc-900 text-gray-700 -mt-2 rounded-b-lg px-3 pt-5 pb-4 shadow",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center",
          children: [/* @__PURE__ */ jsx("div", {
            className: "relative",
            children: /* @__PURE__ */ jsx("div", {
              className: "border-4 border-white shadow rounded-full -mt-[63px] z-10 ml-2",
              children: /* @__PURE__ */ jsx("img", {
                src: category.imageUrl,
                alt: "",
                className: "cursor-pointer rounded-full w-24 h-24 dark:border-red-100"
              })
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "ml-3 pb-2",
            children: /* @__PURE__ */ jsxs("p", {
              className: "text-indigo-800 dark:text-white",
              children: ["@", category.category]
            })
          })]
        })
      }), /* @__PURE__ */ jsx(ProfileTabs, {
        category
      })]
    })
  });
}
export {
  StartStream as default
};
