import { _ as __ } from "./Translate.346b89d9.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { useState } from "react";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import { usePage, Head, Link } from "@inertiajs/inertia-react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { Inertia } from "@inertiajs/inertia";
/* empty css                             */import "react-dom";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import VideosLoop from "./VideosLoop.3f1be340.mjs";
import AccountNavi from "./AccountNavi.87076860.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-toastify";
import "lodash.debounce";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "react-tooltip";
import "./SingleVideo.d5015c6c.mjs";
import "react-icons/fc/index.js";
function VideosOrdered({
  videos
}) {
  useState(false);
  useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    auth
  } = usePage().props;
  const activeTabClass = "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
  const inactiveTabClass = "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";
  const searchVideos = (e) => {
    e.preventDefault();
    console.log(`Would visit: ${route("videos.ordered")}?search_term=${searchTerm}`);
    Inertia.visit(`${route("videos.ordered")}?search_term=${searchTerm}`, {
      method: "GET",
      preserveState: true,
      only: videos
    });
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Purchased Videos")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "videos"
      }), /* @__PURE__ */ jsxs("div", {
        className: "ml-0 w-full",
        children: [auth.user.is_streamer == "yes" && /* @__PURE__ */ jsxs("div", {
          className: "mb-5",
          children: [/* @__PURE__ */ jsx(Link, {
            href: route("videos.list"),
            className: inactiveTabClass,
            children: __("Upload Videos")
          }), /* @__PURE__ */ jsx(Link, {
            href: route("videos.ordered"),
            className: activeTabClass,
            children: __("Videos Ordered")
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
          children: [/* @__PURE__ */ jsxs("header", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-lg md:text-xl font-medium text-gray-600 dark:text-gray-100",
              children: __("My Purchased Videos")
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400",
              children: __("Access to videos you've purchased")
            }), /* @__PURE__ */ jsx("form", {
              onSubmit: searchVideos,
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center",
                children: [/* @__PURE__ */ jsx(TextInput, {
                  name: "search_term",
                  placeholder: __("Search Video"),
                  value: searchTerm,
                  handleChange: (e) => setSearchTerm(e.target.value)
                }), /* @__PURE__ */ jsx(PrimaryButton, {
                  className: "ml-2 py-3",
                  onClick: (e) => searchVideos(e),
                  children: __("GO")
                })]
              })
            })]
          }), /* @__PURE__ */ jsx("hr", {
            className: "my-5"
          }), videos.total === 0 && /* @__PURE__ */ jsx("div", {
            className: "text-gray-600 dark:text-white",
            children: __("No videos to show.")
          }), videos.total !== 0 && /* @__PURE__ */ jsx("div", {
            className: "",
            children: /* @__PURE__ */ jsx(VideosLoop, {
              videos: videos.data
            })
          }), videos.last_page > 1 && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx("hr", {
              className: "my-5"
            }), /* @__PURE__ */ jsx("div", {
              className: "flex text-gray-600 my-3 text-sm",
              children: __("Page: :pageNumber of :lastPage", {
                pageNumber: videos.current_page,
                lastPage: videos.last_page
              })
            }), /* @__PURE__ */ jsx(SecondaryButton, {
              processing: videos.prev_page_url ? false : true,
              className: "mr-3",
              onClick: (e) => Inertia.visit(videos.prev_page_url),
              children: __("Previous")
            }), /* @__PURE__ */ jsx(SecondaryButton, {
              processing: videos.next_page_url ? false : true,
              onClick: (e) => Inertia.visit(videos.next_page_url),
              children: __("Next")
            })]
          })]
        })]
      })]
    })]
  });
}
export {
  VideosOrdered as default
};
