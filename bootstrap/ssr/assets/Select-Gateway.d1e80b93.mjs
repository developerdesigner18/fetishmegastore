import "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { useForm, usePage, Head, Link } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import "@inertiajs/inertia";
import { I as InputError } from "./InputError.45933222.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
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
function SelectGateway({
  auth,
  tokenPack,
  paypalEnabled,
  stripeEnabled,
  bankEnabled,
  ccbillEnabled,
  paypalImg,
  ccbillImg,
  stripeImg,
  bankImg
}) {
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    voucher_type: "",
    code: "",
    selected_token: tokenPack.id
  });
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("submit.voucher"));
  };
  const {
    currency_symbol,
    currency_code
  } = usePage().props;
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Select Gateway - Purchase Tokens")
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-4 sm:p-8 bg-white max-w-3xl mx-auto dark:bg-zinc-900 shadow sm:rounded-lg",
      children: [/* @__PURE__ */ jsx("h3", {
        className: "text-3xl font-semibold dark:text-white text-center",
        children: __("Select Payment Gateway")
      }), /* @__PURE__ */ jsx("h3", {
        className: "mt-5 text-2xl font-semibold dark:text-white text-center",
        children: __("You are purchasing :tokensAmount tokens for :moneyAmount", {
          tokensAmount: tokenPack.tokensFormatted,
          moneyAmount: `${currency_symbol}${tokenPack.price}`
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-10 flex items-center justify-center flex-col space-y-5",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("span", {
            className: "block text-center text-gray-700 font-bold dark:text-white text-lg",
            children: __("Pay via PayPal")
          }), paypalEnabled == "Yes" && /* @__PURE__ */ jsx(Link, {
            href: route("paypal.purchaseTokens", {
              tokenPack: tokenPack.id
            }),
            children: /* @__PURE__ */ jsx("img", {
              src: paypalImg,
              alt: "paypal",
              className: "h-24 mx-auto"
            })
          })]
        }), stripeEnabled == "Yes" && /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("span", {
            className: "block text-center mb-3 text-gray-700 font-bold dark:text-white text-lg",
            children: __("Credit Card (Stripe)")
          }), /* @__PURE__ */ jsx(Link, {
            href: route("stripe.purchaseTokens", {
              tokenPack: tokenPack.id
            }),
            children: /* @__PURE__ */ jsx("img", {
              src: stripeImg,
              alt: "stripe",
              className: "h-14 mx-auto"
            })
          })]
        }), ccbillEnabled == "Yes" && /* @__PURE__ */ jsxs("div", {
          className: "pt-5",
          children: [/* @__PURE__ */ jsx("span", {
            className: "block text-center text-gray-700 font-bold dark:text-white text-lg",
            children: __("CCBill (Credit Card)")
          }), /* @__PURE__ */ jsx("a", {
            href: route("ccbill.purchaseTokens", {
              tokenPack: tokenPack.id
            }),
            children: /* @__PURE__ */ jsx("img", {
              src: ccbillImg,
              alt: "stripe",
              className: "h-14 mx-auto"
            })
          })]
        }), bankEnabled == "Yes" && /* @__PURE__ */ jsxs("div", {
          className: "mt-10",
          children: [/* @__PURE__ */ jsx("span", {
            className: "block text-center text-gray-700 font-bold dark:text-white text-lg",
            children: __("Pay via Bank Transfer")
          }), /* @__PURE__ */ jsx(Link, {
            href: route("bank.purchaseTokens", {
              tokenPack: tokenPack.id
            }),
            children: /* @__PURE__ */ jsx("img", {
              src: bankImg,
              alt: "stripe",
              className: "h-14 mx-auto"
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("span", {
            className: "block text-center text-gray-700 font-bold dark:text-white text-lg",
            children: __("Voucher Code?")
          }), /* @__PURE__ */ jsxs("form", {
            onSubmit: submit,
            children: [/* @__PURE__ */ jsxs("div", {
              className: "mt-4",
              children: [/* @__PURE__ */ jsx(InputLabel, {
                forInput: "voucher_type",
                value: __("Voucher Type")
              }), /* @__PURE__ */ jsxs("select", {
                name: "voucher_type",
                onChange: (e) => onHandleChange(e),
                required: true,
                className: `mt-1 block w-full border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `,
                children: [/* @__PURE__ */ jsx("option", {
                  value: "",
                  children: __("- Select -")
                }), /* @__PURE__ */ jsx("option", {
                  value: "AMAZON",
                  children: __("AMAZONE VOUCHER")
                }), /* @__PURE__ */ jsx("option", {
                  value: "PAYSAFE",
                  children: __("PAYSAFE")
                })]
              }), /* @__PURE__ */ jsx(InputError, {
                message: errors.category,
                className: "mt-2"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-4",
              children: [/* @__PURE__ */ jsx(InputLabel, {
                forInput: "code",
                value: __("Code")
              }), /* @__PURE__ */ jsx(TextInput, {
                name: "code",
                value: data.code,
                className: "mt-1 block w-full",
                autoComplete: "code",
                handleChange: onHandleChange,
                isFocused: true,
                required: true
              }), /* @__PURE__ */ jsx(InputError, {
                message: errors.username,
                className: "mt-2"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "flex items-center justify-end mt-4",
              children: /* @__PURE__ */ jsx(PrimaryButton, {
                className: "ml-4",
                processing,
                children: __("Submit")
              })
            })]
          })]
        })]
      })]
    })]
  });
}
export {
  SelectGateway as default
};
