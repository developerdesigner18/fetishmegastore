import { _ as __ } from "./Translate.346b89d9.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { useState } from "react";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import { usePage, Head, Link } from "@inertiajs/inertia-react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { Inertia } from "@inertiajs/inertia";
import { AiOutlineEye } from "react-icons/ai/index.js";
/* empty css                             */import "react-dom";
import { BsTagFill } from "react-icons/bs/index.js";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
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
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-toastify";
import "lodash.debounce";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
function VideosOrdered({
  videos
}) {
  useState(false);
  useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  usePage().props;
  const searchVideos = (e) => {
    e.preventDefault();
    console.log(`Would visit: ${route("myFavorites")}?search_term=${searchTerm}`);
    Inertia.visit(`${route("myFavorites")}?search_term=${searchTerm}`, {
      method: "GET",
      preserveState: true,
      only: videos
    });
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Favorites Videos")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "fav-videos"
      }), /* @__PURE__ */ jsx("div", {
        className: "ml-0 w-full",
        children: /* @__PURE__ */ jsxs("div", {
          className: "p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
          children: [/* @__PURE__ */ jsxs("header", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-lg md:text-xl font-medium text-gray-600 dark:text-gray-100",
              children: __("My Favorites Videos")
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
            children: videos.data.map((v) => {
              var _a, _b, _c, _d, _e;
              return /* @__PURE__ */ jsxs("div", {
                className: "w-full mt-10",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-start",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "mr-5 flex flex-col items-center flex-shrink-0",
                    children: /* @__PURE__ */ jsx(Link, {
                      href: route("channel", {
                        user: (_a = v.streamer) == null ? void 0 : _a.username
                      }),
                      children: /* @__PURE__ */ jsx("img", {
                        src: (_b = v.streamer) == null ? void 0 : _b.profile_picture,
                        className: "w-14 h-14 rounded-full"
                      })
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h3", {
                      className: "text-lg md:text-2xl font-light text-gray-600 dark:text-white",
                      children: v.title
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center flex-wrap md:space-x-2 mt-1",
                      children: [/* @__PURE__ */ jsxs(Link, {
                        href: route("channel", {
                          user: (_c = v.streamer) == null ? void 0 : _c.username
                        }),
                        className: "text-sm text-gray-600 mr-2  dark:text-white",
                        children: ["@", (_d = v.streamer) == null ? void 0 : _d.username]
                      }), (_e = v.selectedCategory) == null ? void 0 : _e.map((category, index) => /* @__PURE__ */ jsxs(Link, {
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
                      })), /* @__PURE__ */ jsxs("span", {
                        className: "text-gray-600 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm mr-2   ",
                        children: [/* @__PURE__ */ jsx(AiOutlineEye, {
                          className: "w-5 h-5 mr-1"
                        }), v.views === 1 ? __("1 view") : __(":viewsCount views", {
                          viewsCount: v.views
                        })]
                      })]
                    })]
                  })]
                }), /* @__PURE__ */ jsx("video", {
                  className: "w-full rounded-lg aspect-video",
                  controls: true,
                  disablePictureInPicture: true,
                  controlsList: "nodownload",
                  poster: v.thumbnail,
                  children: /* @__PURE__ */ jsx("source", {
                    src: `${v.videoUrl}`,
                    type: "video/mp4"
                  })
                })]
              }, `video-${v.id}`);
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
        })
      })]
    })]
  });
}
export {
  VideosOrdered as default
};
