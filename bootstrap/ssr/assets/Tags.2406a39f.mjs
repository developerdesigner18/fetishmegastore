import { useRef, useState } from "react";
import { Link, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { FcEmptyFilter } from "react-icons/fc/index.js";
import { Inertia } from "@inertiajs/inertia";
import { a as jsx, j as jsxs, F as Fragment } from "../app.mjs";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { F as Front } from "./Front.602cce17.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { IoMdFunnel } from "react-icons/io/index.js";
import { Pagination } from "antd";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "react-toastify";
import "lodash.debounce";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
function TagsLoop({
  channels
}) {
  return /* @__PURE__ */ jsx("div", {
    className: "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5",
    children: channels.map((channel) => /* @__PURE__ */ jsxs("div", {
      className: "border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900",
      children: [/* @__PURE__ */ jsx("div", {
        className: "relative",
        children: /* @__PURE__ */ jsx("img", {
          src: channel.imageUrl,
          alt: channel.imageUrl,
          className: "cursor-pointer rounded-tr-lg rounded-tl-lg sm:w-auto"
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-10 px-4",
        children: /* @__PURE__ */ jsx("div", {
          className: "flex items-center flex-wrap",
          children: /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx(Link, {
              className: "text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-black mt-1 text-lg",
              href: route("tag", {
                id: channel.id
              }),
              children: channel.name
            })
          })
        })
      })]
    }, channel.id))
  });
}
function Channels({
  channels,
  exploreImage
}) {
  const filters = useRef();
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    Inertia.visit(route("tag.browse", {
      search
    }), {
      preserveState: true,
      onBefore: () => setLoading(true),
      onFinish: () => setLoading(false)
    });
    hideFilters();
  };
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
  const hideFilters = (e) => {
    e == null ? void 0 : e.preventDefault();
    const hidden = "hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5";
    console.log(`hiding filters ${hidden}`);
    filters.current.className = hidden;
  };
  return /* @__PURE__ */ jsxs(Front, {
    containerClass: "w-full",
    extraHeader: true,
    extraHeaderTitle: __("Discover Tags"),
    extraHeaderImage: exploreImage,
    extraHeaderText: "",
    extraImageHeight: "h-14",
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Discover Tags")
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex w-full -mt-16",
      children: [/* @__PURE__ */ jsx("form", {
        onSubmit: submit,
        children: /* @__PURE__ */ jsxs("div", {
          ref: filters,
          className: "hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "text-indigo-700 dark:text-white text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900 shadow rounded-t-lg",
            children: __("Search")
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3",
            children: /* @__PURE__ */ jsx(TextInput, {
              className: "w-full",
              name: "search",
              value: search,
              handleChange: (e) => setSearch(e.target.value),
              placeholder: __("Search Tags")
            })
          }), isLoading ? /* @__PURE__ */ jsx("div", {
            className: "my-3",
            children: /* @__PURE__ */ jsx(Spinner, {})
          }) : /* @__PURE__ */ jsx("button", {
            className: "mt-5 bg-indigo-500 dark:bg-zinc-800 font-semibold text-white rounded-lg px-2 py-1.5 block w-full",
            children: __("Apply Filters")
          }), /* @__PURE__ */ jsx("div", {
            className: "lg:hidden text-center border-t dark:border-zinc-800 border-t-gray-300 py-5",
            children: /* @__PURE__ */ jsx(SecondaryButton, {
              className: "",
              onClick: (e) => hideFilters(e),
              children: __("Close")
            })
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
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
          }), __("No Tags to show")]
        }), /* @__PURE__ */ jsx(TagsLoop, {
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
      })]
    })]
  });
}
export {
  Channels as default
};
