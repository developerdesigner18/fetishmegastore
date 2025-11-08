import "react";
import { Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { F as Front } from "./Front.602cce17.mjs";
import { j as jsxs, a as jsx } from "../app.mjs";
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
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function BankTransferProcessing({
  bankImg
}) {
  return /* @__PURE__ */ jsxs(Front, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Bank Transfer - Request Processing")
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-4 sm:p-8 bg-white max-w-3xl mx-auto dark:bg-zinc-900 shadow sm:rounded-lg",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex justify-center items-center",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mr-2",
          children: /* @__PURE__ */ jsx("img", {
            src: bankImg,
            alt: "bank img",
            className: "h-14"
          })
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("h3", {
            className: "text-3xl font-semibold dark:text-white text-center",
            children: __("Bank Transfer - Request Processing")
          })
        })]
      }), /* @__PURE__ */ jsx("h3", {
        className: "mt-10 text-xl dark:text-white text-center",
        children: __("Your request has been sent and is processing. Once the platform admin verifies your payment your balance will be adjusted accordingly.")
      })]
    })]
  });
}
export {
  BankTransferProcessing as default
};
