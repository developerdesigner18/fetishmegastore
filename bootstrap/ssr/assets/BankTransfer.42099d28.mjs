import "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { usePage, useForm, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
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
function BankTransfer({
  auth,
  tokenPack,
  bankImg,
  bankInstructions
}) {
  const {
    currency_symbol,
    currency_code
  } = usePage().props;
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    proofDetails: "",
    proofImage: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("bank.confirmPurchase", {
      tokenPack: tokenPack.id
    }));
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Bank Transfer - Purchase Tokens")
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-4 sm:p-8 bg-white max-w-3xl mx-auto dark:bg-zinc-900 shadow sm:rounded-lg",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex justify-center items-center",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mr-2",
          children: /* @__PURE__ */ jsx("img", {
            src: bankImg,
            alt: "bank img",
            className: "h-14"
          })
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("h3", {
            className: "text-3xl font-semibold dark:text-white text-center",
            children: __("Bank Transfer")
          })
        })]
      }), /* @__PURE__ */ jsx("h3", {
        className: "mt-5 text-2xl font-semibold dark:text-white text-center",
        children: __("You are purchasing :tokensAmount tokens for :moneyAmount", {
          tokensAmount: tokenPack.tokensFormatted,
          moneyAmount: `${currency_symbol}${tokenPack.price}`
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "text-center mt-5 dark:text-white",
        dangerouslySetInnerHTML: {
          __html: bankInstructions
        }
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-5 justify-center mx-auto text-center",
        children: /* @__PURE__ */ jsxs("form", {
          onSubmit: submit,
          children: [/* @__PURE__ */ jsx(InputLabel, {
            className: "font-bold text-lg",
            value: __("Enter your payment proof details")
          }), /* @__PURE__ */ jsx(Textarea, {
            value: data.proofDetails,
            handleChange: (e) => setData("proofDetails", e.target.value),
            rows: "6",
            required: true,
            className: "w-full mt-3"
          }), /* @__PURE__ */ jsx(InputError, {
            message: errors.proofDetails
          }), /* @__PURE__ */ jsx(InputLabel, {
            className: "mt-5 font-bold text-lg",
            value: __("Payment Proof Image")
          }), /* @__PURE__ */ jsx(TextInput, {
            className: "p-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900",
            id: "proof_image",
            type: "file",
            accept: "image/jpeg,image/png",
            required: true,
            handleChange: (e) => setData("proofImage", e.target.files[0])
          }), /* @__PURE__ */ jsx(InputError, {
            message: errors.proofImage
          }), /* @__PURE__ */ jsx(PrimaryButton, {
            className: "mt-5 py-4",
            processing,
            children: __("Send Request")
          })]
        })
      })]
    })]
  });
}
export {
  BankTransfer as default
};
