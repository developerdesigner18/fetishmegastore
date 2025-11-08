import "react";
import { G as Guest } from "./GuestLayout.8d7ce626.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { useForm, Head } from "@inertiajs/inertia-react";
import { j as jsxs, a as jsx } from "../app.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function ForgotPassword({
  status
}) {
  const {
    data,
    setData,
    post,
    processing,
    errors
  } = useForm({
    email: ""
  });
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };
  return /* @__PURE__ */ jsxs(Guest, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: "Forgot Password"
    }), /* @__PURE__ */ jsx("div", {
      className: "mb-4 text-sm text-gray-600 dark:text-gray-400",
      children: "Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one."
    }), status && /* @__PURE__ */ jsx("div", {
      className: "mb-4 font-medium text-sm text-green-600 dark:text-green-400",
      children: status
    }), /* @__PURE__ */ jsxs("form", {
      onSubmit: submit,
      children: [/* @__PURE__ */ jsx(TextInput, {
        type: "email",
        name: "email",
        value: data.email,
        className: "mt-1 block w-full",
        isFocused: true,
        handleChange: onHandleChange
      }), /* @__PURE__ */ jsx(InputError, {
        message: errors.email,
        className: "mt-2"
      }), /* @__PURE__ */ jsx("div", {
        className: "flex items-center justify-end mt-4",
        children: /* @__PURE__ */ jsx(PrimaryButton, {
          className: "ml-4",
          processing,
          children: "Email Password Reset Link"
        })
      })]
    })]
  });
}
export {
  ForgotPassword as default
};
