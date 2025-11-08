import { useEffect } from "react";
import { I as InputError } from "./InputError.45933222.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { useForm, usePage, Head } from "@inertiajs/inertia-react";
import { F as Front } from "./Front.602cce17.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { toast } from "react-toastify";
import { j as jsxs, a as jsx } from "../app.mjs";
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
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Register() {
  const routeName = route().current();
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    username: "",
    category: "",
    is_streamer: routeName == "streamer.signup" ? "yes" : "no",
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("register"));
  };
  const {
    categories,
    flash
  } = usePage().props;
  useEffect(() => {
    if (flash == null ? void 0 : flash.message) {
      toast(flash.message);
    }
    if (Object.keys(errors).length !== 0) {
      Object.keys(errors).map((key, index) => {
        toast(errors[key]);
      });
    }
  }, [flash, errors]);
  return /* @__PURE__ */ jsxs(Front, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Register")
    }), /* @__PURE__ */ jsx("div", {
      className: "flex items-center flex-col md:flex-row md:space-x-10 bg-white rounded-lg px-5 pb-6 dark:bg-zinc-900 shadow max-w-5xl mx-auto",
      children: /* @__PURE__ */ jsx("div", {
        className: "flex-grow pt-10 w-full",
        children: /* @__PURE__ */ jsxs("form", {
          onSubmit: submit,
          children: [/* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "is_streamer",
            value: data.is_streamer
          }), /* @__PURE__ */ jsxs("div", {
            className: "mb-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              forInput: "username",
              value: __("Username")
            }), /* @__PURE__ */ jsx(TextInput, {
              name: "username",
              value: data.username,
              className: "mt-1 block w-full",
              autoComplete: "username",
              handleChange: onHandleChange,
              isFocused: true,
              required: true
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.username,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              forInput: "email",
              value: __("Email")
            }), /* @__PURE__ */ jsx(TextInput, {
              type: "email",
              name: "email",
              value: data.email,
              className: "mt-1 block w-full",
              autoComplete: "username",
              handleChange: onHandleChange,
              required: true
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.email,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              forInput: "password",
              value: __("Password")
            }), /* @__PURE__ */ jsx(TextInput, {
              type: "password",
              name: "password",
              value: data.password,
              className: "mt-1 block w-full",
              autoComplete: "new-password",
              handleChange: onHandleChange,
              required: true
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.password,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              forInput: "password_confirmation",
              value: __("Confirm Password")
            }), /* @__PURE__ */ jsx(TextInput, {
              type: "password",
              name: "password_confirmation",
              value: data.password_confirmation,
              className: "mt-1 block w-full",
              handleChange: onHandleChange,
              required: true
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.password_confirmation,
              className: "mt-2"
            })]
          }), routeName === "streamer.signup" && /* @__PURE__ */ jsxs("div", {
            className: "mt-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              forInput: "category",
              value: __("Category")
            }), /* @__PURE__ */ jsxs("select", {
              name: "category",
              onChange: (e) => onHandleChange(e),
              required: true,
              className: `mt-1 block w-full border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `,
              children: [/* @__PURE__ */ jsx("option", {
                value: "",
                children: __("- Select -")
              }), categories.map((c, cIndex) => {
                return /* @__PURE__ */ jsx("option", {
                  value: c.id,
                  children: c.category
                }, c.id);
              })]
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.category,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center justify-end mt-4",
            children: /* @__PURE__ */ jsx(PrimaryButton, {
              className: "ml-4",
              processing,
              children: __("Register")
            })
          })]
        })
      })
    })]
  });
}
export {
  Register as default
};
