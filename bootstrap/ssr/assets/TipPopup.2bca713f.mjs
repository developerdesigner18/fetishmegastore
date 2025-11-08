import { _ as __ } from "./Translate.346b89d9.mjs";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { useState } from "react";
import { M as Modal } from "./Modal.c4c8f017.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
import { N as NumberInput } from "./NumberInput.e1cdf2ea.mjs";
import axios from "axios";
import { toast } from "react-toastify";
import { j as jsxs, F as Fragment, a as jsx } from "../app.mjs";
import "react-dom";
import "@headlessui/react";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/inertia-react";
import "@inertiajs/progress";
import "react/jsx-runtime";
function TipPopup({
  streamer
}) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [tip, setTip] = useState("");
  const sendTip = (e) => {
    e.preventDefault();
    axios.post(route("tips.send"), {
      streamer: streamer.id,
      tip,
      message
    }).then((resp) => {
      if (resp.data.result == "ok") {
        setTip("");
        setMessage("");
        toast.success(__("Thanks, your tip has been sent!"));
        setShow(false);
      } else {
        toast.error(resp.data.result);
      }
    }).catch((Error) => {
      var _a;
      const errors = (_a = Error.response.data) == null ? void 0 : _a.errors;
      Object.keys(errors).forEach((key) => {
        console.log(errors[key][0]);
        toast.error(errors[key][0]);
      });
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Modal, {
      show,
      onClose: (e) => setShow(false),
      maxWidth: "xs",
      children: /* @__PURE__ */ jsxs("div", {
        className: "p-5 text-center",
        children: [/* @__PURE__ */ jsxs("h3", {
          className: "text-lg mb-3 justify-center flex items-center font-semibold dark:text-white",
          children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
            className: "mr-2 h-6 w-6"
          }), __("Send Tip")]
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: sendTip,
          children: [/* @__PURE__ */ jsx(InputLabel, {
            className: "text-base",
            forInput: "tokens",
            value: __("Tokens Amount")
          }), /* @__PURE__ */ jsx(NumberInput, {
            type: "number",
            name: "tokens",
            min: 1,
            className: "w-full mt-2",
            value: tip,
            handleChange: (e) => setTip(e.target.value)
          }), /* @__PURE__ */ jsx(InputLabel, {
            className: "text-base mt-4",
            forInput: "message",
            value: __("Message")
          }), /* @__PURE__ */ jsx(Textarea, {
            className: "w-full mt-2",
            value: message,
            required: true,
            handleChange: (e) => setMessage(e.target.value)
          }), /* @__PURE__ */ jsx(PrimaryButton, {
            className: "mt-5",
            children: __("Send Tip")
          })]
        })]
      })
    }), /* @__PURE__ */ jsxs(PrimaryButton, {
      onClick: (e) => setShow(true),
      className: "py-3 inline-flex items-center",
      children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
        className: "mr-1"
      }), " ", __("Tip")]
    })]
  });
}
export {
  TipPopup as default
};
