import "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { useForm, usePage, Head, Link } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { BsCheckAll, BsCheckCircleFill } from "react-icons/bs/index.js";
import { AiOutlineBell } from "react-icons/ai/index.js";
import { ImFilesEmpty } from "react-icons/im/index.js";
import nl2br from "react-nl2br";
import { FaPiggyBank } from "react-icons/fa/index.js";
import AccountNavi from "./AccountNavi.87076860.mjs";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "react-toastify";
import "lodash.debounce";
import "axios";
import "./TextInput.7d39776a.mjs";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function Edit({
  notifications
}) {
  const {
    post,
    processing
  } = useForm();
  const {
    auth,
    currency_symbol
  } = usePage().props;
  const markAsRead = (n) => {
    post(route("notifications.markAsRead", {
      notification: n.id
    }));
  };
  const markAllRead = () => {
    post(route("notifications.markAllRead"));
  };
  const RenderNotification = ({
    n
  }) => {
    switch (n.type) {
      case "App\\Notifications\\PaymentRequestProcessed":
        return /* @__PURE__ */ jsx(Fragment, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex-grow flex items-center",
              children: [/* @__PURE__ */ jsx(FaPiggyBank, {
                className: "mr-2 w-8 h-8 text-teal-500"
              }), __("Your payout request of :amount made on :date was processed!", {
                amount: currency_symbol + "" + n.data.amount,
                date: n.data.date
              })]
            }), /* @__PURE__ */ jsx("div", {
              children: n.read_at === null ? /* @__PURE__ */ jsxs("button", {
                onClick: (e) => markAsRead(n),
                className: "inline-flex items-center space-x-3 text-sky-500 hover:text-sky-600",
                children: [/* @__PURE__ */ jsx(BsCheckAll, {}), __("Mark as Read")]
              }) : /* @__PURE__ */ jsx(BsCheckCircleFill, {})
            })]
          })
        });
      case "App\\Notifications\\NewFollower":
        return /* @__PURE__ */ jsx(Fragment, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center space-x-2",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex-shrink-0",
                children: /* @__PURE__ */ jsx("img", {
                  src: n.data.profile_picture,
                  alt: "",
                  className: "rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "text-sky-500",
                  children: ["@", n.data.username]
                }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("span", {
                  className: "text-gray-600 dark:text-gray-100",
                  children: __("just followed you")
                })]
              })]
            }), /* @__PURE__ */ jsx("div", {
              children: n.read_at === null ? /* @__PURE__ */ jsxs("button", {
                onClick: (e) => markAsRead(n),
                className: "inline-flex items-center space-x-3 text-sky-500 hover:text-sky-600",
                children: [/* @__PURE__ */ jsx(BsCheckAll, {}), __("Mark as Read")]
              }) : /* @__PURE__ */ jsx(BsCheckCircleFill, {})
            })]
          })
        });
      case "App\\Notifications\\NewSubscriber":
        return /* @__PURE__ */ jsxs("div", {
          className: "flex flex-wrap justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex-shrink-0",
              children: /* @__PURE__ */ jsx(Link, {
                href: `${n.data.isStreamer === "yes" ? route("channel", {
                  user: n.data.username
                }) : ""}`,
                children: /* @__PURE__ */ jsx("img", {
                  src: n.data.profilePicture,
                  alt: "",
                  className: "rounded-full h-14 w-14 border-zinc-200 dark:border-indigo-200 border"
                })
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs(Link, {
                href: `${n.data.isStreamer === "yes" ? route("channel", {
                  user: n.data.username
                }) : ""}`,
                className: "text-sky-500",
                children: ["@", n.data.username]
              }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("span", {
                className: "text-gray-600 dark:text-gray-100",
                children: __("just subscribed to your tier :tierName for :tokensAmount tokens till :renewalDate", {
                  tierName: n.data.tierName,
                  tokensAmount: n.data.tokens,
                  renewalDate: n.data.renewalDate
                })
              })]
            })]
          }), /* @__PURE__ */ jsx("div", {
            children: n.read_at === null ? /* @__PURE__ */ jsxs("button", {
              onClick: (e) => markAsRead(n),
              className: "inline-flex items-center space-x-3 text-sky-500 hover:text-sky-600",
              children: [/* @__PURE__ */ jsx(BsCheckAll, {}), __("Mark as Read")]
            }) : /* @__PURE__ */ jsx(BsCheckCircleFill, {})
          })]
        });
      case "App\\Notifications\\ThanksNotification":
        return /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-start space-x-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex-shrink-0",
              children: /* @__PURE__ */ jsx(Link, {
                href: route("channel", {
                  user: n.data.username
                }),
                children: /* @__PURE__ */ jsx("img", {
                  src: n.data.profile_picture,
                  alt: "",
                  className: "rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                })
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs(Link, {
                href: route("channel", {
                  user: n.data.username
                }),
                className: "text-sky-500",
                children: ["@", n.data.username]
              }), " ", /* @__PURE__ */ jsxs("span", {
                className: "text-gray-700 dark:text-gray-100",
                children: [__("just thanked for your subscription"), ","]
              }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("blockquote", {
                className: "italic text-gray-600 dark:text-gray-100",
                children: nl2br(n.data.thanks_message)
              })]
            })]
          }), /* @__PURE__ */ jsx("div", {
            children: n.read_at === null ? /* @__PURE__ */ jsxs("button", {
              onClick: (e) => markAsRead(n),
              className: "inline-flex items-center space-x-3 text-sky-500 hover:text-sky-600",
              children: [/* @__PURE__ */ jsx(BsCheckAll, {}), __("Mark as Read")]
            }) : /* @__PURE__ */ jsx(BsCheckCircleFill, {})
          })]
        });
      case "App\\Notifications\\NewVideoSale":
        return /* @__PURE__ */ jsxs("div", {
          className: "flex flex-wrap justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex-shrink-0",
              children: /* @__PURE__ */ jsx(Link, {
                href: `${n.data.is_streamer === "yes" ? route("channel", {
                  user: n.data.username
                }) : ""}`,
                children: /* @__PURE__ */ jsx("img", {
                  src: n.data.profile_picture,
                  alt: "",
                  className: "rounded-full h-14 w-14 border-zinc-200 dark:border-indigo-200 border"
                })
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs(Link, {
                href: `${n.data.is_streamer === "yes" ? route("channel", {
                  user: n.data.username
                }) : ""}`,
                className: "text-sky-500",
                children: ["@", n.data.username]
              }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("span", {
                className: "text-gray-600 dark:text-gray-100",
                children: __('just bought your video ":videoTitle" for :tokensAmount tokens', {
                  videoTitle: n.data.video.title,
                  tokensAmount: n.data.price
                })
              })]
            })]
          }), /* @__PURE__ */ jsx("div", {
            children: n.read_at === null ? /* @__PURE__ */ jsxs("button", {
              onClick: (e) => markAsRead(n),
              className: "inline-flex items-center space-x-3 text-sky-500 hover:text-sky-600",
              children: [/* @__PURE__ */ jsx(BsCheckAll, {}), __("Mark as Read")]
            }) : /* @__PURE__ */ jsx(BsCheckCircleFill, {})
          })]
        });
      default:
        return `NOTIFICATION_TYPE: ${n.type}`;
    }
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    auth,
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Notifications")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10 w-full",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "notifications"
      }), /* @__PURE__ */ jsxs("div", {
        className: "bg-white rounded-lg w-full shadow dark:bg-zinc-900 p-4 sm:p-8",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2 flex-wrap",
            children: [/* @__PURE__ */ jsx(AiOutlineBell, {
              className: "w-8 h-8 text-gray-600 dark:text-gray-100"
            }), /* @__PURE__ */ jsx("h2", {
              className: "text-lg md:text-xl font-medium text-gray-600 dark:text-gray-100",
              children: __("Notifications")
            })]
          }), /* @__PURE__ */ jsx("div", {
            children: notifications.data.length && auth.unreadNotifications > 0 && /* @__PURE__ */ jsxs("button", {
              onClick: (e) => markAllRead(),
              className: "inline-flex items-center space-x-3 border-2 border-sky-500 rounded-lg p-2 font-semibold text-sm text-sky-500 hover:text-sky-600 hover:border-sky-600",
              children: [/* @__PURE__ */ jsx(BsCheckAll, {}), __("Mark All As Read")]
            })
          })]
        }), notifications.data.length === 0 && /* @__PURE__ */ jsxs("div", {
          className: "mt-10 p-4 sm:p-8 bg-slate-50 dark:bg-zinc-900 shadow sm:rounded-lg text-gray-600 text-center dark:text-white",
          children: [/* @__PURE__ */ jsx("center", {
            children: /* @__PURE__ */ jsx(ImFilesEmpty, {
              className: "h-16 w-16 mb-3"
            })
          }), /* @__PURE__ */ jsx("h3", {
            className: "text-xl",
            children: __("No notifications")
          })]
        }), notifications.data.map((n) => /* @__PURE__ */ jsx("div", {
          className: `mt-10 px-4 py-2.5 bg-slate-50 dark:bg-zinc-900 sm:rounded-lg dark:text-white ${n.read_at ? "" : "border border-slate-200 dark:border-gray-700"}`,
          children: /* @__PURE__ */ jsx(RenderNotification, {
            n
          })
        }, n.id))]
      })]
    })]
  });
}
export {
  Edit as default
};
