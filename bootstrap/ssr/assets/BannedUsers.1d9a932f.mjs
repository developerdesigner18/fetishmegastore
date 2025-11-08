import { _ as __ } from "./Translate.346b89d9.mjs";
import { usePage, Head, Link } from "@inertiajs/inertia-react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { FiUserMinus } from "react-icons/fi/index.js";
import { FaBan } from "react-icons/fa/index.js";
import AccountNavi from "./AccountNavi.f8b1d17e.mjs";
import { j as jsxs, a as jsx } from "../app.mjs";
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
import "react-toastify";
import "lodash.debounce";
import "axios";
import "./TextInput.7d39776a.mjs";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function BannedUsers({
  roomBans
}) {
  usePage().props;
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Banned Users")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "bans"
      }), /* @__PURE__ */ jsx("div", {
        className: "w-full",
        children: /* @__PURE__ */ jsxs("div", {
          className: "mt-5 p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg",
          children: [/* @__PURE__ */ jsx("header", {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-start space-x-3",
              children: [/* @__PURE__ */ jsx("div", {
                children: /* @__PURE__ */ jsx(FaBan, {
                  className: "w-8 h-8 text-gray-600 dark:text-white"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsxs("h2", {
                  className: "text-lg md:text-xl font-medium text-gray-600 dark:text-gray-100",
                  children: [__("Banned Users"), " (", roomBans.length, ")"]
                }), /* @__PURE__ */ jsx("p", {
                  className: "mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400",
                  children: __("These users can't view your live streams. To ban someone, simply click their username in the live chat.")
                })]
              })]
            })
          }), /* @__PURE__ */ jsx("hr", {
            className: "my-5"
          }), roomBans.length === 0 && /* @__PURE__ */ jsxs("div", {
            className: "text-xl dark:text-white text-gray-700 flex items-center space-x-4",
            children: [/* @__PURE__ */ jsx(FiUserMinus, {
              className: "w-10 h-10"
            }), /* @__PURE__ */ jsx("div", {
              children: __("No one is banned from your live streams")
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex flex-col md:flex-row flex-wrap md:items-center",
            children: roomBans.map((ban, index) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center space-x-2  mr-5 mb-5",
              children: [/* @__PURE__ */ jsx("div", {
                children: /* @__PURE__ */ jsx(Link, {
                  href: `${ban.user.is_streamer === "yes" ? route("channel", {
                    user: ban.user.username
                  }) : ""}`,
                  children: /* @__PURE__ */ jsx("img", {
                    src: ban.user.profile_picture,
                    alt: "",
                    className: "rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                  })
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx(Link, {
                  className: "block text-gray-600 dark:text-gray-300 text-lg font-semibold mt-1",
                  href: `${ban.user.is_streamer === "yes" ? route("channel", {
                    user: ban.user.username
                  }) : ""}`,
                  children: ban.user.name
                }), /* @__PURE__ */ jsxs(Link, {
                  className: "block text-sky-500 hover:text-sky-700 font-semibold text-sm",
                  href: `${ban.user.is_streamer === "yes" ? route("channel", {
                    user: ban.user.username
                  }) : ""}`,
                  children: ["@", ban.user.username]
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-gray-600 dark:text-gray-400",
                  children: __("Banned on :date", {
                    date: ban.banned_at_human
                  })
                }), /* @__PURE__ */ jsx(Link, {
                  href: route("channel.liftUserBan", {
                    roomban: ban.id
                  }),
                  className: "text-xs text-rose-600 hover:text-rose-800",
                  children: __("Unban")
                })]
              })]
            }, index))
          })]
        })
      })]
    })]
  });
}
export {
  BannedUsers as default
};
