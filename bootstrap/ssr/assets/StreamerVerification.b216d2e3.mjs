import { useEffect } from "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { usePage, useForm, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { HiIdentification } from "react-icons/hi/index.js";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import "./TextInput.7d39776a.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
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
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function StreamerVerification() {
  const {
    auth
  } = usePage().props;
  const {
    data,
    setData,
    errors,
    processing,
    post,
    progress
  } = useForm({
    document: ""
  });
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const submit = (e) => {
    e.preventDefault();
    post(route("streamer.submitVerification"));
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Verify Identity To Start Streaming")
    }), /* @__PURE__ */ jsx("div", {
      className: "ml-0",
      children: /* @__PURE__ */ jsxs("div", {
        className: "p-4 sm:p-8 bg-gray-100 dark:bg-zinc-900 dark:text-white shadow sm:rounded-lg",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx(HiIdentification, {
              className: "h-12 w-12 mr-2"
            })
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-semibold text-gray-900 dark:text-gray-100",
              children: __("Verify Identity to Start Streaming")
            }), /* @__PURE__ */ jsx("p", {
              className: "dark:text-white text-sm",
              children: __("In order to start streaming, you need to send your gov. issued ID/passport to verify the account name matches to the document.")
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-5",
          children: [/* @__PURE__ */ jsxs("form", {
            onSubmit: submit,
            children: [/* @__PURE__ */ jsx(InputLabel, {
              value: __("Document (PNG or JPG)")
            }), /* @__PURE__ */ jsx("input", {
              className: "p-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900",
              id: "document",
              type: "file",
              required: true,
              accept: "image/jpg,image/png",
              onChange: (e) => setData("document", e.target.files[0])
            }), /* @__PURE__ */ jsx(InputError, {
              className: "mt-2",
              message: errors.document
            }), /* @__PURE__ */ jsx(PrimaryButton, {
              className: "mt-5",
              processing,
              children: __("Submit Request")
            })]
          }), progress && /* @__PURE__ */ jsxs("progress", {
            value: progress.percentage,
            max: "100",
            children: [progress.percentage, "%"]
          })]
        })]
      })
    })]
  });
}
export {
  StreamerVerification as default
};
