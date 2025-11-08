import { useState } from "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { usePage, useForm, Head, Link } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { M as Modal } from "./Modal.c4c8f017.mjs";
import nl2br from "react-nl2br";
import { D as DangerButton } from "./DangerButton.5b75de10.mjs";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { RiDeleteBin5Line } from "react-icons/ri/index.js";
import { AiOutlineEdit } from "react-icons/ai/index.js";
import { Inertia } from "@inertiajs/inertia";
import AccountNavi from "./AccountNavi.87076860.mjs";
import { FaGrinStars } from "react-icons/fa/index.js";
import { j as jsxs, a as jsx } from "../app.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "antd";
import "@headlessui/react";
import "react-toastify";
import "lodash.debounce";
import "axios";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "react-dom";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function SetTiers({
  auth,
  tiers,
  thanksMsg
}) {
  usePage().props;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showThanksModal, setShowThanksModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [thanks, setThanks] = useState(thanksMsg);
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    tier_name: "",
    perks: "",
    tier_price: "",
    six_months_discount: 10,
    one_year_discount: 20
  });
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("membership.add-tier"), {
      onSuccess: () => {
        setShowAddModal(false), reset();
      }
    });
  };
  const saveThanks = (e) => {
    e.preventDefault();
    Inertia.visit(route("membership.save-thanks", {
      thanks_message: thanks
    }), {
      method: "POST"
    });
  };
  const confirmDelete = (e, id) => {
    e.preventDefault();
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };
  const deleteTier = () => {
    console.log("Will delete #" + deleteId);
    Inertia.visit(route("membership.delete-tier"), {
      method: "POST",
      data: {
        tier: deleteId
      },
      preserveState: false
    });
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Channel Membership Tiers")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "tiers"
      }), /* @__PURE__ */ jsxs("div", {
        className: "p-4 flex-shrink sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg",
        children: [/* @__PURE__ */ jsxs("header", {
          children: [/* @__PURE__ */ jsxs("h2", {
            className: "text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100",
            children: [/* @__PURE__ */ jsx(FaGrinStars, {
              className: "mr-2"
            }), __("Channel Membership Tiers")]
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400",
            children: __("Set the subscription prices and perks for your channel")
          }), /* @__PURE__ */ jsx(PrimaryButton, {
            onClick: (e) => setShowAddModal(true),
            children: __("+Add Tier")
          }), /* @__PURE__ */ jsx(SecondaryButton, {
            className: "ml-2",
            onClick: (e) => setShowThanksModal(true),
            children: __("Configure Thanks Message")
          })]
        }), /* @__PURE__ */ jsx("hr", {
          className: "my-5"
        }), /* @__PURE__ */ jsx(Modal, {
          show: showThanksModal,
          onClose: (e) => setShowThanksModal(false),
          children: /* @__PURE__ */ jsxs("div", {
            className: "p-5 text-gray-600 dark:text-gray-100 text-lg text-center",
            children: [__("Here you can configure a thanks message which will be sent as a notification to users which just subscribed to any of your tiers"), /* @__PURE__ */ jsx("form", {
              onSubmit: saveThanks,
              children: /* @__PURE__ */ jsxs("div", {
                className: "my-4",
                children: [/* @__PURE__ */ jsx(Textarea, {
                  name: "thanks_message",
                  value: thanks,
                  handleChange: (e) => {
                    setThanks(e.target.value);
                  },
                  required: true,
                  className: "mt-1 block w-full"
                }), /* @__PURE__ */ jsx(InputError, {
                  message: errors.thanks_message,
                  className: "mt-2"
                }), /* @__PURE__ */ jsx(PrimaryButton, {
                  processing,
                  className: "mt-4",
                  children: __("Save")
                })]
              })
            })]
          })
        }), /* @__PURE__ */ jsx(Modal, {
          show: showAddModal,
          onClose: (e) => setShowAddModal(false),
          children: /* @__PURE__ */ jsx("div", {
            className: "p-5",
            children: /* @__PURE__ */ jsxs("form", {
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
                    value: __("Tier Price (Tokens)")
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center",
                    children: [/* @__PURE__ */ jsx(TextInput, {
                      name: "tier_price",
                      value: data.tier_price,
                      handleChange: onHandleChange,
                      required: true,
                      className: "mt-1 block w-24"
                    }), /* @__PURE__ */ jsx("div", {
                      className: "ml-1 dark:text-white text-gray-700",
                      children: __(" tokens/month")
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
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex justify-between items-center",
                children: [/* @__PURE__ */ jsx(PrimaryButton, {
                  processing,
                  children: __("Save Tier")
                }), /* @__PURE__ */ jsx("a", {
                  className: "cursor-pointer ml-2 text-sm text-rose-600 hover:text-rose-800",
                  onClick: (e) => setShowAddModal(false),
                  children: __("Cancel")
                })]
              })]
            })
          })
        }), /* @__PURE__ */ jsx(Modal, {
          show: showDeleteConfirmation,
          onClose: (e) => setShowDeleteConfirmation(false),
          children: /* @__PURE__ */ jsxs("div", {
            className: "px-5 py-10 text-center",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "text-xl mb-3 text-zinc-700 dark:text-white",
              children: __("Are you sure you want to remove this Tier?")
            }), /* @__PURE__ */ jsx(DangerButton, {
              onClick: (e) => deleteTier(),
              children: __("Yes")
            }), /* @__PURE__ */ jsx(SecondaryButton, {
              className: "ml-3",
              onClick: (e) => setShowDeleteConfirmation(false),
              children: __("No")
            })]
          })
        }), /* @__PURE__ */ jsx("span", {
          className: "text-gray-600",
          children: !tiers.length && __("You did't create any membership tiers yet.")
        }), tiers.length && /* @__PURE__ */ jsx("div", {
          className: "relative overflow-x-auto mt-5",
          children: /* @__PURE__ */ jsxs("table", {
            className: "w-full text-sm text-left text-gray-500 dark:text-gray-400",
            children: [/* @__PURE__ */ jsx("thead", {
              className: "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400",
              children: /* @__PURE__ */ jsxs("tr", {
                children: [/* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("Tier")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("Price (Tokens)")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("6 Mths %")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("1 Yr %")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("Perks")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: __("Members")
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-6 py-3",
                  children: "-"
                })]
              })
            }), /* @__PURE__ */ jsx("tbody", {
              children: tiers.map((t) => /* @__PURE__ */ jsxs("tr", {
                className: "bg-white border-b dark:bg-zinc-900 dark:border-zinc-700",
                children: [/* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4 text-lg font-semibold",
                  children: t.tier_name
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: /* @__PURE__ */ jsx("span", {
                    className: "px-2 flex py-1 rounded-lg bg-sky-500 text-white",
                    children: __(":tokensPrice tokens", {
                      tokensPrice: t.price
                    })
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: /* @__PURE__ */ jsxs("span", {
                    className: "px-2 py-1 rounded-lg bg-teal-500 text-white",
                    children: [t.six_months_discount, "%"]
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: /* @__PURE__ */ jsxs("span", {
                    className: "px-2 py-1 rounded-lg bg-fuchsia-500 text-white",
                    children: [t.one_year_discount, "%"]
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: nl2br(t.perks)
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: /* @__PURE__ */ jsx("span", {
                    className: "px-2 py-1 rounded-lg bg-neutral-300 text-neutral-700",
                    children: t.subscribers_count
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-6 py-4",
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center",
                    children: [/* @__PURE__ */ jsx(Link, {
                      href: route("membership.edit-tier", {
                        tier: t.id
                      }),
                      children: /* @__PURE__ */ jsx(AiOutlineEdit, {
                        className: "w-6 h-6 mr-2 text-sky-600"
                      })
                    }), /* @__PURE__ */ jsx("button", {
                      onClick: (e) => confirmDelete(e, t.id),
                      children: /* @__PURE__ */ jsx(RiDeleteBin5Line, {
                        className: "text-red-600 w-5 h-5"
                      })
                    })]
                  })
                })]
              }, t.id))
            })]
          })
        })]
      })]
    })]
  });
}
export {
  SetTiers as default
};
