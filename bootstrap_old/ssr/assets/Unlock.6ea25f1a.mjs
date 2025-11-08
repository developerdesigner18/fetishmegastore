import { _ as __ } from "./Translate.346b89d9.mjs";
import { usePage, Head, Link } from "@inertiajs/inertia-react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { MdGeneratingTokens, MdOutlineAccountBalanceWallet } from "react-icons/md/index.js";
import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/bs/index.js";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "react-toastify";
import "lodash.debounce";
import "axios";
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
function Subscribe({
  video
}) {
  const {
    auth
  } = usePage().props;
  const [processing, setProcessing] = useState(false);
  const confirmPurchase = (e) => {
    e.preventDefault();
    Inertia.visit(route("video.purchase", {
      video: video.id
    }), {
      method: "POST",
      onBefore: (visit) => {
        setProcessing(true);
      },
      onFinish: (visit) => {
        setProcessing(false);
      }
    });
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Unlock Video: :videoTitle", {
        video: video.title
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "ml-0",
      children: /* @__PURE__ */ jsxs("div", {
        className: "p-4 sm:p-8 bg-gray-100 dark:bg-zinc-900 shadow sm:rounded-lg",
        children: [/* @__PURE__ */ jsx("header", {
          children: /* @__PURE__ */ jsxs("div", {
            className: "justify-center flex items-center space-x-2 flex-wrap",
            children: [/* @__PURE__ */ jsx("div", {
              children: /* @__PURE__ */ jsx(Link, {
                href: route("channel", {
                  user: video.streamer.username
                }),
                children: /* @__PURE__ */ jsx("img", {
                  src: video.streamer.profile_picture,
                  alt: "",
                  className: "rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                })
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx(Link, {
                href: route("channel", {
                  user: video.streamer.username
                }),
                children: /* @__PURE__ */ jsx("h2", {
                  className: "text-center text-2xl font-medium text-gray-800 dark:text-gray-100",
                  children: __("Unlock :videoTitle", {
                    videoTitle: video.title
                  })
                })
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-1 text-sm text-gray-600 dark:text-gray-400 text-center",
                children: __("Confirm your purchase")
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "border-t pt-5 text-xl text-center font-light mt-8 dark:text-white",
          children: [/* @__PURE__ */ jsxs("p", {
            className: "bg-white shadow text-gray-800 font-semibold inline-flex rounded-lg p-2",
            children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
              className: "h-6 w-6"
            }), " ", __("Price: :price tokens", {
              price: video.price
            })]
          }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsxs("p", {
            className: "mt-3 bg-white shadow text-gray-800 text-sm font-semibold inline-flex rounded-lg p-2",
            children: [" ", /* @__PURE__ */ jsx(MdOutlineAccountBalanceWallet, {
              className: "w-4 h-4"
            }), " ", __("Your Balance: :userBalance tokens", {
              userBalance: auth.user.tokens
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-5 border-t pt-5",
            children: video.price <= auth.user.tokens ? /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsxs("button", {
                onClick: (e) => confirmPurchase(e),
                className: "py-2 px-3 mt-2 mb-3 inline-flex rounded-md items-center bg-pink-500 text-white font-semibold hover:bg-pink-600 disabled:bg-gray-300 disabled:text-gray-700",
                disabled: processing,
                children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
                  className: "h-6 w-6 mr-2"
                }), /* @__PURE__ */ jsx("div", {
                  children: __("Purchase Video")
                })]
              }), /* @__PURE__ */ jsx("br", {}), processing && /* @__PURE__ */ jsx("center", {
                children: /* @__PURE__ */ jsx(Spinner, {})
              })]
            }) : /* @__PURE__ */ jsxs("div", {
              className: "text-gray-700 dark:text-white text-base",
              children: [__("You need to charge your token balance to be able to unlock this video"), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsxs(Link, {
                href: route("token.packages"),
                className: "py-1.5 px-3 mt-2 inline-flex border-2 rounded-md hover:border-gray-700 hover:text-gray-700 items-center border-indigo-600 text-indigo-600 dark:border-white dark:text-white dark:hover:border-indigo-200 dark:hover:text-indigo-200",
                children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
                  className: "h-6 w-6 mr-2"
                }), /* @__PURE__ */ jsx("div", {
                  children: __("Token Packages")
                })]
              })]
            })
          })]
        })]
      })
    })]
  });
}
export {
  Subscribe as default
};
