import { _ as __ } from "./Translate.346b89d9.mjs";
import { usePage, Head, Link } from "@inertiajs/inertia-react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { FiUserMinus } from "react-icons/fi/index.js";
import { AiOutlineUserSwitch } from "react-icons/ai/index.js";
import axios from "axios";
import { toast } from "react-toastify";
import { Inertia } from "@inertiajs/inertia";
import AccountNavi from "./AccountNavi.87076860.mjs";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "react";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "lodash.debounce";
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
function Following({
  following
}) {
  const {
    auth
  } = usePage().props;
  const unfollowUser = (e, userId) => {
    e.preventDefault();
    axios.get(route("follow", {
      user: userId
    })).then((apiRes) => {
      console.log(Inertia.reload());
    }).catch((Error) => {
      var _a, _b;
      return toast.error((_b = (_a = Error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.error);
    });
  };
  const activeTabClass = "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
  const inactiveTabClass = "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Following")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "following"
      }), /* @__PURE__ */ jsxs("div", {
        className: "w-full",
        children: [auth.user.is_streamer === "yes" && /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx(Link, {
            href: route("channel.followers", {
              user: auth.user.username
            }),
            className: inactiveTabClass,
            children: __("Followers")
          }), /* @__PURE__ */ jsx(Link, {
            href: route("profile.followings"),
            className: activeTabClass,
            children: __("Following")
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-5 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
          children: [/* @__PURE__ */ jsx("header", {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-start space-x-3",
              children: [/* @__PURE__ */ jsx("div", {
                children: /* @__PURE__ */ jsx(AiOutlineUserSwitch, {
                  className: "w-8 h-8 text-gray-600 dark:text-white"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsxs("h2", {
                  className: "text-lg md:text-xl font-medium text-gray-600 dark:text-gray-100",
                  children: [__("My Followings"), " (", following.length, ")"]
                }), /* @__PURE__ */ jsx("p", {
                  className: "mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400",
                  children: __("These are the channels that you are following")
                })]
              })]
            })
          }), /* @__PURE__ */ jsx("hr", {
            className: "my-5"
          }), following.length === 0 && /* @__PURE__ */ jsxs("div", {
            className: "text-xl dark:text-white text-gray-700 flex items-center space-x-4",
            children: [/* @__PURE__ */ jsx(FiUserMinus, {
              className: "w-10 h-10"
            }), /* @__PURE__ */ jsx("div", {
              children: __("You are not following any channel yet")
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex flex-col md:flex-row flex-wrap md:items-center",
            children: following.map((user, index) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center space-x-2  mr-5 mb-5",
              children: [/* @__PURE__ */ jsx("div", {
                children: /* @__PURE__ */ jsx(Link, {
                  href: `${user.followable.is_streamer === "yes" ? route("channel", {
                    user: user.followable.username
                  }) : ""}`,
                  children: /* @__PURE__ */ jsx("img", {
                    src: user.followable.profile_picture,
                    alt: "",
                    className: "rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                  })
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx(Link, {
                  className: "block text-gray-600 dark:text-gray-300 text-lg font-semibold mt-1",
                  href: `${user.followable.is_streamer === "yes" ? route("channel", {
                    user: user.followable.username
                  }) : ""}`,
                  children: user.followable.name
                }), /* @__PURE__ */ jsxs(Link, {
                  className: "block text-sky-500 hover:text-sky-700 font-semibold text-sm",
                  href: `${user.followable.is_streamer === "yes" ? route("channel", {
                    user: user.followable.username
                  }) : ""}`,
                  children: ["@", user.followable.username]
                }), /* @__PURE__ */ jsx("button", {
                  className: "text-xs text-rose-600 hover:text-rose-800",
                  onClick: (e) => unfollowUser(e, user.followable.id),
                  children: __("Unfollow")
                })]
              })]
            }, index))
          })]
        })]
      })]
    })]
  });
}
export {
  Following as default
};
