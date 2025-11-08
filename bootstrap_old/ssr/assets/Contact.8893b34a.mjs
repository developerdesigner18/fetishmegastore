import { useEffect } from "react";
import { I as InputError } from "./InputError.45933222.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { useForm, usePage, Head } from "@inertiajs/inertia-react";
import { F as Front } from "./Front.602cce17.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import "react-toastify";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
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
function Contact({
  no1,
  no2,
  contact_image
}) {
  route().current();
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    name: "",
    email: "",
    subject: "",
    math: "",
    message: ""
  });
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("contact.process"));
  };
  const {
    flash
  } = usePage().props;
  useEffect(() => {
    if (flash == null ? void 0 : flash.resetForm) {
      console.log("reset me");
      reset();
    }
  }, [flash]);
  return /* @__PURE__ */ jsxs(Front, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Get in Touch")
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex items-center flex-col md:flex-row md:space-x-10 bg-white rounded-lg px-5 pb-6 dark:bg-zinc-900 shadow max-w-5xl mx-auto",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "w-full",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "mb-5 text-2xl font-semibold dark:text-zinc-200 text-center",
          children: __("Get in Touch")
        }), /* @__PURE__ */ jsx("img", {
          src: contact_image,
          alt: "contact image",
          className: "max-h-96 rounded-full mx-auto border-zinc-200 dark:border-indigo-200 "
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex-grow pt-10 w-full",
        children: /* @__PURE__ */ jsxs("form", {
          onSubmit: submit,
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              forInput: "name",
              value: __("Name")
            }), /* @__PURE__ */ jsx(TextInput, {
              name: "name",
              value: data.name,
              className: "mt-1 block w-full",
              autoComplete: "name",
              handleChange: onHandleChange,
              isFocused: true,
              required: true
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.name,
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
              forInput: "subject",
              value: __("Subject")
            }), /* @__PURE__ */ jsx(TextInput, {
              type: "text",
              name: "subject",
              value: data.subject,
              className: "mt-1 block w-full",
              handleChange: onHandleChange,
              required: true
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.password,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              forInput: "message",
              value: __("Your message")
            }), /* @__PURE__ */ jsx(Textarea, {
              name: "message",
              value: data.message,
              className: "mt-1 block w-full",
              handleChange: onHandleChange,
              required: true
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.message,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              forInput: "math",
              value: __("What is the result of :no1 + :no2 ?", {
                no1,
                no2
              })
            }), /* @__PURE__ */ jsx(TextInput, {
              type: "text",
              name: "math",
              value: data.math,
              className: "mt-1 ",
              handleChange: onHandleChange,
              required: true
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.math,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex mt-4",
            children: /* @__PURE__ */ jsx(PrimaryButton, {
              className: "",
              processing,
              children: __("Send Inquiry")
            })
          })]
        })
      })]
    })]
  });
}
export {
  Contact as default
};
