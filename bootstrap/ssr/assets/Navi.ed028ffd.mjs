import { Link } from "@inertiajs/inertia-react";
import { j as jsxs, F as Fragment, a as jsx } from "../app.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Navi() {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Link, {
      href: "/reladmini/",
      children: /* @__PURE__ */ jsx("button", {
        children: "Dashboard"
      })
    }), /* @__PURE__ */ jsx(Link, {
      href: "/reladmini/profile",
      children: /* @__PURE__ */ jsx("button", {
        children: "Profile"
      })
    })]
  });
}
export {
  Navi as default
};
