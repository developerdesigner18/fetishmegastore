import "react";
import { F as Front } from "./Front.602cce17.mjs";
import { usePage, Head } from "@inertiajs/inertia-react";
import { j as jsxs, a as jsx } from "../app.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "./Translate.346b89d9.mjs";
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
function Page({
  page
}) {
  usePage().props;
  return /* @__PURE__ */ jsxs(Front, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: page.page_title
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-4 sm:p-8 bg-white max-w-3xl mx-auto dark:bg-zinc-900 shadow sm:rounded-lg",
      children: [/* @__PURE__ */ jsx("h3", {
        className: "text-2xl font-semibold dark:text-white text-center border-b pb-5 mb-5",
        children: page.page_title
      }), /* @__PURE__ */ jsx("div", {
        className: "static-page dark:text-white",
        dangerouslySetInnerHTML: {
          __html: page.page_content
        }
      })]
    })]
  });
}
export {
  Page as default
};
