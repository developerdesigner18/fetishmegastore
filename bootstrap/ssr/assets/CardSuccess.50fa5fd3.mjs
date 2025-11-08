import "react";
import { Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { F as Front } from "./Front.602cce17.mjs";
import { BsFillBagCheckFill } from "react-icons/bs/index.js";
import { j as jsxs, a as jsx } from "../app.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
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
function CardSuccess({
  sale
}) {
  return /* @__PURE__ */ jsxs(Front, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Payment Successful - Thank you")
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-4 sm:p-8 bg-white max-w-3xl mx-auto dark:bg-zinc-900 shadow sm:rounded-lg",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex justify-center items-center",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mr-2",
          children: /* @__PURE__ */ jsx(BsFillBagCheckFill, {})
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("h3", {
            className: "text-3xl font-semibold dark:text-white text-center",
            children: __("Thank you for your payment")
          })
        })]
      }), /* @__PURE__ */ jsx("h3", {
        className: "mt-10 text-xl dark:text-white text-center",
        children: __("Thank you for your payment! :tokens tokens have been added to your balance!", {
          tokens: sale.tokens
        })
      })]
    })]
  });
}
export {
  CardSuccess as default
};
