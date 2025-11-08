import { useRef, useEffect } from "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { usePage, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
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
import "./TextInput.7d39776a.mjs";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Paypal({
  auth,
  tokenPack,
  paypalEmail,
  paypalUrl,
  sale
}) {
  const {
    currency_symbol,
    currency_code
  } = usePage().props;
  const form = useRef(0);
  useEffect(() => {
    submit();
  }, []);
  const submit = (e) => {
    form.current.submit();
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("PayPal - Purchase Tokens")
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-4 sm:p-8 bg-white max-w-3xl mx-auto dark:bg-zinc-900 shadow sm:rounded-lg",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex justify-center items-center",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mr-2",
          children: /* @__PURE__ */ jsx(Spinner, {})
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("h3", {
            className: "text-3xl font-semibold dark:text-white text-center",
            children: __("PayPal")
          })
        })]
      }), /* @__PURE__ */ jsx("h3", {
        className: "mt-5 text-2xl font-semibold dark:text-white text-center",
        children: __("You are purchasing :tokensAmount tokens for :moneyAmount", {
          tokensAmount: tokenPack.tokensFormatted,
          moneyAmount: `${currency_symbol}${tokenPack.price}`
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "mx-auto justify-center text-center"
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-5 justify-center mx-auto text-center",
        children: /* @__PURE__ */ jsxs("form", {
          action: paypalUrl,
          method: "POST",
          ref: form,
          children: [/* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "business",
            value: paypalEmail
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "return",
            value: route("paypal.redirect-to-processing")
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "cancel_return",
            value: route("token.packages")
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "notify_url",
            value: route("paypal.ipn")
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "currency_code",
            value: currency_code
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "amount",
            value: sale.amount
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "item_name",
            value: `${sale.tokens} tokens`
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "custom",
            value: sale.id
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "cmd",
            value: "_xclick"
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "rm",
            value: "2"
          })]
        })
      })]
    })]
  });
}
export {
  Paypal as default
};
