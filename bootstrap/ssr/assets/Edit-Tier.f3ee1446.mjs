import { _ as __ } from "./Translate.346b89d9.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { usePage, useForm, Head, Link } from "@inertiajs/inertia-react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import AccountNavi from "./AccountNavi.87076860.mjs";
import { j as jsxs, a as jsx } from "../app.mjs";
import "react";
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
function EditTier({
  tier
}) {
  usePage().props;
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    tier_name: tier.tier_name,
    perks: tier.perks,
    tier_price: tier.price,
    six_months_discount: tier.six_months_discount,
    one_year_discount: tier.one_year_discount
  });
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("membership.update-tier", {
      tier: tier.id
    }));
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Channel Membership Tiers")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10 w-full",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "tiers"
      }), /* @__PURE__ */ jsxs("div", {
        className: "p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg",
        children: [/* @__PURE__ */ jsxs("header", {
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-lg font-medium text-gray-900 dark:text-gray-100",
            children: __("Update Tier")
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400",
            children: __("Update the subscription prices and perks for this tier")
          }), /* @__PURE__ */ jsx(Link, {
            href: route("membership.set-tiers"),
            children: /* @__PURE__ */ jsx(SecondaryButton, {
              children: __("<< Back")
            })
          })]
        }), /* @__PURE__ */ jsx("hr", {
          className: "my-5"
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: submit,
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "tier_name",
              value: __("Tier Name")
            }), /* @__PURE__ */ jsx(TextInput, {
              name: "tier_name",
              value: data.tier_name,
              handleChange: onHandleChange,
              required: true,
              className: "mt-1 block w-full"
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.tier_name,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col md:flex-row md:justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "mb-4",
              children: [/* @__PURE__ */ jsx(InputLabel, {
                for: "tier_price",
                value: __("Tier Price")
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center",
                children: [/* @__PURE__ */ jsx(TextInput, {
                  name: "tier_price",
                  value: data.tier_price,
                  handleChange: onHandleChange,
                  required: true,
                  className: "mt-1 block w-24"
                }), /* @__PURE__ */ jsx("div", {
                  className: "ml-1 dark:text-white text-gray-600",
                  children: __("tokens / month")
                })]
              }), /* @__PURE__ */ jsx(InputError, {
                message: errors.tier_price,
                className: "mt-2"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "mb-4",
              children: [/* @__PURE__ */ jsx(InputLabel, {
                for: "six_months_discount",
                value: __("6 Months Discount Percentage")
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center",
                children: [/* @__PURE__ */ jsx(TextInput, {
                  name: "six_months_discount",
                  value: data.six_months_discount,
                  handleChange: onHandleChange,
                  required: true,
                  className: "mt-1 block w-24"
                }), /* @__PURE__ */ jsx("div", {
                  className: "ml-1 dark:text-white text-gray-700",
                  children: __("%")
                })]
              }), /* @__PURE__ */ jsx(InputError, {
                message: errors.six_months_discount,
                className: "mt-2"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "mb-4",
              children: [/* @__PURE__ */ jsx(InputLabel, {
                for: "one_year_discount",
                value: __("1 Year Discount Percentage")
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center",
                children: [/* @__PURE__ */ jsx(TextInput, {
                  name: "one_year_discount",
                  value: data.one_year_discount,
                  handleChange: onHandleChange,
                  required: true,
                  className: "mt-1 block w-24"
                }), /* @__PURE__ */ jsx("div", {
                  className: "ml-1 dark:text-white text-gray-700",
                  children: __("%")
                })]
              }), /* @__PURE__ */ jsx(InputError, {
                message: errors.one_year_discount,
                className: "mt-2"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mb-4",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "",
              value: __("Perks & Benefits")
            }), /* @__PURE__ */ jsx(Textarea, {
              name: "perks",
              value: data.perks,
              handleChange: onHandleChange,
              required: true,
              className: "mt-1 block w-full"
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.perks,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex justify-between items-center",
            children: /* @__PURE__ */ jsx(PrimaryButton, {
              processing,
              children: __("Update Tier")
            })
          })]
        })]
      })]
    })]
  });
}
export {
  EditTier as default
};
