import "react";
import { usePage, Link } from "@inertiajs/inertia-react";
import { a as jsx, F as Fragment, j as jsxs } from "../app.mjs";
function ApplicationLogo() {
  const {
    logo
  } = usePage().props;
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("div", {
      className: "bg-black rounded-full p-5",
      children: /* @__PURE__ */ jsx("img", {
        src: logo,
        alt: "logo",
        className: "h-8"
      })
    })
  });
}
function Guest({
  children
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900",
    children: [/* @__PURE__ */ jsx("div", {
      children: /* @__PURE__ */ jsx(Link, {
        href: "/",
        children: /* @__PURE__ */ jsx(ApplicationLogo, {
          className: "w-20 h-20 fill-current text-gray-500"
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg",
      children
    })]
  });
}
export {
  Guest as G
};
