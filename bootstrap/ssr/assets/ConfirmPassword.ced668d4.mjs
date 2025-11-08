import { useEffect } from "react";
import { G as Guest } from "./GuestLayout.8d7ce626.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
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
function ConfirmPassword() {
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    password: ""
  });
  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("password.confirm"));
  };
  return /* @__PURE__ */ jsxs(Guest, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: "Confirm Password"
    }), /* @__PURE__ */ jsx("div", {
      className: "mb-4 text-sm text-gray-600 dark:text-gray-400",
      children: "This is a secure area of the application. Please confirm your password before continuing."
    }), /* @__PURE__ */ jsxs("form", {
      onSubmit: submit,
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mt-4",
        children: [/* @__PURE__ */ jsx(InputLabel, {
          forInput: "password",
          value: "Password"
        }), /* @__PURE__ */ jsx(TextInput, {
          type: "password",
          name: "password",
          value: data.password,
          className: "mt-1 block w-full",
          isFocused: true,
          handleChange: onHandleChange
        }), /* @__PURE__ */ jsx(InputError, {
          message: errors.password,
          className: "mt-2"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex items-center justify-end mt-4",
        children: /* @__PURE__ */ jsx(PrimaryButton, {
          className: "ml-4",
          processing,
          children: "Confirm"
        })
      })]
    })]
  });
}
export {
  ConfirmPassword as default
};
