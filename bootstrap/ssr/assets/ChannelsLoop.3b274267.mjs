import "react";
import { Link } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { BsTagFill } from "react-icons/bs/index.js";
import { MdVideoLibrary } from "react-icons/md/index.js";
import { a as jsx, j as jsxs } from "../app.mjs";
function ChannelsLoop({
  channels
}) {
  return /* @__PURE__ */ jsx("div", {
    className: "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5",
    children: channels.map((channel) => /* @__PURE__ */ jsxs("div", {
      className: "border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "relative",
        children: [channel.live_status === "online" && /* @__PURE__ */ jsx("div", {
          className: "absolute top-3 left-0",
          children: /* @__PURE__ */ jsx("span", {
            className: "bg-pink-600 text-white font-bold px-2",
            children: __("LIVE")
          })
        }), /* @__PURE__ */ jsx(Link, {
          href: route("channel", {
            user: channel.username
          }),
          children: /* @__PURE__ */ jsx("img", {
            src: channel.cover_picture,
            alt: channel.name,
            className: "cursor-pointer rounded-tr-lg rounded-tl-lg sm:w-auto"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "-mt-8 ml-2.5 absolute",
          children: /* @__PURE__ */ jsx(Link, {
            href: route("channel", {
              user: channel.username
            }),
            children: /* @__PURE__ */ jsx("img", {
              src: channel.profile_picture,
              alt: "",
              className: "rounded-full h-16 border-white shadow-sm z-1 dark:border-indigo-200 border-2"
            })
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-10 px-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center flex-wrap",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx(Link, {
              className: "text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-black mt-1 text-lg",
              href: route("channel", {
                user: channel.username
              }),
              children: channel.name
            })
          }), /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsxs(Link, {
              className: "ml-2 text-indigo-600 hover:text-indigo-400 dark:text-indigo-500 dark:hover:text-indigo-600 font-light text-base",
              href: route("channel", {
                user: channel.username
              }),
              children: ["@", channel.username]
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-1 flex items-center flex-wrap justify-between",
          children: [/* @__PURE__ */ jsx("div", {
            children: channel.categories.map((category) => {
              return /* @__PURE__ */ jsxs("div", {
                className: "mt-2 inline-flex items-center space-x-1 px-2 rounded-lg dark:bg-gray-700  bg-gray-100",
                children: [/* @__PURE__ */ jsx(BsTagFill, {
                  className: "w-3 text-gray-500 dark:text-gray-100 "
                }), " ", /* @__PURE__ */ jsx(Link, {
                  href: route("channels.browse", {
                    category: category.id,
                    slug: `-${category.slug}`
                  }),
                  className: "text-gray-500 dark:text-gray-100 text-sm ml-1",
                  children: category.category
                }, `category-${category.id}`)]
              }, `category-${category.id}`);
            })
          }), /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsxs("span", {
              className: "flex items-center text-gray-500 dark:text-gray-300 text-sm",
              children: [/* @__PURE__ */ jsx(MdVideoLibrary, {
                className: "mr-1"
              }), " ", channel.videos_count === 1 ? __(":vidsCount video", {
                vidsCount: channel.videos_count
              }) : __(":vidsCount videos", {
                vidsCount: channel.videos_count
              })]
            })
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex  items-center justify-between"
        })]
      })]
    }, channel.id))
  });
}
export {
  ChannelsLoop as C
};
