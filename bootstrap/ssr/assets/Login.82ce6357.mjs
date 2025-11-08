import { useEffect } from "react";
import { useForm, Link } from "@inertiajs/inertia-react";
import { a as jsx, j as jsxs } from "../app.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import "react-toastify";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { F as Front } from "./Front.602cce17.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
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
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
function Login({
  status,
  canResetPassword,
  loginIcon
}) {
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    email: "",
    password: "",
    remember: ""
  });
  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("login"));
  };
  return /* @__PURE__ */ jsx(Front, {
    children: /* @__PURE__ */ jsx("div", {
      className: "p-5 md:p-10 mx-auto max-w-5xl bg-white dark:bg-zinc-900 shadow rounded-lg",
      children: /* @__PURE__ */ jsx("div", {
        className: "flex items-center flex-col md:flex-row md:space-x-10",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex-grow pt-10 w-full",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-3xl font-semibold text-gray-600 dark:text-zinc-200 text-center",
            children: __("Login to your account")
          }), /* @__PURE__ */ jsxs("p", {
            className: "mb-5 mt-1 text-center text-sm text-gray-600 dark:text-white",
            children: [__("Don't have an account?"), " ", /* @__PURE__ */ jsx(Link, {
              className: "dark:text-indigo-400 text-indigo-700 hover:underline",
              href: route("signup"),
              children: __("Signup")
            })]
          }), status && /* @__PURE__ */ jsx("div", {
            className: "mb-4 font-medium text-sm text-green-600",
            children: status
          }), /* @__PURE__ */ jsxs("form", {
            onSubmit: submit,
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx(InputLabel, {
                forInput: "email",
                value: "Email"
              }), /* @__PURE__ */ jsx(TextInput, {
                type: "email",
                name: "email",
                value: data.email,
                className: "mt-1 block w-full",
                autoComplete: "username",
                isFocused: false,
                handleChange: onHandleChange
              }), /* @__PURE__ */ jsx(InputError, {
                message: errors.email,
                className: "mt-2"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-4",
              children: [/* @__PURE__ */ jsx(InputLabel, {
                forInput: "password",
                value: "Password"
              }), /* @__PURE__ */ jsx(TextInput, {
                type: "password",
                name: "password",
                value: data.password,
                className: "mt-1 block w-full",
                autoComplete: "current-password",
                handleChange: onHandleChange
              }), /* @__PURE__ */ jsx(InputError, {
                message: errors.password,
                className: "mt-2"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-end mt-4",
              children: [canResetPassword && /* @__PURE__ */ jsx(Link, {
                href: route("password.request"),
                className: "underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800",
                children: __("Forgot your password?")
              }), /* @__PURE__ */ jsx(PrimaryButton, {
                className: "ml-4",
                processing,
                children: __("Log in")
              })]
            })]
          })]
        })
      })
    })
  });
}
export {
  Login as default
};
