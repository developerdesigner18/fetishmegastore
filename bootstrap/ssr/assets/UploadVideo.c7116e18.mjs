import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { toast } from "react-toastify";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import { useForm, Head } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { useState, useEffect } from "react";
import axios from "axios";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { MdVideoLibrary } from "react-icons/md/index.js";
import AccountNavi from "./AccountNavi.87076860.mjs";
import { Select, Switch } from "antd";
import { j as jsxs, a as jsx } from "../app.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/bs/index.js";
import "@headlessui/react";
import "./Modal.c4c8f017.mjs";
import "react-dom";
import "lodash.debounce";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function UploadVideo({
  video,
  categories,
  fileNames,
  tags,
  models
}) {
  const {
    data,
    setData,
    post,
    processing,
    errors,
    progress
  } = useForm({
    title_en: video.title_en,
    title_de: video.title_de,
    tag: video.tag,
    description_en: video.description_en,
    description_de: video.description_de,
    category_id: video.category_id,
    model_id: video.model_id,
    price: video.price,
    free_for_subs: video.free_for_subs,
    is_from_ftp: false,
    thumbnail: "",
    video_file: ""
  });
  const [videoFile, setVideoFile] = useState("");
  const [chunks, setChunks] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [videoId, setVideoId] = useState(2);
  const [uploaded, setUploaded] = useState(0);
  const [checked, setChecked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const handleChange = () => {
    setChecked(!checked);
    data.is_from_ftp = checked === true ? false : true;
  };
  useEffect(() => {
    if (video) {
      if ((video == null ? void 0 : video.is_from_ftp) == 1) {
        setChecked(true);
        data.is_from_ftp = true;
      } else if ((video == null ? void 0 : video.is_from_ftp) == 0) {
        setChecked(false);
        data.is_from_ftp = false;
      }
    }
    setSelectedCategory(video.category_id);
  }, []);
  const handleVideoChange = (value) => {
    console.log(`selected ${value}`);
    setVideoFile(value);
    data.video_file = "videos/" + value;
    data.is_from_ftp = checked;
  };
  const handleTagChange = (value) => {
    console.log(`selected tag ${value}`);
    data.tag = value;
  };
  const handleCategoryChange = (value) => {
    console.log(`selected category ${value}`);
    data.category_id = value;
  };
  const handleModelChange = (value) => {
    console.log(`selected model ${value}`);
    data.model_id = value;
  };
  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).map((key) => {
        toast.error(errors.key);
      });
    }
  }, [errors]);
  useEffect(() => {
    if (chunks.length > 0) {
      uploadChunks();
    }
  }, [chunks]);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
  };
  const createChunks = () => {
    setChunks([]);
    let size = 1024 * 1024 * 8;
    let chunksCount = Math.ceil(videoFile.size / size);
    for (let i = 0; i < chunksCount; i++) {
      setChunks((chunks2) => [...chunks2, videoFile.slice(i * size, Math.min(i * size + size, videoFile.size), videoFile.type)]);
    }
  };
  const uploadChunks = () => {
    setSpinner(true);
    const postData = new FormData();
    postData.append("media_type", "video");
    postData.append("is_last", chunks.length === 1);
    postData.append("video", videoId);
    postData.set("file", chunks[0], `${videoFile.name}.part`);
    axios.post(route("video.uploadChunks"), postData, {
      onUploadProgress: (event) => {
        setUploaded(uploaded + event.loaded);
      }
    }).then(function(response) {
      if (chunks.length <= 1) {
        setChunks([]);
        setUploaded(0);
        data.video_file = response.data.result;
        console.log(response.data.result);
        console.log(`Chunks.length <= 1, posting data`);
        console.log(data);
        if (video.id === null) {
          post(route("videos.save"));
        } else {
          updateVideo();
        }
      }
      let chunksArray = [...chunks];
      chunksArray.splice(0, 1);
      setChunks(chunksArray);
    }).catch(function(error) {
      var _a, _b;
      setUploaded(0);
      toast.error((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message);
    }).then(function() {
      setSpinner(false);
    });
  };
  const submit = (e) => {
    e.preventDefault();
    console.log(videoFile, "videoFile");
    if (videoFile) {
      if (checked) {
        setSpinner(true);
        if (video.id === null) {
          post(route("videos.save"));
        } else {
          console.log("ggwp");
          post(route("videos.update", {
            video: video.id
          }));
        }
        setSpinner(false);
      } else {
        createChunks();
      }
    } else if (videoFile === "" && video.id !== null) {
      if (checked) {
        console.log("gg");
        post(route("videos.update", {
          video: video.id
        }));
      } else {
        updateVideo();
      }
    }
  };
  const updateVideo = () => {
    post(route("videos.update", {
      video: video.id
    }));
  };
  return /* @__PURE__ */ jsxs(Authenticated, {
    children: [/* @__PURE__ */ jsx(Head, {
      title: __("Upload Video")
    }), /* @__PURE__ */ jsxs("div", {
      className: "lg:flex lg:space-x-10",
      children: [/* @__PURE__ */ jsx(AccountNavi, {
        active: "upload-videos"
      }), /* @__PURE__ */ jsxs("div", {
        className: "p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg",
        children: [/* @__PURE__ */ jsxs("header", {
          className: "mb-5",
          children: [/* @__PURE__ */ jsxs("h2", {
            className: "text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100",
            children: [/* @__PURE__ */ jsx(MdVideoLibrary, {
              className: "mr-2"
            }), video.id === null ? __("Upload Video") : __("Edit Video")]
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400",
            children: __("Upload a new video")
          }), /* @__PURE__ */ jsx(PrimaryButton, {
            onClick: (e) => Inertia.visit(route("videos.list")),
            children: __("<< Back to Videos")
          })]
        }), /* @__PURE__ */ jsx("hr", {
          className: "my-5"
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: submit,
          encType: "multipart/form-data",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-5",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "title",
              value: __("Title")
            }), /* @__PURE__ */ jsx(TextInput, {
              name: "title_en",
              value: data.title_en,
              handleChange: onHandleChange,
              required: true,
              className: "mt-1 block w-full md:w-1/2"
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.title_en,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mb-5",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "title",
              value: __("German Title")
            }), /* @__PURE__ */ jsx(TextInput, {
              name: "title_de",
              value: data.title_de,
              handleChange: onHandleChange,
              required: true,
              className: "mt-1 block w-full md:w-1/2"
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.title_de,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mb-5",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "category",
              value: __("Category")
            }), /* @__PURE__ */ jsx(Select, {
              mode: "multiple",
              allowClear: true,
              showSearch: true,
              style: {
                width: "50%"
              },
              placeholder: "Please select",
              defaultValue: video.category_id == "" ? [] : video.selectedCategory,
              onChange: handleCategoryChange,
              options: categories
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.category_id,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mb-5",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "model",
              value: __("Model")
            }), /* @__PURE__ */ jsx(Select, {
              mode: "multiple",
              allowClear: true,
              showSearch: true,
              style: {
                width: "50%"
              },
              placeholder: "Please select",
              defaultValue: video.model_id === null ? [] : video.selectedModel,
              onChange: handleModelChange,
              options: models
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.model_id,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mb-5",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "tag",
              value: __("Tags")
            }), /* @__PURE__ */ jsx(Select, {
              mode: "multiple",
              allowClear: true,
              showSearch: true,
              style: {
                width: "50%"
              },
              placeholder: "Please select",
              defaultValue: video.tags === null ? [] : video.tags,
              onChange: handleTagChange,
              options: tags
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.tag,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex w-full md:w-1/2 flex-col md:flex-row md:items-center md:space-x-10 md:justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "mb-5",
              children: [/* @__PURE__ */ jsx(InputLabel, {
                for: "price",
                value: __("Price")
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center",
                children: [/* @__PURE__ */ jsx(TextInput, {
                  type: "number",
                  name: "price",
                  value: data.price,
                  handleChange: onHandleChange,
                  required: true,
                  className: "mt-1  w-32"
                }), /* @__PURE__ */ jsx("div", {
                  className: "ml-1 dark:text-white text-gray-700",
                  children: __("tokens")
                })]
              }), /* @__PURE__ */ jsx(InputError, {
                message: errors.price,
                className: "mt-2"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "mb-5",
              children: [/* @__PURE__ */ jsx(InputLabel, {
                for: "free_for_subs",
                value: __("Free for subscribers?")
              }), /* @__PURE__ */ jsxs("select", {
                name: "free_for_subs",
                value: data.free_for_subs,
                onChange: onHandleChange,
                required: true,
                className: `mt-1 block w-32 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `,
                children: [/* @__PURE__ */ jsx("option", {
                  value: "yes",
                  children: __("Yes")
                }), /* @__PURE__ */ jsx("option", {
                  value: "no",
                  children: __("No")
                })]
              }), /* @__PURE__ */ jsx(InputError, {
                message: errors.free_for_subs,
                className: "mt-2"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mb-5",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "thumbnail",
              value: __("Thumbnail - helps to attract sales (will be resized to 640x320px)")
            }), /* @__PURE__ */ jsx(TextInput, {
              className: "p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900",
              type: "file",
              name: "thumbnail",
              handleChange: (e) => setData("thumbnail", e.target.files[0]),
              required: video.id === null
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.thumbnail,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsxs("label", {
              children: [/* @__PURE__ */ jsx(Switch, {
                onChange: handleChange,
                checked: data.is_from_ftp
              }), "Select video from ftp?"]
            })
          }), !checked && /* @__PURE__ */ jsxs("div", {
            className: "mb-5",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "video",
              value: __("Video")
            }), /* @__PURE__ */ jsx(TextInput, {
              className: "p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900",
              type: "file",
              name: "video",
              accept: "video/mp4,video/webm,video/ogg,video/quicktime,video/qt,video/mov",
              handleChange: (e) => setVideoFile(e.target.files[0]),
              required: video.id === null
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.video_file,
              className: "mt-2"
            })]
          }), checked && /* @__PURE__ */ jsx("div", {
            className: "mt-2",
            children: /* @__PURE__ */ jsx(Select, {
              mode: "single",
              allowClear: true,
              showSearch: true,
              style: {
                width: "50%"
              },
              placeholder: "Please select",
              defaultValue: video.video,
              onChange: handleVideoChange,
              options: fileNames
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "mb-5",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "description_en",
              value: __("Description")
            }), /* @__PURE__ */ jsx(Textarea, {
              name: "description_en",
              value: data.description_en,
              handleChange: onHandleChange,
              required: true,
              className: "mt-1 block w-full md:w-1/2"
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.description_en,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mb-5",
            children: [/* @__PURE__ */ jsx(InputLabel, {
              for: "description_de",
              value: __("German Description")
            }), /* @__PURE__ */ jsx(Textarea, {
              name: "description_de",
              value: data.description_de,
              handleChange: onHandleChange,
              required: true,
              className: "mt-1 block w-full md:w-1/2"
            }), /* @__PURE__ */ jsx(InputError, {
              message: errors.description_de,
              className: "mt-2"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex justify-between items-center mt-2",
            children: /* @__PURE__ */ jsx(PrimaryButton, {
              processing: processing || spinner,
              children: video.id === null ? __("Save Video") : __("Update Video")
            })
          }), spinner && /* @__PURE__ */ jsx("div", {
            className: "my-3",
            children: /* @__PURE__ */ jsx(Spinner, {})
          }), progress && /* @__PURE__ */ jsxs("progress", {
            className: "mt-5",
            value: progress.percentage,
            max: "100",
            children: [progress.percentage, "%"]
          })]
        })]
      })]
    })]
  });
}
export {
  UploadVideo as default
};
