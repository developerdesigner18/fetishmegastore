import { useState, useEffect } from "react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import axios from "axios";
import { toast } from "react-toastify";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import { Link } from "@inertiajs/inertia-react";
import { Tooltip } from "react-tooltip";
/* empty css                             */import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { M as Modal } from "./Modal.c4c8f017.mjs";
import SingleVideo from "./SingleVideo.d5015c6c.mjs";
import { BsTagFill } from "react-icons/bs/index.js";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "react-dom";
import "@headlessui/react";
import "./AuthenticatedLayout.b5843aff.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "antd";
import "lodash.debounce";
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
function ChannelVideos({
  category
}) {
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [playVideo, setPlayVideo] = useState(false);
  const [modal, setModal] = useState(false);
  useEffect(() => {
    getVideos(1);
  }, []);
  const getVideos = (page) => {
    axios.get(`${route("model.videos", {
      id: category.id
    })}?page=${page}`).then((resp) => {
      setVideos(resp.data);
      setLoading(false);
    }).catch((Err) => {
      var _a, _b;
      return toast.error((_b = (_a = Err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message);
    });
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "mt-5",
    children: [loading && /* @__PURE__ */ jsx("div", {
      className: "my-3",
      children: /* @__PURE__ */ jsx(Spinner, {})
    }), /* @__PURE__ */ jsx(Modal, {
      show: modal,
      onClose: (e) => setModal(false),
      children: playVideo && /* @__PURE__ */ jsx(SingleVideo, {
        video: playVideo,
        inModal: true
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
      children: videos.data && videos.data.map((v) => /* @__PURE__ */ jsxs("div", {
        className: "border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */ jsx(Link, {
            href: route("video.single.page", {
              id: v.id
            }),
            children: /* @__PURE__ */ jsx("img", {
              src: v.thumbnail,
              className: "rounded-tl-lg rounded-tr-lg mb-3 ",
              alt: ""
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
      }, `vid-${v.id}`))
    }), videos.total > 9 && /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx(SecondaryButton, {
        className: "mr-2",
        processing: videos.prev_page_url ? false : true,
        onClick: (e) => getVideos(videos.current_page - 1),
        children: __("Prev")
      }), /* @__PURE__ */ jsx(SecondaryButton, {
        processing: videos.next_page_url ? false : true,
        onClick: (e) => getVideos(videos.current_page + 1),
        children: __("Next")
      })]
    }), videos.total === 0 && /* @__PURE__ */ jsx("div", {
      className: "dark:text-white dark:bg-zinc-900 rounded-lg px-3 py-5 text-gray-600 bg-white shadow",
      children: __("No videos availavle in this model")
    })]
  });
}
export {
  ChannelVideos as default
};
