import { useState } from "react";
import { Head } from "@inertiajs/inertia-react";
import { F as Front } from "./Front.602cce17.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { a as jsx, j as jsxs } from "../app.mjs";
import "react-toastify";
import ProfileTabs from "./ProfileTabs.1ae1f5ea.mjs";
import "@inertiajs/inertia";
import "react-dom";
import "react-nl2br";
import Slider from "react-slick";
/* empty css                       */import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "antd";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
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
import "sanitize-html-react";
import "./ChannelVideos.d20c0fce.mjs";
import "./Spinner.a2c890cd.mjs";
import "react-tooltip";
/* empty css                             */import "./SecondaryButton.09a51f74.mjs";
import "./SingleVideo.d5015c6c.mjs";
import "./AuthenticatedLayout.b5843aff.mjs";
import "react-icons/fc/index.js";
import "./PrimaryButton.9fb48a50.mjs";
function StartStream({
  category,
  ofTags
}) {
  var _a;
  useState("Videos");
  ({
    backgroundImage: `url(${category.imageUrl})`
  });
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  console.log("category.galleryUrl", category.galleryUrl);
  return /* @__PURE__ */ jsx(Front, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "-mt-[60px] max-w-5xl mx-auto",
      children: [/* @__PURE__ */ jsxs(Head, {
        title: __(":channelName's channel (:handle)", {
          channelName: category.name,
          handle: `@${category.name}`
        }),
        children: [/* @__PURE__ */ jsx("meta", {
          property: "og:title",
          content: "The Rock"
        }), /* @__PURE__ */ jsx("meta", {
          property: "og:url",
          content: "https://www.imdb.com/title/tt0117500/"
        }), /* @__PURE__ */ jsx("meta", {
          property: "og:image",
          content: "https://ia.media-imdb.com/images/rock.jpg"
        })]
      }), /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx(Slider, {
          ...settings,
          children: (_a = category.galleryUrl) == null ? void 0 : _a.map((v, index) => /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("img", {
              src: v.link,
              alt: "",
              style: {
                width: "auto",
                height: "500px",
                margin: "0  auto"
              }
            })
          }, index))
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "flex items-center flex-wrap justify-between bg-white dark:bg-zinc-900 text-gray-700 -mt-2 rounded-b-lg px-3 pt-5 pb-4 shadow",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center",
          children: [/* @__PURE__ */ jsx("div", {
            className: "relative",
            children: /* @__PURE__ */ jsx("div", {
              className: "border-4 border-white shadow z-10 ml-2",
              children: /* @__PURE__ */ jsx("img", {
                src: category.imageUrl,
                alt: "",
                className: "cursor-pointer w-24 h-34 dark:border-red-100"
              })
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "ml-3 pb-2",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "dark:text-white text-xl lg:text-2xl text-indigo-700 font-bold",
              children: category.name
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-indigo-800 dark:text-white",
              children: ["Age : ", category == null ? void 0 : category.age]
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-indigo-800 dark:text-white",
              children: ["Country : ", category == null ? void 0 : category.country]
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-indigo-800 dark:text-white",
              children: ["Size : ", category == null ? void 0 : category.size]
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-indigo-800 dark:text-white",
              children: ["Shoe Size : ", category == null ? void 0 : category.shoe_size]
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-indigo-800 dark:text-white",
              children: ["Weight : ", category == null ? void 0 : category.weight]
            })]
          })]
        })
      }), /* @__PURE__ */ jsx(ProfileTabs, {
        category
      })]
    })
  });
}
export {
  StartStream as default
};
