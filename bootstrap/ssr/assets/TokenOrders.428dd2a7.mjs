import { _ as __ } from "./Translate.346b89d9.mjs";
import { usePage, Head } from "@inertiajs/inertia-react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { FiUserMinus } from "react-icons/fi/index.js";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { Inertia } from "@inertiajs/inertia";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "react";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
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
function TokenOrders({
  orders
}) {
  var _a;
  const {
    auth,
    currency_symbol
  } = usePage().props;
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Token Order History")
    }), /* @__PURE__ */ jsxs("div", {
      className: "ml-0",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mt-5 p-4 sm:p-8 bg-gray-100 dark:bg-zinc-900 shadow sm:rounded-lg",
        children: [/* @__PURE__ */ jsx("header", {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-start space-x-3",
            children: [/* @__PURE__ */ jsx("div", {
              children: /* @__PURE__ */ jsx(MdGeneratingTokens, {
                className: "w-8 h-8 dark:text-white"
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between items-center w-full flex-wrap",
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-lg font-medium text-gray-900 dark:text-gray-100",
                children: __("Token Order History")
              }), __("Balance: :balance", {
                balance: auth.user.tokens
              })]
            })]
          })
        }), /* @__PURE__ */ jsx("hr", {
          className: "my-5"
        }), orders.total === 0 && /* @__PURE__ */ jsxs("div", {
          className: "text-xl dark:text-white text-gray-700 flex items-center space-x-4",
          children: [/* @__PURE__ */ jsx(FiUserMinus, {
            className: "w-10 h-10"
          }), /* @__PURE__ */ jsx("div", {
            children: __("You haven't ordered any tokens yet.")
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "relative overflow-x-auto",
          children: /* @__PURE__ */ jsxs("table", {
            className: "w-full text-sm text-left text-gray-500 dark:text-gray-400",
            children: [/* @__PURE__ */ jsx("thead", {
              className: "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400",
              children: /* @__PURE__ */ jsxs("tr", {
                children: [/* @__PURE__ */ jsx("th", {
                  scope: "col",
                  className: "px-6 py-3",
                  children: __("ID")
                }), /* @__PURE__ */ jsx("th", {
                  scope: "col",
                  className: "px-6 py-3",
                  children: __("Tokens")
                }), /* @__PURE__ */ jsx("th", {
                  scope: "col",
                  className: "px-6 py-3",
                  children: __("Price")
                }), /* @__PURE__ */ jsx("th", {
                  scope: "col",
                  className: "px-6 py-3",
                  children: __("Gateway")
                }), /* @__PURE__ */ jsx("th", {
                  scope: "col",
                  className: "px-6 py-3",
                  children: __("Date")
                })]
              })
            }), /* @__PURE__ */ jsx("tbody", {
              children: (_a = orders.data) == null ? void 0 : _a.map((t, index) => /* @__PURE__ */ jsxs("tr", {
                className: "bg-white border-b dark:bg-gray-800 dark:border-gray-700",
                children: [/* @__PURE__ */ jsx("th", {
                  scope: "row",
                  className: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
                  children: t.id
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: t.tokens
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: `${currency_symbol}${t.amount}`
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: t.gateway
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: t.created_at_human
                })]
              }, index))
            })]
          })
        })]
      }), orders.last_page > 1 && /* @__PURE__ */ jsxs(Fragment, {
        children: [/* @__PURE__ */ jsx("div", {
          className: "mt-10 flex text-gray-600 dark:text-gray-100 my-3 text-sm",
          children: __("Page: :pageNumber of :lastPage", {
            pageNumber: orders.current_page,
            lastPage: orders.last_page
          })
        }), /* @__PURE__ */ jsx(SecondaryButton, {
          processing: orders.prev_page_url ? false : true,
          className: "mr-3",
          onClick: (e) => Inertia.visit(orders.prev_page_url),
          children: __("Previous")
        }), /* @__PURE__ */ jsx(SecondaryButton, {
          processing: orders.next_page_url ? false : true,
          onClick: (e) => Inertia.visit(orders.next_page_url),
          children: __("Next")
        })]
      })]
    })]
  });
}
export {
  TokenOrders as default
};
