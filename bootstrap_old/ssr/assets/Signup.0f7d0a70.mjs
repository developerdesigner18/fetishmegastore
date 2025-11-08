import { useEffect } from "react";
import { usePage, Link } from "@inertiajs/inertia-react";
import { F as Front } from "./Front.602cce17.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { toast } from "react-toastify";
import { a as jsx, j as jsxs } from "../app.mjs";
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
function Signup({
  props,
  logoIcon
}) {
  const {
    flash
  } = usePage().props;
  useEffect(() => {
    if (flash == null ? void 0 : flash.message) {
      toast(flash.message);
    }
  }, [flash]);
  return /* @__PURE__ */ jsx(Front, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "bg-white mx-auto dark:bg-zinc-900 rounded-lg shadow py-5 max-w-5xl text-center",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-3xl text-gray-600 dark:text-zinc-200 font-semibold text-center",
        children: __("Join Our Platform")
      }), /* @__PURE__ */ jsx("p", {
        children: __("Sign up now and enjoy:\n                        Exclusive videos: Access a vast library of high-quality content.\n                        Fresh updates: New videos added regularly to keep things exciting.\n                        Personalized experience: Tailored recommendations just for you.\nJoin our community and indulge in the ultimate adult entertainment experience.")
      }), /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-2 mt-10 gap-2",
        children: /* @__PURE__ */ jsxs("div", {
          className: "col text-center",
          children: [/* @__PURE__ */ jsx(Link, {
            href: route("register"),
            children: /* @__PURE__ */ jsx("img", {
              src: logoIcon,
              alt: "",
              className: "max-h-96 rounded-full mx-auto border-zinc-200  dark:border-indigo-200 border-4"
            })
          }), /* @__PURE__ */ jsx(Link, {
            href: route("register"),
            className: "bg-indigo-700 inline-block mt-5 text-white font-bold py-2 px-4 rounded mb-4 hover:bg-indigo-600",
            children: __("Register")
          })]
        })
      })]
    })
  });
}
export {
  Signup as default
};
