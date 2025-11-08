import { M as Modal } from "./Modal.c4c8f017.mjs";
import { useState } from "react";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { FaGrinStars } from "react-icons/fa/index.js";
import axios from "axios";
import { toast } from "react-toastify";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import nl2br from "react-nl2br";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import { AiOutlineArrowRight } from "react-icons/ai/index.js";
import { Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { j as jsxs, F as Fragment, a as jsx } from "../app.mjs";
import "react-dom";
import "@headlessui/react";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function SubscribePopup({
  user,
  userIsSubscribed
}) {
  const [show, setShow] = useState(false);
  const [tiers, setTiers] = useState([{}]);
  const [loading, setLoading] = useState(true);
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
  const showSubscribe = (e) => {
    e.preventDefault();
    setShow(true);
    getTiers();
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [!userIsSubscribed ? /* @__PURE__ */ jsxs(SecondaryButton, {
      onClick: (e) => showSubscribe(e),
      children: [/* @__PURE__ */ jsx(FaGrinStars, {
        className: "mr-1"
      }), __("Subscribe")]
    }) : /* @__PURE__ */ jsxs(SecondaryButton, {
      onClick: (e) => Inertia.visit(route("mySubscriptions")),
      children: [/* @__PURE__ */ jsx(FaGrinStars, {
        className: "mr-1"
      }), __("Subscriptions")]
    }), /* @__PURE__ */ jsx(Modal, {
      show,
      onClose: (e) => setShow(false),
      maxWidth: "xs",
      children: /* @__PURE__ */ jsxs("div", {
        className: "text-center bg-white",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */ jsx("img", {
            src: user.cover_picture,
            alt: "",
            className: "h-24 rounded-tr rounded-tl w-full"
          }), /* @__PURE__ */ jsx("div", {
            className: "absolute top-5 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1",
            children: __("Select Tier")
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "mx-auto border-2 border-white bg-white  shadow rounded-full mt-[-50px] w-20 h-20 z-10 relative",
          children: /* @__PURE__ */ jsx("img", {
            src: user.profile_picture,
            alt: "",
            className: "w-full rounded-full"
          })
        }), /* @__PURE__ */ jsx("center", {
          children: loading && /* @__PURE__ */ jsx(Spinner, {})
        }), /* @__PURE__ */ jsxs("div", {
          className: "py-3",
          children: [tiers.length === 0 && __("Streamer did not set any membership options yet."), tiers.map((tier) => /* @__PURE__ */ jsxs("div", {
            className: "mb-4",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "text-indigo-800 text-lg",
              children: tier.tier_name
            }), /* @__PURE__ */ jsxs("span", {
              className: "text-indigo-800 text-sm px-1.5 py-1 rounded font-bold",
              children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
                className: "h-4 w-4 inline-flex mr-1 mb-1"
              }), __(":tierPrice Tokens / Month", {
                tierPrice: tier.price
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "text-gray-600 mt-1 px-2",
              children: nl2br(tier.perks)
            }), /* @__PURE__ */ jsxs(Link, {
              href: route("subscribe", {
                channel: user.username,
                tier: tier.id || 123
              }),
              className: "py-1 text-sm px-3 mt-2 inline-flex border-2 rounded-md border-gray-700 text-gray-700 items-center hover:border-indigo-600 hover:text-indigo-600",
              children: [/* @__PURE__ */ jsx(FaGrinStars, {
                className: "mr-2"
              }), /* @__PURE__ */ jsx("span", {
                children: __("Subscribe")
              }), /* @__PURE__ */ jsx(AiOutlineArrowRight, {
                className: "ml-1"
              })]
            })]
          }, `tier-${tier.id}`))]
        })]
      })
    })]
  });
}
export {
  SubscribePopup as default
};
