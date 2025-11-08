import "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { usePage, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { toast } from "react-toastify";
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
const CheckoutForm = ({
  saleId
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: route("stripe.processOrder", {
          tokenSale: saleId
        })
      }
    });
    if (result.error) {
      toast.error(result.error.message);
    }
  };
  return /* @__PURE__ */ jsxs("form", {
    onSubmit: handleSubmit,
    children: [/* @__PURE__ */ jsx(PaymentElement, {}), /* @__PURE__ */ jsx(PrimaryButton, {
      className: "mt-5",
      processing: !stripe,
      children: __("Submit Payment")
    })]
  });
};
function BankTransfer({
  auth,
  tokenPack,
  stripeImg,
  publicKey,
  cs,
  saleId
}) {
  const {
    currency_symbol,
    currency_code
  } = usePage().props;
  const stripePromise = loadStripe(publicKey);
  const options = {
    clientSecret: cs,
    appearance: {
      theme: localStorage.getItem("is-dark-mode") === "yes" ? "night" : "",
      labels: "floating"
    }
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Credit Card (Stripe)")
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-4 sm:p-8 bg-white max-w-3xl mx-auto dark:bg-zinc-900 shadow sm:rounded-lg",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex justify-center items-center",
        children: /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("h3", {
            className: "text-3xl font-semibold dark:text-white text-center",
            children: __("Credit Card")
          })
        })
      }), /* @__PURE__ */ jsx("h3", {
        className: "mt-5 text-2xl font-semibold dark:text-white text-center",
        children: __("You are purchasing :tokensAmount tokens for :moneyAmount", {
          tokensAmount: tokenPack.tokensFormatted,
          moneyAmount: `${currency_symbol}${tokenPack.price}`
        })
      }), /* @__PURE__ */ jsx("hr", {
        className: "my-10"
      }), /* @__PURE__ */ jsx(Elements, {
        stripe: stripePromise,
        options,
        children: /* @__PURE__ */ jsx(CheckoutForm, {
          saleId
        })
      })]
    })]
  });
}
export {
  BankTransfer as default
};
