import { useState } from "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { Head, Link } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { BsTagFill, BsFillTagsFill } from "react-icons/bs/index.js";
import { FcUnlock } from "react-icons/fc/index.js";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import axios from "axios";
import { FaGrinStars } from "react-icons/fa/index.js";
import { Inertia } from "@inertiajs/inertia";
import { a as jsx, j as jsxs } from "../app.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "react-toastify";
import "lodash.debounce";
import "./TextInput.7d39776a.mjs";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
const VideoComponent = ({
  video,
  inModal
}) => {
  var _a, _b;
  useState();
  const increaseViews = () => {
    axios.post(route("video.increaseViews", {
      video: video.id
    }));
  };
  return /* @__PURE__ */ jsxs("div", {
    className: `justify-center w-full ${inModal ? "p-3" : "p-0"}`,
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-start",
      children: [/* @__PURE__ */ jsx("div", {
        className: "mr-5 flex flex-col items-center flex-shrink-0",
        children: /* @__PURE__ */ jsx(Link, {
          href: route("channel", {
            user: video.streamer.username
          }),
          children: /* @__PURE__ */ jsx("img", {
            src: video.streamer.profile_picture,
            className: "w-14 h-14 rounded-full"
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-lg md:text-2xl font-light text-gray-600 dark:text-white",
          children: video.title
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center flex-wrap md:space-x-2 mt-1",
          children: [/* @__PURE__ */ jsxs(Link, {
            href: route("channel", {
              user: video.streamer.username
            }),
            className: "text-sm text-gray-600 mr-2  dark:text-white",
            children: ["@", video.streamer.username]
          }), (_a = video.selectedCategory) == null ? void 0 : _a.map((category, index) => /* @__PURE__ */ jsxs(Link, {
            href: route("videos.browse", {
              videocategory: category.value,
              slug: `-${category.label}`
            }),
            className: "text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm",
            children: [/* @__PURE__ */ jsx(BsTagFill, {
              className: "w-3"
            }), /* @__PURE__ */ jsx("span", {
              children: category.label
            })]
          })), /* @__PURE__ */ jsx(BsFillTagsFill, {
            className: "w-3"
          }), /* @__PURE__ */ jsx("span", {
            children: (_b = video == null ? void 0 : video.tags) == null ? void 0 : _b.map((tag, index) => /* @__PURE__ */ jsxs(Link, {
              href: route("tag.videos", {
                id: tag.id
              }),
              className: "text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm",
              children: [" ", /* @__PURE__ */ jsxs("span", {
                children: [tag, " ", index !== video.tags.length - 1 && ", "]
              })]
            }))
          }), video.free_for_subs === "yes" && video.price !== 0 && /* @__PURE__ */ jsxs("div", {
            className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600",
            children: [/* @__PURE__ */ jsx(FaGrinStars, {
              className: "w-4 h-4 mr-1"
            }), __("Free For Subscribers")]
          }), video.isCurrentSubscriber || video.canBePlayed && /* @__PURE__ */ jsx("div", {
            className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600",
            children: /* @__PURE__ */ jsx("a", {
              href: video.videoUrl,
              download: true,
              children: __("Download")
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600",
            children: /* @__PURE__ */ jsxs("span", {
              children: [" ", __("Duration "), " : ", video.duration.minute]
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600",
            children: /* @__PURE__ */ jsxs("span", {
              children: [" ", __("Resolution "), " : ", video.duration.resolution]
            })
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-5",
      children: video.canBePlayed ? /* @__PURE__ */ jsx("video", {
        className: "w-full aspect-video",
        controls: true,
        disablePictureInPicture: true,
        controlsList: "nodownload",
        onPlay: (e) => increaseViews(),
        children: /* @__PURE__ */ jsx("source", {
          src: `${video.videoUrl}#t`,
          type: "video/mp4"
        })
      }) : /* @__PURE__ */ jsx("div", {
        className: "flex flex-col items-center  md:flex-row space-y-5 md:space-y-0 md:space-x-5",
        children: /* @__PURE__ */ jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */ jsx("img", {
            src: video.thumbnail,
            alt: "",
            className: "rounded-lg w-full"
          }), /* @__PURE__ */ jsx("div", {
            className: "absolute top-0 left-0 text-center bg-gray-700 w-full h-full bg-opacity-25 rounded-lg ",
            children: /* @__PURE__ */ jsxs("div", {
              className: "relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-full",
                children: /* @__PURE__ */ jsx("div", {
                  className: "bg-white inline-flex bg-opacity-25 rounded-full p-2",
                  children: /* @__PURE__ */ jsx(FcUnlock, {
                    className: "w-12 h-12"
                  })
                })
              }), /* @__PURE__ */ jsx("div", {
                children: /* @__PURE__ */ jsxs(PrimaryButton, {
                  className: "h-12 mt-5 inline-flex",
                  onClick: (e) => Inertia.visit(route("video.unlock", {
                    video: video.id
                  })),
                  children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
                    className: "mr-2 w-6 h-6 md:w-8 md:h-8"
                  }), __("Unlock with :tokens tokens", {
                    tokens: video.price
                  })]
                })
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-5",
      children: video.description ? video.description : ""
    })]
  });
};
function SingleVideo({
  video,
  inModal = false
}) {
  if (inModal) {
    return /* @__PURE__ */ jsx(VideoComponent, {
      video,
      inModal: true
    });
  } else {
    return /* @__PURE__ */ jsxs(Authenticated, {
      children: [/* @__PURE__ */ jsx(Head, {
        title: video.title
      }), /* @__PURE__ */ jsx(VideoComponent, {
        video,
        inModal: false
      })]
    });
  }
}
export {
  SingleVideo as default
};
