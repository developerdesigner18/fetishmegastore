import "react";
import { FaWhatsapp, FaTwitter, FaLink } from "react-icons/fa/index.js";
import { toast } from "react-toastify";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { Head } from "@inertiajs/inertia-react";
import { a as jsx, j as jsxs, F as Fragment } from "../app.mjs";
import "@inertiajs/inertia";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "./Translate.346b89d9.mjs";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
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
const LinkComponent = ({
  link,
  inModal
}) => {
  console.log(link, "link", inModal);
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied successfully");
  };
  const handleWhatsAppShare = () => {
  };
  const handleXShare = () => {
  };
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("div", {
      className: `justify-center w-full ${inModal ? "p-3" : "p-0"}`,
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center flex-shrink-0",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mt-1 text-center",
          children: /* @__PURE__ */ jsx("p", {
            className: "text-lg font-bold",
            children: "Share this Video"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-3 flex space-x-4",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full cursor-pointer",
            onClick: handleWhatsAppShare,
            children: /* @__PURE__ */ jsx(FaWhatsapp, {
              size: 30,
              style: {
                color: "white"
              }
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center justify-center w-12 h-12 bg-black-400 text-white rounded-full cursor-pointer",
            style: {
              "background-color": "black"
            },
            onClick: handleXShare,
            children: /* @__PURE__ */ jsx(FaTwitter, {
              size: 30,
              style: {
                color: "white",
                "background-color": "black"
              }
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center justify-center w-12 h-12 bg-zinc-300 text-dark rounded-full cursor-pointer",
            onClick: handleCopyUrl,
            children: /* @__PURE__ */ jsx(FaLink, {
              size: 30
            })
          })]
        })]
      })
    })
  });
};
function ShareLink({
  link,
  inModal = false
}) {
  if (inModal) {
    return /* @__PURE__ */ jsx(LinkComponent, {
      link,
      inModal: true
    });
  } else {
    return /* @__PURE__ */ jsxs(Authenticated, {
      children: [/* @__PURE__ */ jsx(Head, {
        title: video.title
      }), /* @__PURE__ */ jsx(LinkComponent, {
        video,
        inModal: false
      })]
    });
  }
}
export {
  ShareLink as default
};
