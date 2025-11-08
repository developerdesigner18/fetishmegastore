import "react";
import { usePage, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import { Inertia } from "@inertiajs/inertia";
import { F as Front } from "./Front.602cce17.mjs";
import { j as jsxs, a as jsx } from "../app.mjs";
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
function Packages({
  packs
}) {
  const {
    currency_symbol,
    currency_code
  } = usePage().props;
  return /* @__PURE__ */ jsxs(Front, {
    extraHeader: true,
    extraHeaderTitle: __("Token Packages"),
    extraHeaderText: "",
    extraHeaderImage: "/images/get-tokens-icon.png",
    extraImageHeight: "h-12",
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Get Tokens")
    }), /* @__PURE__ */ jsx("div", {
      className: " dark:bg-zinc-900 max-w-5xl -mt-[80px] py-5",
      children: /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4 mt-5",
        children: packs.map((pack) => /* @__PURE__ */ jsxs("div", {
          className: "rounded-lg mt-5 mr-5 p-4 bg-slate-100 mx-auto shadow  dark:bg-zinc-700 w-full",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-3",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
                className: "h-6 w-6 dark:text-white"
              }), " "]
            }), /* @__PURE__ */ jsx("div", {
              children: /* @__PURE__ */ jsx("h5", {
                className: "text-lg font-bold dark:text-white",
                children: __(":tokens Tokens", {
                  tokens: pack.tokensFormatted
                })
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "text-center mt-2",
            children: [/* @__PURE__ */ jsxs("h5", {
              className: "text-lg font-light dark:text-white",
              children: [currency_symbol, pack.price, " ", currency_code]
            }), /* @__PURE__ */ jsx("button", {
              onClick: (e) => Inertia.visit(route("token.selectGateway", {
                tokenPack: pack.id
              })),
              className: "w-full text-center bg-black hover:bg-zinc-800 text-white rounded-lg py-1.5 mt-3 dark:bg-indigo-700 dark:hover:bg-indigo-800",
              children: __("Purchase")
            })]
          })]
        }, pack.id))
      })
    })]
  });
}
export {
  Packages as default
};
