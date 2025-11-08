import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaGrinStars } from "react-icons/fa/index.js";
import nl2br from "react-nl2br";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import { AiOutlineArrowRight } from "react-icons/ai/index.js";
import { Inertia } from "@inertiajs/inertia";
import { a as jsx, F as Fragment, j as jsxs } from "../app.mjs";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/inertia-react";
import "@inertiajs/progress";
import "react/jsx-runtime";
function TiersTab({
  user
}) {
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState([]);
  const [tierSubscribed, setTierSubscribed] = useState(0);
  const getTiers = () => {
    axios.get(route("streaming.getTiers", {
      user: user.id
    })).then((resp) => {
      setTiers(resp.data);
      setLoading(false);
    }).catch((Err) => {
      var _a, _b;
      return toast.error((_b = (_a = Err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message);
    });
  };
  const getSubscriptionStatus = () => {
    setLoading(true);
    axios.get(route("subscription.isSubscribed", {
      user: user.id
    })).then((resp) => {
      setLoading(false);
      setTierSubscribed(resp.data);
    });
  };
  useEffect(() => {
    getTiers();
    getSubscriptionStatus();
  }, []);
  if (loading)
    return /* @__PURE__ */ jsx(Spinner, {});
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs("div", {
      className: `dark:text-zinc-200 mt-5`,
      children: [tiers.length === 0 && __("Streamer did not set any membership options yet."), tiers.map((tier) => /* @__PURE__ */ jsxs("div", {
        className: `flex flex-col md:items-center md:flex-row md:space-x-10 border-b py-5 bg-white dark:bg-zinc-900 dark:border-b-zinc-800 rounded-lg shadow-sm mb-5 px-5  ${tier.id === tierSubscribed && "bg-gray-200 dark:bg-gray-900 rounded"} ${tierSubscribed !== 0 && "px-2"}`,
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-indigo-800 dark:text-indigo-200 font-bold text-lg w-32",
          children: tier.tier_name
        }), /* @__PURE__ */ jsxs("div", {
          className: "text-indigo-800  w-full md:w-56 dark:text-indigo-200  rounded font-bold",
          children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
            className: "h-6 w-6 inline-flex mr-1"
          }), __(":tierPrice Tokens / Month", {
            tierPrice: tier.price
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "text-gray-600 dark:text-white flex-grow",
          children: nl2br(tier.perks)
        }), /* @__PURE__ */ jsxs("div", {
          children: [tierSubscribed === tier.id && __("You are subscribed to this tier"), tierSubscribed === 0 && /* @__PURE__ */ jsx("button", {
            className: "py-1 h-8 w-32 text-sm px-3 mt-2 border-2 rounded-md border-gray-700 dark:border-gray-100 dark:text-gray-200 dark:hover:border-indigo-300 dark:hover:text-indigo-300 text-gray-700 hover:border-indigo-600 hover:text-indigo-600",
            onClick: (e) => Inertia.visit(route("subscribe", {
              channel: user.username,
              tier: tier.id
            })),
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center",
              children: [/* @__PURE__ */ jsx(FaGrinStars, {
                className: "mr-2"
              }), /* @__PURE__ */ jsx("span", {
                children: __("Subscribe")
              }), /* @__PURE__ */ jsx(AiOutlineArrowRight, {
                className: "ml-1"
              })]
            })
          })]
        })]
      }, `tier-${tier.id}`))]
    })
  });
}
export {
  TiersTab as default
};
