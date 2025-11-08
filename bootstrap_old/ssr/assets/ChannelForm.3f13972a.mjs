import { useState, createRef } from "react";
import { I as InputError } from "./InputError.45933222.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { usePage, useForm } from "@inertiajs/inertia-react";
import { Transition } from "@headlessui/react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
import { FaCog } from "react-icons/fa/index.js";
import Cropper$1 from "react-cropper";
import { j as jsxs, a as jsx } from "../app.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
const cropper = "";
const Cropper = "";
function ChannelForm({
  mustVerifyEmail,
  status,
  className
}) {
  const user = usePage().props.auth.user;
  const {
    categories
  } = usePage().props;
  const [previewProfile, setPreviewProfile] = useState(user.profile_picture);
  const [previewCover, setPreviewCover] = useState(user.cover_picture);
  const {
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    post,
    progress
  } = useForm({
    username: user.username,
    about: user.about,
    category: user.firstCategory.id,
    headline: user.headline
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("channel.update-settings"), {
      preserveState: false
    });
  };
  const changeProfilePicture = (file) => {
    setData("profilePicture", file);
    setPreviewProfile((window.URL ? URL : webkitURL).createObjectURL(file));
  };
  const [image, setImage] = useState(previewCover);
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();
  const onChangeImage = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = (e) => {
    var _a, _b, _c;
    e.preventDefault();
    if (typeof ((_a = cropperRef.current) == null ? void 0 : _a.cropper) !== "undefined") {
      (_b = cropperRef.current) == null ? void 0 : _b.cropper.getCroppedCanvas().toBlob(function(blob) {
        setData("coverPicture", blob);
      });
      setCropData((_c = cropperRef.current) == null ? void 0 : _c.cropper.getCroppedCanvas().toDataURL());
    }
  };
  return /* @__PURE__ */ jsxs("section", {
    className,
    children: [/* @__PURE__ */ jsxs("header", {
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center",
        children: [/* @__PURE__ */ jsx(FaCog, {
          className: "text-gray-600 dark:text-gray-100 mr-2"
        }), /* @__PURE__ */ jsx("h2", {
          className: "text-xl font-medium text-gray-600 dark:text-gray-100",
          children: __("Channel Settings")
        })]
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-1 text-sm text-gray-600 dark:text-gray-400",
        children: __("Update your channel infos")
      })]
    }), /* @__PURE__ */ jsxs("form", {
      onSubmit: submit,
      className: "mt-6 space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "username",
          value: __("Username")
        }), /* @__PURE__ */ jsx(TextInput, {
          id: "username",
          className: "mt-1 block w-full",
          value: data.username,
          handleChange: (e) => setData("username", e.target.value),
          required: true,
          autofocus: true
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.username
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "category",
          value: __("Category")
        }), /* @__PURE__ */ jsxs("select", {
          name: "category",
          onChange: (e) => setData("category", e.target.value),
          className: `mt-1 block w-full border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `,
          defaultValue: data.category,
          children: [/* @__PURE__ */ jsx("option", {
            value: "",
            children: __("- Select -")
          }), categories.map((c, cIndex) => {
            return /* @__PURE__ */ jsx("option", {
              value: c.id,
              children: c.category
            }, c.id);
          })]
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.category
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "profilePicture",
          value: __("Profile Picture - 80x80 recommended")
        }), /* @__PURE__ */ jsx(TextInput, {
          className: "p-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900",
          id: "profilePicture",
          type: "file",
          handleChange: (e) => changeProfilePicture(e.target.files[0])
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.profilePicture
        }), /* @__PURE__ */ jsx("img", {
          src: previewProfile,
          alt: "profile picture",
          className: "h-20 rounded-full mt-2 border-white border-2 dark:border-indigo-200"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "coverPicture",
          value: __("Cover Picture - 960x280 recommended")
        }), /* @__PURE__ */ jsx(TextInput, {
          className: "p-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900",
          id: "coverPicture",
          type: "file",
          handleChange: (e) => onChangeImage(e)
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              width: "100%"
            },
            children: /* @__PURE__ */ jsx(Cropper$1, {
              ref: cropperRef,
              style: {
                height: 400,
                width: "100%"
              },
              zoomTo: 0.5,
              initialAspectRatio: 16 / 9,
              aspectRatio: 16 / 9,
              preview: ".img-preview",
              src: image,
              viewMode: 1,
              background: false,
              responsive: true,
              autoCropArea: 1,
              checkOrientation: false,
              guides: true
            })
          }), /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("div", {
              className: "box",
              children: /* @__PURE__ */ jsx("button", {
                onClick: getCropData,
                children: __("Crop Image")
              })
            })
          }), /* @__PURE__ */ jsx("br", {
            style: {
              clear: "both"
            }
          })]
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.coverPicture
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-3 img-preview",
          children: /* @__PURE__ */ jsx("img", {
            src: previewCover,
            alt: "cover picture",
            className: "rounded-md border-2 border-white dark:border-indigo-200 h-40"
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "headline",
          value: __("Profile Headline")
        }), /* @__PURE__ */ jsx(TextInput, {
          id: "headline",
          className: "mt-1 block w-full",
          value: data.headline,
          handleChange: (e) => setData("headline", e.target.value),
          required: true,
          autofocus: true
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.headline
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(InputLabel, {
          for: "about",
          value: __("Channel About - html <img /> tag allowed")
        }), /* @__PURE__ */ jsx(Textarea, {
          id: "about",
          className: "mt-1 block w-full",
          value: data.about ? data.about : "",
          handleChange: (e) => setData("about", e.target.value)
        }), /* @__PURE__ */ jsxs("div", {
          className: "bg-zinc-300 dark:bg-zinc-800 dark:text-gray-200 rounded p-2 text-xs mt-2",
          children: [/* @__PURE__ */ jsxs("strong", {
            className: "font-bold",
            children: ["Allowed HTML Tags:", " "]
          }), "img, h3, h4, h5, h6, blockquote, p, a, ul,ol,nl,li,b,i,strong,em, strike,code,hr,br,div,table,thead, caption,tbody,tr,th,td,pre'"]
        }), /* @__PURE__ */ jsx(InputError, {
          className: "mt-2",
          message: errors.about
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(PrimaryButton, {
          processing,
          children: __("Save")
        }), /* @__PURE__ */ jsx(Transition, {
          show: recentlySuccessful,
          enterFrom: "opacity-0",
          leaveTo: "opacity-0",
          className: "transition ease-in-out",
          children: /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-gray-600 dark:text-gray-400",
            children: [__("Saved"), "."]
          })
        })]
      }), progress && /* @__PURE__ */ jsxs("progress", {
        value: progress.percentage,
        max: "100",
        children: [progress.percentage, "%"]
      })]
    })]
  });
}
export {
  ChannelForm as default
};
