import { useRef, useState } from "react";
import { usePage, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import { FcEmptyFilter } from "react-icons/fc/index.js";
import { Inertia } from "@inertiajs/inertia";
import { C as ChannelsLoop } from "./ChannelsLoop.3b274267.mjs";
import { F as Front } from "./Front.602cce17.mjs";
import "./TextInput.7d39776a.mjs";
import { IoMdFunnel } from "react-icons/io/index.js";
import { Pagination } from "antd";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
import "react-icons/bs/index.js";
import "react-icons/md/index.js";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "react-toastify";
import "lodash.debounce";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
function Channels({
  channels,
  exploreImage
}) {
  usePage().props;
  const filters = useRef();
  useState("Popularity");
  useState("");
  useState(false);
  useState([]);
  const onChangePaginate = (pageNumber) => {
    console.log("Page: ", pageNumber);
    let fullPath = channels.path + "?page=" + pageNumber;
    Inertia.visit(fullPath);
  };
  const showFilters = (e) => {
    e.preventDefault();
    const shown = "fixed inset-0 z-[9999] pt-5 px-2 overflow-scroll h-screen bg-white dark:bg-black  block w-2/3 flex-shrink-0 mr-5";
    filters.current.className = shown;
  };
  return /* @__PURE__ */ jsxs(Front, {
    containerClass: "w-full",
    extraHeader: true,
    extraHeaderTitle: __("Discover Channels"),
    extraHeaderImage: exploreImage,
    extraHeaderText: "",
    extraImageHeight: "h-14",
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Discover Channels")
    }), /* @__PURE__ */ jsx("div", {
      className: "flex w-full -mt-16",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex-grow",
        children: [/* @__PURE__ */ jsxs("button", {
          onClick: (e) => showFilters(e),
          className: "mb-7 px-3 -mt-1 py-1.5 bg-indigo-500 text-white rounded-lg lg:hidden flex items-center justify-end",
          children: [/* @__PURE__ */ jsx(IoMdFunnel, {
            className: "mr-1"
          }), __("Show Filters")]
        }), channels.total === 0 && /* @__PURE__ */ jsxs("div", {
          className: "text-xl bg-white dark:bg-zinc-900 rounded-lg shadow text-gray-600 dark:text-white font-light p-3 flex items-center",
          children: [/* @__PURE__ */ jsx(FcEmptyFilter, {
            className: "w-12 h-12 mr-2"
          }), __("No channels to show")]
        }), /* @__PURE__ */ jsx(ChannelsLoop, {
          channels: channels.data
        }), channels.last_page > 1 && /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex text-gray-600 mt-10 mb-5 text-sm",
            children: __("Page: :pageNumber of :lastPage", {
              pageNumber: channels.current_page,
              lastPage: channels.last_page
            })
          }), /* @__PURE__ */ jsx(Pagination, {
            total: channels.last_page * 10,
            defaultCurrent: channels.current_page,
            onChange: onChangePaginate,
            showSizeChanger: false
          })]
        })]
      })
    })]
  });
}
export {
  Channels as default
};
