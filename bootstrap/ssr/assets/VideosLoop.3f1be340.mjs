import { _ as __ } from "./Translate.346b89d9.mjs";
import { Link } from "@inertiajs/inertia-react";
import { Tooltip } from "react-tooltip";
import { MdGeneratingTokens } from "react-icons/md/index.js";
/* empty css                             */import { M as Modal } from "./Modal.c4c8f017.mjs";
import SingleVideo from "./SingleVideo.d5015c6c.mjs";
import { useState } from "react";
import { BsTagFill } from "react-icons/bs/index.js";
import { j as jsxs, F as Fragment, a as jsx } from "../app.mjs";
import "react-dom";
import "@headlessui/react";
import "./AuthenticatedLayout.b5843aff.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "antd";
import "react-toastify";
import "lodash.debounce";
import "axios";
import "./TextInput.7d39776a.mjs";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "react-icons/fc/index.js";
import "./PrimaryButton.9fb48a50.mjs";
import "@inertiajs/inertia";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function VideosLoop({
  videos,
  blocks
}) {
  const [playVideo, setPlayVideo] = useState(false);
  const [modal, setModal] = useState(false);
  const [hovered, setHovered] = useState({});
  const handleMouseEnter = (id) => {
    setHovered((prev) => ({
      ...prev,
      [id]: true
    }));
  };
  const handleMouseLeave = (id) => {
    setHovered((prev) => ({
      ...prev,
      [id]: false
    }));
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Modal, {
      show: modal,
      onClose: (e) => setModal(false),
      children: playVideo && /* @__PURE__ */ jsx(SingleVideo, {
        video: playVideo,
        inModal: true
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5",
      children: videos == null ? void 0 : videos.map((v, index) => {
        return /* @__PURE__ */ jsxs("div", {
          className: "border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "relative",
            children: [/* @__PURE__ */ jsx(Link, {
              href: route("video.single.page", {
                id: v.id
              }),
              children: hovered[v.id] && v.videoGIF ? /* @__PURE__ */ jsx("img", {
                src: v.videoGIF,
                className: "hovered-gif thumbnail-image rounded-tl-lg rounded-tr-lg mb-3",
                alt: "Any Fetish Porn and Extreme XXX Porn Site \u2013 FetishMegaStore",
                onMouseLeave: () => handleMouseLeave(v.id)
              }) : /* @__PURE__ */ jsx("img", {
                src: v.thumbnail,
                className: "thumbnail-image rounded-tl-lg rounded-tr-lg mb-3",
                alt: "Watch Free Fetish and BDSM Porn Videos \u2013 FetishMegaStore",
                onMouseEnter: () => handleMouseEnter(v.id)
              })
            }), /* @__PURE__ */ jsx("div", {
              className: "absolute top-5 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1",
              children: v.price < 1 ? __("Free") : /* @__PURE__ */ jsxs("div", {
                className: "flex items-center",
                children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
                  className: "h-4 w-4 mr-1"
                }), v.price]
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "inline-flex items-center px-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-10 flex-shrink-0 mr-2",
              children: /* @__PURE__ */ jsx(Link, {
                href: route("channel", {
                  user: v.streamer.username
                }),
                children: /* @__PURE__ */ jsx("img", {
                  src: v.streamer.profile_picture,
                  className: "w-10 h-10 rounded-full"
                })
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("div", {
                className: "h-5 overflow-hidden",
                children: /* @__PURE__ */ jsx(Link, {
                  href: route("video.single.page", {
                    id: v.id
                  }),
                  children: v.title
                })
              }), /* @__PURE__ */ jsx("div", {
                className: "mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-200"
              }), /* @__PURE__ */ jsxs("div", {
                className: "mt-1.5 mb-1 flex items-center text-xs text-gray-500 dark:text-gray-200",
                children: [/* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsxs(Link, {
                    href: route("channel", {
                      user: v.streamer.username
                    }),
                    children: ["@", v.streamer.username]
                  }), /* @__PURE__ */ jsx(Tooltip, {
                    anchorSelect: "a"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "inline-flex items-center ml-2",
                  children: [/* @__PURE__ */ jsx(BsTagFill, {
                    className: "mr-0.5"
                  }), v.categoryNames]
                })]
              })]
            })]
          })]
        }, `vid-${v.id}`);
      })
    })]
  });
}
export {
  VideosLoop as default
};
