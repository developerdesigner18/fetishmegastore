import { useState, useRef } from "react";
import { D as DangerButton } from "./DangerButton.5b75de10.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { M as Modal } from "./Modal.c4c8f017.mjs";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { useForm } from "@inertiajs/inertia-react";
import { j as jsxs, a as jsx } from "../app.mjs";
import "react-dom";
import "@headlessui/react";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function DeleteUserForm({
  className
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef();
  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors
  } = useForm({
    password: ""
  });
  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };
  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current.focus(),
      onFinish: () => reset()
    });
  };
  const closeModal = () => {
    setConfirmingUserDeletion(false);
    reset();
  };
  return /* @__PURE__ */ jsxs("section", {
    className: `space-y-6 ${className}`,
    children: [/* @__PURE__ */ jsxs("header", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-lg font-medium text-gray-900 dark:text-gray-100",
        children: "Delete Account"
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-1 text-sm text-gray-600 dark:text-gray-400",
        children: "Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain."
      })]
    }), /* @__PURE__ */ jsx(DangerButton, {
      onClick: confirmUserDeletion,
      children: "Delete Account"
    }), /* @__PURE__ */ jsx(Modal, {
      show: confirmingUserDeletion,
      onClose: closeModal,
      children: /* @__PURE__ */ jsxs("form", {
        onSubmit: deleteUser,
        className: "p-6",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-lg font-medium text-gray-900 dark:text-gray-100",
          children: "Are you sure your want to delete your account?"
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-1 text-sm text-gray-600 dark:text-gray-400",
          children: "Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account."
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-6",
          children: [/* @__PURE__ */ jsx(InputLabel, {
            for: "password",
            value: "Password",
            className: "sr-only"
          }), /* @__PURE__ */ jsx(TextInput, {
            id: "password",
            type: "password",
            name: "password",
            ref: passwordInput,
            value: data.password,
            handleChange: (e) => setData("password", e.target.value),
            className: "mt-1 block w-3/4",
            isFocused: true,
            placeholder: "Password"
          }), /* @__PURE__ */ jsx(InputError, {
            message: errors.password,
            className: "mt-2"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-6 flex justify-end",
          children: [/* @__PURE__ */ jsx(SecondaryButton, {
            onClick: closeModal,
            children: "Cancel"
          }), /* @__PURE__ */ jsx(DangerButton, {
            className: "ml-3",
            processing,
            children: "Delete Account"
          })]
        })]
      })
    })]
  });
}
export {
  DeleteUserForm as default
};
