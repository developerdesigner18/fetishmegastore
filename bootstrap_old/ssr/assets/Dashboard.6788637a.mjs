import "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
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
function Dashboard(props) {
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth: props.auth,
    errors: props.errors,
    header: /* @__PURE__ */ jsx("h2", {
      className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight",
      children: __("Dashboard")
    }),
    children: [/* @__PURE__ */ jsx(Head, {
      title: "Dashboard"
    }), /* @__PURE__ */ jsx("div", {
      className: "py-12",
      children: /* @__PURE__ */ jsx("div", {
        className: "px-auto sm:px-6 lg:px-8",
        children: /* @__PURE__ */ jsx("div", {
          className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg",
          children: /* @__PURE__ */ jsx("div", {
            className: "p-6 text-gray-900 dark:text-gray-100",
            children: __("You're logged in!")
          })
        })
      })
    })]
  });
}
export {
  Dashboard as default
};
