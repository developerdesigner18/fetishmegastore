import { usePage, Link } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import { a as jsx, j as jsxs } from "../app.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function AccountNavi({
  active
}) {
  const {
    auth
  } = usePage().props;
  return /* @__PURE__ */ jsx("div", {
    className: "lg:w-80 hidden lg:block lg:flex-shrink-0",
    children: /* @__PURE__ */ jsxs("div", {
      className: " bg-white rounded shadow dark:bg-zinc-900",
      children: [/* @__PURE__ */ jsx(Link, {
        className: "block",
        href: `${auth.user.is_streamer === "yes" ? route("payout.withdraw") : route("profile.myTokens")}`,
        children: /* @__PURE__ */ jsxs("span", {
          className: "flex items-center bg-indigo-100 text-indigo-700 text-sm font-bold justify-center py-5 mb-3 rounded-t",
          children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
            className: "h-5 w-5 mr-1"
          }), __(":tokensCount tokens", {
            tokensCount: auth.user.tokens
          })]
        })
      }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "account" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("channel", {
          user: auth.user.username
        }),
        children: __("My Channel")
      }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "channel-settings" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("channel.settings"),
        children: __("Channel Settings")
      }), /* @__PURE__ */ jsxs(Link, {
        className: `block font-bold ${active == "notifications" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("notifications.inbox"),
        children: [__("Notifications"), /* @__PURE__ */ jsx("span", {
          className: "bg-red-100 text-red-500 text-xs font-medium ml-2 px-1.5 py-0.5 rounded-full dark:bg-red-500 dark:text-red-100",
          children: __(":unreadNotificationsCount new", {
            unreadNotificationsCount: auth.unreadNotifications
          })
        })]
      }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "withdraw" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("payout.withdraw"),
        children: __("Withdraw")
      }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "tiers" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("membership.set-tiers"),
        children: __("Membership Tiers")
      }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "upload-videos" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("videos.list"),
        children: __("Upload Videos")
      }), /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "videos" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("videos.ordered"),
        children: __("My Videos")
      }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "followers" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("channel.followers", {
          user: auth.user.username
        }),
        children: __("My Followers")
      }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "my-subscribers" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("mySubscribers"),
        children: __("My Subscribers")
      }), /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "following" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("profile.followings"),
        children: __("My Followings")
      }), /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "my-subscriptions" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("mySubscriptions"),
        children: __("My Subscriptions")
      }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "channel-settings" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("channel.bannedUsers"),
        children: __("Banned Users")
      }), /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "account" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("profile.edit"),
        children: __("My Account")
      }), /* @__PURE__ */ jsx(Link, {
        className: `block font-bold ${active == "fav-videos" ? "text-indigo-900" : "text-indigo-600"} hover:text-indigo-800 py-2 dark:text-white dark:hover:text-indigo-300  dark:border-zinc-800 border-b border-indigo-100 my-2 px-5`,
        href: route("myFavorites"),
        children: __("My Favorite")
      })]
    })
  });
}
export {
  AccountNavi as default
};
