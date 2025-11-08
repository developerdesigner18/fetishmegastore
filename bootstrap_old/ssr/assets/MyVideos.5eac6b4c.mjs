import { _ as __ } from "./Translate.346b89d9.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { D as DangerButton } from "./DangerButton.5b75de10.mjs";
import { Head, Link } from "@inertiajs/inertia-react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { Inertia } from "@inertiajs/inertia";
import { AiOutlineEdit } from "react-icons/ai/index.js";
import { RiDeleteBin5Line } from "react-icons/ri/index.js";
import { Tooltip } from "react-tooltip";
/* empty css                             */import { useState } from "react";
import { M as Modal } from "./Modal.c4c8f017.mjs";
import { BsTagFill } from "react-icons/bs/index.js";
import AccountNavi from "./AccountNavi.87076860.mjs";
import { MdOutlineVideoLibrary } from "react-icons/md/index.js";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/bi/index.js";
import "antd";
import "@headlessui/react";
import "react-toastify";
import "lodash.debounce";
import "axios";
import "./TextInput.7d39776a.mjs";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "react-dom";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Upload({
  videos
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const confirmDelete = (e, id) => {
    e.preventDefault();
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };
  const deleteVideo = () => {
    Inertia.visit(route("videos.delete"), {
      method: "POST",
      data: {
        video: deleteId
      },
      preserveState: false
    });
  };
  const activeTabClass = "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
  const inactiveTabClass = "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Videos")
    }), /* @__PURE__ */ jsx(Modal, {
      show: showDeleteConfirmation,
      onClose: (e) => setShowDeleteConfirmation(false),
      children: /* @__PURE__ */ jsxs("div", {
        className: "px-5 py-10 text-center",
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-xl mb-3 text-zinc-700 dark:text-white",
          children: __("Are you sure you want to remove this Video?")
        }), /* @__PURE__ */ jsx(DangerButton, {
          onClick: (e) => deleteVideo(),
          children: __("Yes")
        }), /* @__PURE__ */ jsx(SecondaryButton, {
          className: "ml-3",
          onClick: (e) => setShowDeleteConfirmation(false),
          children: __("No")
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "upload-videos"
      }), /* @__PURE__ */ jsxs("div", {
        className: "ml-0",
        children: [/* @__PURE__ */ jsx(Link, {
          href: route("videos.list"),
          className: activeTabClass,
          children: __("Upload Videos")
        }), /* @__PURE__ */ jsx(Link, {
          href: route("videos.ordered"),
          className: inactiveTabClass,
          children: __("Videos Ordered")
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-5 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
          children: [/* @__PURE__ */ jsxs("header", {
            children: [/* @__PURE__ */ jsxs("h2", {
              className: "text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100",
              children: [/* @__PURE__ */ jsx(MdOutlineVideoLibrary, {
                className: "mr-2"
              }), __("My Videos")]
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400",
              children: __("Upload & manage videos for the channel")
            }), /* @__PURE__ */ jsx(PrimaryButton, {
              onClick: (e) => Inertia.visit(route("videos.upload")),
              children: __("Upload Video")
            })]
          }), /* @__PURE__ */ jsx("hr", {
            className: "my-5"
          }), videos.total === 0 && /* @__PURE__ */ jsx("div", {
            className: "text-gray-600 dark:text-white",
            children: __("You didn't upload any videos yet.")
          }), videos.total !== 0 && /* @__PURE__ */ jsx("div", {
            className: "grid grid-cols-1 md:grid-cols-2 md:gap-x-5 gap-y-10",
            children: videos.data.map((v) => /* @__PURE__ */ jsxs("div", {
              className: "w-full md:w-[340px] xl:w-[420px] mt-5",
              children: [/* @__PURE__ */ jsx("video", {
                className: "w-full rounded-lg aspect-video",
                controls: true,
                disablePictureInPicture: true,
                controlsList: "nodownload",
                poster: v.thumbnail,
                children: /* @__PURE__ */ jsx("source", {
                  src: `${v.videoUrl}`,
                  type: "video/mp4"
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "my-3 h-6 overflow-hidden text-gray-600 text-sm font-semibold dark:text-white",
                children: [/* @__PURE__ */ jsx("a", {
                  "data-tooltip-content": v.title,
                  "data-tooltip-id": `tooltip-${v.id}`,
                  children: v.title
                }), /* @__PURE__ */ jsx(Tooltip, {
                  anchorSelect: "a"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "dark:text-white text-gray-600 flex items-center space-x-2 text-xs",
                children: [/* @__PURE__ */ jsx(BsTagFill, {
                  className: "mr-1"
                }), " ", v.categoryNames]
              }), /* @__PURE__ */ jsxs("div", {
                className: "mt-3 flex items-center space-x-2 text-sm justify-between",
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "text-gray-600 dark:text-white",
                  children: [__("Price"), " "]
                }), /* @__PURE__ */ jsx("span", {
                  className: "px-2 py-1 text-sm rounded-lg bg-sky-500 text-white",
                  children: v.price > 0 ? __(":tokensPrice tokens", {
                    tokensPrice: v.price
                  }) : __("Free")
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "mt-2 flex items-center space-x-2 text-sm justify-between",
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "text-gray-600 dark:text-white",
                  children: [__("Free for subs"), " "]
                }), /* @__PURE__ */ jsx("span", {
                  className: "px-2 py-1 rounded-lg bg-teal-500 text-white",
                  children: v.free_for_subs
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex mt-2 items-center space-x-2 text-sm justify-between",
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "text-gray-600 dark:text-white",
                  children: [__("Views"), " "]
                }), /* @__PURE__ */ jsx("span", {
                  className: "px-2 py-1 rounded-lg bg-gray-500 text-white",
                  children: v.views
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex mt-2 items-center space-x-2 text-sm justify-between",
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "text-gray-600 dark:text-white",
                  children: [__("Earnings"), " "]
                }), /* @__PURE__ */ jsx("span", {
                  className: "px-2 py-1 rounded-lg bg-pink-500 text-white",
                  children: v.sales_sum_price ? __(":salesTokens tokens", {
                    salesTokens: v.sales_sum_price
                  }) : "--"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "border-t pt-3 mt-3  flex items-center",
                children: [/* @__PURE__ */ jsx(Link, {
                  href: route("videos.edit", {
                    video: v.id
                  }),
                  children: /* @__PURE__ */ jsx(AiOutlineEdit, {
                    className: "w-6 h-6 mr-2 text-sky-600"
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: (e) => confirmDelete(e, v.id),
                  children: /* @__PURE__ */ jsx(RiDeleteBin5Line, {
                    className: "text-red-600 w-5 h-5"
                  })
                })]
              })]
            }, `video-${v.id}`))
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
  Upload as default
};
