import "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { usePage, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { HiIdentification } from "react-icons/hi/index.js";
import { j as jsxs, a as jsx } from "../app.mjs";
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
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function StreamerVerification() {
  const {
    auth
  } = usePage().props;
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Pending Verification")
    }), /* @__PURE__ */ jsx("div", {
      className: "ml-0",
      children: /* @__PURE__ */ jsxs("div", {
        className: "p-4 sm:p-8 bg-gray-100 dark:bg-zinc-900 dark:text-white shadow sm:rounded-lg",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx(HiIdentification, {
              className: "h-12 w-12 mr-2"
            })
          }), /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-gray-900 dark:text-gray-100",
              children: __("Pending Verification")
            })
          })]
        }), /* @__PURE__ */ jsx("p", {
          className: "dark:text-white text-lg",
          children: __("We have received your identity verification request and will analyse it as soon as possible.")
        })]
      })
    })]
  });
}
export {
  StreamerVerification as default
};
