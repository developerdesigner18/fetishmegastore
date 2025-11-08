import { useState } from "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { usePage, Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import History from "./History.cb30b47b.mjs";
import Settings from "./Settings.813ca157.mjs";
import Request from "./Request.1ea30ca4.mjs";
import AccountNavi from "./AccountNavi.87076860.mjs";
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
import "./Spinner.a2c890cd.mjs";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
import "react-icons/tb/index.js";
import "./InputLabel.2f9ff89f.mjs";
import "./InputError.45933222.mjs";
import "./PrimaryButton.9fb48a50.mjs";
import "./Textarea.d2e6a2e3.mjs";
import "react-icons/fc/index.js";
import "./WithdrawForm.353aff93.mjs";
function Withdraw({
  auth,
  pendingCount,
  withdrawals,
  payoutSettings
}) {
  const {
    currency_symbol,
    currency_code,
    token_value,
    min_withdraw
  } = usePage().props;
  const [activeTab, setActiveTab] = useState("Withdraw");
  const activeTabClass = "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
  const inactiveTabClass = "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Withdraw")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10 w-full",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "withdraw"
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex-grow",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "mb-5",
          children: [/* @__PURE__ */ jsx("button", {
            className: activeTab == "Withdraw" ? activeTabClass : inactiveTabClass,
            onClick: (e) => setActiveTab("Withdraw"),
            children: __("Withdraw")
          }), /* @__PURE__ */ jsx("button", {
            className: activeTab == "History" ? activeTabClass : inactiveTabClass,
            onClick: (e) => setActiveTab("History"),
            children: __("History")
          }), /* @__PURE__ */ jsx("button", {
            className: activeTab == "Settings" ? activeTabClass : inactiveTabClass,
            onClick: (e) => setActiveTab("Settings"),
            children: __("Settings")
          })]
        }), activeTab == "Withdraw" && /* @__PURE__ */ jsx(Request, {
          token_value,
          currency_symbol,
          tokens: auth.user.tokens,
          money_balance: auth.user.moneyBalance,
          min_withdraw,
          pending_count: pendingCount,
          payout_settings: payoutSettings
        }), activeTab == "Settings" && /* @__PURE__ */ jsx(Settings, {
          payoutSettings
        }), activeTab == "History" && /* @__PURE__ */ jsx(History, {
          withdrawals
        })]
      })]
    })]
  });
}
export {
  Withdraw as default
};
