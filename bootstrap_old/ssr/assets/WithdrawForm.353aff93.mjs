import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { useForm } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { a as jsx, j as jsxs } from "../app.mjs";
import "react";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function WithdrawForm(props) {
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    tokens: props.tokens
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("payout.saveRequest"), {
      preserveState: false
    });
  };
  if (!props.payout_settings.destination) {
    return /* @__PURE__ */ jsx("div", {
      className: "mt-10 dark:text-white bg-sky-200 text-sky-700 rounded-lg px-2 py-1.5",
      children: __("In order to create a payout request, you must first set a destination for the funds in the Settings Tab")
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "mt-10 text-zinc-600 dark:text-white",
    children: props.pending_count === 0 ? /* @__PURE__ */ jsxs("form", {
      onSubmit: submit,
      children: [/* @__PURE__ */ jsx("hr", {
        className: "my-5"
      }), /* @__PURE__ */ jsx(InputLabel, {
        className: "text-lg",
        children: __("Request Payout Tokens")
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0",
        children: [/* @__PURE__ */ jsx(TextInput, {
          type: "number",
          handleChange: (e) => setData("tokens", e.target.value),
          value: data.tokens,
          required: true
        }), /* @__PURE__ */ jsx(InputError, {
          message: errors.tokens,
          className: "mt-2"
        }), /* @__PURE__ */ jsx(PrimaryButton, {
          className: "max-w-24",
          processing,
          children: __("Send Request")
        }), processing && /* @__PURE__ */ jsx(Spinner, {})]
      })]
    }) : /* @__PURE__ */ jsx("div", {
      className: "bg-green-100 p-3 text-green-800 rounded-md",
      children: __("You have a Pending payout request. Check history tab for more infos.")
    })
  });
}
export {
  WithdrawForm as default
};
