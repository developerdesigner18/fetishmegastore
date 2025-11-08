import { useEffect } from "react";
import { usePage, useForm } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { BsClockHistory } from "react-icons/bs/index.js";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { toast } from "react-toastify";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function History({
  withdrawals
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
    errors
  } = useForm();
  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-white px-2 py-1 rounded-lg";
      case "Paid":
        return "bg-green-500 text-white px-2 py-1 rounded-lg";
      case "Canceled":
        return "bg-red-100 text-red-600 px-2 py-1 rounded-lg";
    }
  };
  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).map((err) => {
        toast.error(errors[err]);
      });
    }
  }, [errors]);
  const cancelRequest = (id) => {
    post(route("payout.cancelRequest", {
      withdrawal_id: id
    }));
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center space-x-4",
      children: [/* @__PURE__ */ jsx("div", {
        children: processing ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsx(BsClockHistory, {
          className: "w-12 h-12 text-green-600"
        })
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-2xl font-semibold dark:text-white",
          children: __("Payout History")
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-1 text-gray-600 dark:text-gray-400",
          children: __("History of payments made to you")
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-4",
      children: withdrawals.length ? /* @__PURE__ */ jsx(Fragment, {
        children: /* @__PURE__ */ jsx("div", {
          className: "relative overflow-x-auto mt-5",
          children: /* @__PURE__ */ jsxs("table", {
            className: "w-full text-sm text-left text-gray-500 dark:text-gray-400",
            children: [/* @__PURE__ */ jsx("thead", {
              className: "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400",
              children: /* @__PURE__ */ jsxs("tr", {
                children: [/* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("ID")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("Tokens")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("Amount")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("Status")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("Date")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: "-"
                })]
              })
            }), /* @__PURE__ */ jsx("tbody", {
              children: withdrawals.map((w) => /* @__PURE__ */ jsxs("tr", {
                className: "bg-white border-b dark:bg-zinc-900 dark:border-zinc-700",
                children: [/* @__PURE__ */ jsxs("td", {
                  className: "px-6 py-4 font-bold",
                  children: ["#", w.id]
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: /* @__PURE__ */ jsx("span", {
                    className: "px-2 py-1 rounded-lg bg-neutral-300 text-neutral-700",
                    children: w.tokens
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: /* @__PURE__ */ jsx("span", {
                    className: "px-2 py-1 rounded-lg bg-sky-500 text-white",
                    children: `${currency_symbol}${w.amount}`
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: /* @__PURE__ */ jsx("span", {
                    className: statusBadge(w.status),
                    children: w.status
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: w.created_at_human
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: w.status == "Pending" && /* @__PURE__ */ jsx("button", {
                    disabled: processing,
                    onClick: (e) => cancelRequest(w.id),
                    className: "text-sky-500 hover:text-sky-700",
                    children: __("Cancel")
                  })
                })]
              }, w.id))
            })]
          })
        })
      }) : /* @__PURE__ */ jsx("span", {
        className: "text-2xl text-gray-700",
        children: __("You made no withdrawals yet")
      })
    })]
  });
}
export {
  History as default
};
