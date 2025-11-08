import "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import DeleteUserForm from "./DeleteUserForm.0d58b6ca.mjs";
import UpdatePasswordForm from "./UpdatePasswordForm.b5b6a28a.mjs";
import UpdateProfileInformation from "./UpdateProfileInformationForm.962012e9.mjs";
import { Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import AccountNavi from "./AccountNavi.87076860.mjs";
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
import "./DangerButton.5b75de10.mjs";
import "./InputError.45933222.mjs";
import "./InputLabel.2f9ff89f.mjs";
import "./SecondaryButton.09a51f74.mjs";
import "./PrimaryButton.9fb48a50.mjs";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Edit({
  auth,
  mustVerifyEmail,
  status
}) {
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Profile")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "account"
      }), /* @__PURE__ */ jsxs("div", {
        className: "ml-0 w-full",
        children: [/* @__PURE__ */ jsx("div", {
          className: "p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
          children: /* @__PURE__ */ jsx(UpdateProfileInformation, {
            mustVerifyEmail,
            status,
            className: "max-w-xl"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-10 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
          children: /* @__PURE__ */ jsx(UpdatePasswordForm, {
            className: "max-w-xl"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-10 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
          children: /* @__PURE__ */ jsx(DeleteUserForm, {
            className: "max-w-xl"
          })
        })]
      })]
    })]
  });
}
export {
  Edit as default
};
