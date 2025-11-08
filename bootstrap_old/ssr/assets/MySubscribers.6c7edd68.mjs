import { _ as __ } from "./Translate.346b89d9.mjs";
import { usePage, Head, Link } from "@inertiajs/inertia-react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { FiUserMinus } from "react-icons/fi/index.js";
import { FaGrinStars } from "react-icons/fa/index.js";
import { GoCalendar } from "react-icons/go/index.js";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
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
function MySubscribers({
  subs
}) {
  var _a;
  const {
    auth
  } = usePage().props;
  console.log(subs);
  const activeTabClass = "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
  const inactiveTabClass = "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("My Subscribers")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "my-subscribers"
      }), /* @__PURE__ */ jsxs("div", {
        className: "ml-0 w-full",
        children: [auth.user.is_streamer === "yes" && /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx(Link, {
            href: route("mySubscribers", {
              user: auth.user.username
            }),
            className: activeTabClass,
            children: __("My Subscribers")
          }), /* @__PURE__ */ jsx(Link, {
            href: route("mySubscriptions"),
            className: inactiveTabClass,
            children: __("My Subscriptions")
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-5 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
          children: [/* @__PURE__ */ jsx("header", {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-start space-x-3",
              children: [/* @__PURE__ */ jsx("div", {
                children: /* @__PURE__ */ jsx(FaGrinStars, {
                  className: "w-8 h-8 text-gray-600 dark:text-white"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsxs("h2", {
                  className: "text-lg md:text-xl font-medium text-gray-600 dark:text-gray-100",
                  children: [__("My Subscribers"), " (", subs.total, ")"]
                }), /* @__PURE__ */ jsx("p", {
                  className: "mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400",
                  children: __("These are the users that paid a for a tier on your channel")
                })]
              })]
            })
          }), /* @__PURE__ */ jsx("hr", {
            className: "my-5"
          }), subs.total === 0 && /* @__PURE__ */ jsxs("div", {
            className: "text-xl dark:text-white text-gray-700 flex items-center space-x-4",
            children: [/* @__PURE__ */ jsx(FiUserMinus, {
              className: "w-10 h-10"
            }), /* @__PURE__ */ jsx("div", {
              children: __("No one is subscribed to your channel yet")
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex flex-col md:flex-row flex-wrap items-center",
            children: (_a = subs.data) == null ? void 0 : _a.map((user, index) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center space-x-2  mr-5 mb-5",
              children: [/* @__PURE__ */ jsx("div", {
                children: /* @__PURE__ */ jsx(Link, {
                  href: `${user.subscriber.is_streamer === "yes" ? route("channel", {
                    user: user.subscriber.username
                  }) : ""}`,
                  children: /* @__PURE__ */ jsx("img", {
                    src: user.subscriber.profile_picture,
                    alt: "",
                    className: "rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                  })
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx(Link, {
                  className: "block text-gray-600 dark:text-gray-300 text-lg font-semibold mt-1",
                  href: `${user.subscriber.is_streamer === "yes" ? route("channel", {
                    user: user.subscriber.username
                  }) : ""}`,
                  children: user.subscriber.name
                }), /* @__PURE__ */ jsxs(Link, {
                  className: "block text-sky-500 hover:text-sky-700 font-semibold text-sm",
                  href: `${user.subscriber.is_streamer === "yes" ? route("channel", {
                    user: user.subscriber.username
                  }) : ""}`,
                  children: ["@", user.subscriber.username]
                }), /* @__PURE__ */ jsxs("span", {
                  className: "mt-1 inline-flex items-center space-x-2 rounded px-1.5 py-0.5 bg-gray-500 text-gray-100 text-xs",
                  children: [/* @__PURE__ */ jsx(GoCalendar, {
                    className: "dark:text-white mr-1"
                  }), user.expires_human]
                })]
              })]
            }, index))
          }), subs.last_page > 1 && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx("hr", {
              className: "my-5"
            }), /* @__PURE__ */ jsx("div", {
              className: "flex text-gray-600 my-3 text-sm",
              children: __("Page: :pageNumber of :lastPage", {
                pageNumber: subs.current_page,
                lastPage: subs.last_page
              })
            }), /* @__PURE__ */ jsx(SecondaryButton, {
              processing: subs.prev_page_url ? false : true,
              className: "mr-3",
              onClick: (e) => Inertia.visit(subs.prev_page_url),
              children: __("Previous")
            }), /* @__PURE__ */ jsx(SecondaryButton, {
              processing: subs.next_page_url ? false : true,
              onClick: (e) => Inertia.visit(subs.next_page_url),
              children: __("Next")
            })]
          })]
        })]
      })]
    })]
  });
}
export {
  MySubscribers as default
};
