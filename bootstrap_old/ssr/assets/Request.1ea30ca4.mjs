import "react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { FcMoneyTransfer } from "react-icons/fc/index.js";
import WithdrawForm from "./WithdrawForm.353aff93.mjs";
import { j as jsxs, a as jsx } from "../app.mjs";
import "./TextInput.7d39776a.mjs";
import "@inertiajs/inertia-react";
import "./PrimaryButton.9fb48a50.mjs";
import "./InputError.45933222.mjs";
import "./InputLabel.2f9ff89f.mjs";
import "./Spinner.a2c890cd.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Request({
  tokens,
  token_value,
  currency_symbol,
  money_balance,
  min_withdraw,
  pending_count,
  payout_settings
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex flex-wrap justify-between",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center space-x-4",
        children: [/* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(FcMoneyTransfer, {
            className: "w-12 h-12"
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h3", {
            className: "text-2xl font-semibold dark:text-white",
            children: __("Withdraw")
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-1 text-gray-600 dark:text-gray-400",
            children: __("Request Payout")
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx("h3", {
          className: "px-5 py-2.5 bg-gray-900 text-white dark:bg-gray-700 dark:text-white text-lg rounded-md font-bold",
          children: __(":tokenBalance tokens", {
            tokenBalance: tokens
          })
        })
      })]
    }), /* @__PURE__ */ jsxs("p", {
      className: "dark:text-white mt-5 text-gray-600",
      children: [__("Minimum withdraw threshold before being able to request a payout:"), " ", /* @__PURE__ */ jsx("span", {
        className: "px-2 py-0.5 ml-2 rounded-md bg-gray-900 text-white dark:bg-gray-700 dark:text-white font-semibold",
        children: __(":minWithdraw tokens", {
          minWithdraw: min_withdraw
        })
      })]
    }), /* @__PURE__ */ jsx("hr", {
      className: "my-2"
    }), /* @__PURE__ */ jsxs("p", {
      className: "dark:text-white text-gray-600",
      children: [__("1 Token Value ="), /* @__PURE__ */ jsxs("span", {
        className: "px-2 py-0.5 ml-2 rounded-md bg-gray-900 text-white dark:bg-gray-700 dark:text-white font-semibold",
        children: [currency_symbol, token_value]
      })]
    }), /* @__PURE__ */ jsx("hr", {
      className: "my-2"
    }), /* @__PURE__ */ jsxs("p", {
      className: "dark:text-white text-gray-600",
      children: [__("Your :tokenBalance tokens balance will be converted to", {
        tokenBalance: tokens
      }), /* @__PURE__ */ jsxs("span", {
        className: "px-2 py-0.5 ml-2 rounded-md bg-gray-900 text-white dark:bg-gray-700 dark:text-white font-semibold",
        children: [currency_symbol, money_balance]
      })]
    }), tokens >= min_withdraw && /* @__PURE__ */ jsx(WithdrawForm, {
      tokens,
      money_balance,
      currency_symbol,
      pending_count,
      payout_settings
    })]
  });
}
export {
  Request as default
};
