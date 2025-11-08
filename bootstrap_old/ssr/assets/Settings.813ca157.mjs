import "react";
import { usePage, useForm } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { TbBuildingBank } from "react-icons/tb/index.js";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Settings({
  payoutSettings
}) {
  var _a, _b;
  usePage().props;
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    payout_destination: (_a = payoutSettings.destination) != null ? _a : "",
    payout_details: (_b = payoutSettings.details) != null ? _b : ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("payout.saveSettings"));
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center space-x-4",
      children: [/* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx(TbBuildingBank, {
          className: "w-12 h-12 text-green-600"
        })
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-2xl font-semibold dark:text-white",
          children: __("Payout Settings")
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-1 text-gray-600 dark:text-gray-400",
          children: __("Set your payout destination settings")
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-3 max-w-sm",
      children: /* @__PURE__ */ jsx("form", {
        onSubmit: submit,
        children: /* @__PURE__ */ jsxs("div", {
          className: "mt-4",
          children: [/* @__PURE__ */ jsx(InputLabel, {
            forInput: "category",
            value: __("Payout Destination")
          }), /* @__PURE__ */ jsxs("select", {
            name: "payout_destination",
            onChange: (e) => setData("payout_destination", e.target.value),
            required: true,
            className: `mt-1 block w-full border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `,
            defaultValue: data.payout_destination,
            children: [/* @__PURE__ */ jsx("option", {
              value: "",
              children: __("- Select -")
            }), /* @__PURE__ */ jsx("option", {
              value: "PayPal",
              children: __("PayPal")
            }), /* @__PURE__ */ jsx("option", {
              value: "Bank Transfer",
              children: __("Bank Transfer")
            })]
          }), /* @__PURE__ */ jsx(InputError, {
            message: errors.payout_destination,
            className: "mt-2"
          }), data.payout_destination == "PayPal" && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx(InputLabel, {
              className: "mt-3",
              forInput: "payout_details",
              value: "PayPal Email"
            }), /* @__PURE__ */ jsx(TextInput, {
              value: data.payout_details,
              className: "w-full",
              handleChange: (e) => setData("payout_details", e.target.value),
              required: true
            })]
          }), data.payout_destination == "Bank Transfer" && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx(InputLabel, {
              forInput: "payout_details",
              className: "mt-3",
              value: "Bank Account Details"
            }), /* @__PURE__ */ jsx(Textarea, {
              value: data.payout_details,
              name: "payout_details",
              className: "w-full",
              handleChange: (e) => setData("payout_details", e.target.value),
              required: true
            })]
          }), /* @__PURE__ */ jsx(InputError, {
            message: errors.payout_details,
            className: "mt-2"
          }), /* @__PURE__ */ jsx(PrimaryButton, {
            processing,
            className: "mt-3",
            children: __("Save Settings")
          })]
        })
      })
    })]
  });
}
export {
  Settings as default
};
