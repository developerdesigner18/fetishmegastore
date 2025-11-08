import { useState } from "react";
import { I as InputError } from "./InputError.45933222.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { usePage, useForm, Link } from "@inertiajs/inertia-react";
import { Transition } from "@headlessui/react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { j as jsxs, a as jsx } from "../app.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className
}) {
  const user = usePage().props.auth.user;
  const [previewProfile, setPreviewProfile] = useState(user.profile_picture);
  const {
    data,
    setData,
    post,
    errors,
    processing,
    recentlySuccessful
  } = useForm({
    name: user.name,
    email: user.email,
    username: user.username
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("profile.update"), {
      preserveState: false
    });
  };
  const changeProfilePicture = (file) => {
    setData("profilePicture", file);
    setPreviewProfile((window.URL ? URL : webkitURL).createObjectURL(file));
  };
  return /* @__PURE__ */ jsxs("section", {
    className,
    children: [/* @__PURE__ */ jsxs("header", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-lg font-medium text-gray-900 dark:text-gray-100",
        children: __("Profile Information")
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-1 text-sm text-gray-600 dark:text-gray-400",
        children: __("Update your account's profile information and email address.")
      })]
    }), /* @__PURE__ */ jsxs("form", {
      onSubmit: submit,
      className: "mt-6 space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "username",
          value: __("Username")
        }), /* @__PURE__ */ jsx(TextInput, {
          id: "username",
          className: "mt-1 block w-full",
          value: data.username,
          handleChange: (e) => setData("username", e.target.value),
          required: true,
          autofocus: true
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.username
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "name",
          value: "Name"
        }), /* @__PURE__ */ jsx(TextInput, {
          id: "name",
          className: "mt-1 block w-full",
          value: data.name,
          handleChange: (e) => setData("name", e.target.value),
          required: true,
          autofocus: true,
          autocomplete: "name"
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.name
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "email",
          value: "Email"
        }), /* @__PURE__ */ jsx(TextInput, {
          id: "email",
          type: "email",
          className: "mt-1 block w-full",
          value: data.email,
          handleChange: (e) => setData("email", e.target.value),
          required: true,
          autocomplete: "email"
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.email
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "profilePicture",
          value: __("Profile Picture - 80x80 recommended")
        }), /* @__PURE__ */ jsx(TextInput, {
          className: "p-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900",
          id: "profilePicture",
          type: "file",
          handleChange: (e) => changeProfilePicture(e.target.files[0])
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.profilePicture
        }), /* @__PURE__ */ jsx("img", {
          src: previewProfile,
          alt: "profile picture",
          className: "h-20 rounded-full mt-2 border-white border-2 dark:border-indigo-200"
        })]
      }), mustVerifyEmail && user.email_verified_at === null && /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("p", {
          className: "text-sm mt-2 text-gray-800 dark:text-gray-200",
          children: [__("Your email address is unverified."), /* @__PURE__ */ jsx(Link, {
            href: route("verification.send"),
            method: "post",
            as: "button",
            className: "underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800",
            children: __("Click here to re-send the verification email.")
          })]
        }), status === "verification-link-sent" && /* @__PURE__ */ jsx("div", {
          className: "mt-2 font-medium text-sm text-green-600 dark:text-green-400",
          children: __("A new verification link has been sent to your email address.")
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(PrimaryButton, {
          processing,
          children: __("Save")
        }), /* @__PURE__ */ jsx(Transition, {
          show: recentlySuccessful,
          enterFrom: "opacity-0",
          leaveTo: "opacity-0",
          className: "transition ease-in-out",
          children: /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-gray-600 dark:text-gray-400",
            children: [__("Saved"), "."]
          })
        })]
      })]
    })]
  });
}
export {
  UpdateProfileInformation as default
};
