import "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import ChannelForm from "./ChannelForm.16ac4838.mjs";
import SetSchedule from "./SetSchedule.cee42a0e.mjs";
import AccountNavi from "./AccountNavi.731f7f7b.mjs";
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
import "./InputError.45933222.mjs";
import "./InputLabel.2f9ff89f.mjs";
import "./PrimaryButton.9fb48a50.mjs";
import "./Textarea.d2e6a2e3.mjs";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
import "./Spinner.a2c890cd.mjs";
import "./NumberInput.e1cdf2ea.mjs";
import "@inertiajs/inertia";
function Settings({
  auth,
  mustVerifyEmail,
  status
}) {
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Channel Settings")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10 w-full",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "channel-settings"
      }), /* @__PURE__ */ jsxs("div", {
        className: "p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
        children: [/* @__PURE__ */ jsx(ChannelForm, {
          mustVerifyEmail,
          status,
          className: "max-w-xl"
        }), /* @__PURE__ */ jsx(SetSchedule, {})]
      })]
    })]
  });
}
export {
  Settings as default
};
