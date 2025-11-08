import "react";
import { Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { j as jsxs, a as jsx } from "../app.mjs";
import "@inertiajs/inertia";
import { F as Front } from "./Front.602cce17.mjs";
import "./TextInput.7d39776a.mjs";
import Slider from "react-slick";
/* empty css                       */import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
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
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
function Blogs({
  blog,
  exploreImage
}) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };
  const data = blog;
  console.log("blogs", blog);
  return /* @__PURE__ */ jsxs(Front, {
    containerClass: "w-full",
    extraHeader: true,
    extraHeaderTitle: __("Blogs"),
    extraHeaderImage: exploreImage,
    extraHeaderText: "",
    extraImageHeight: "h-14",
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Blogs")
    }), /* @__PURE__ */ jsx("div", {
      children: /* @__PURE__ */ jsx(Slider, {
        ...settings,
        children: data.map((data2, index) => /* @__PURE__ */ jsxs("div", {
          className: "rounded-xl shadow-lg max-w-[300px]",
          children: [/* @__PURE__ */ jsx("img", {
            src: data2.imageUrl,
            className: "max-h-[200px] ",
            alt: "Blog post image"
          }), /* @__PURE__ */ jsxs("div", {
            className: "p-[10px]",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "font-bold text-[25px]",
              children: data2.title
            }), /* @__PURE__ */ jsx("p", {
              children: data2.description
            })]
          })]
        }, index))
      })
    })]
  });
}
export {
  Blogs as default
};
