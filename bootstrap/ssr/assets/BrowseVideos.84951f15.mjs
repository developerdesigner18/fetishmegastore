import { useState, useEffect, useRef } from "react";
import { F as Front } from "./Front.602cce17.mjs";
import { Head } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { FcEmptyFilter } from "react-icons/fc";
import { Inertia } from "@inertiajs/inertia";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import VideosLoop from "./VideosLoop.3f1be340.mjs";
import { M as Modal } from "./Modal.c4c8f017.mjs";
import SingleVideo from "./SingleVideo.d5015c6c.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import debounce from "lodash.debounce";
import { IoMdFunnel } from "react-icons/io";
import { Pagination } from "antd";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "react-icons/md/index.js";
import "react-icons/bs/index.js";
import "@headlessui/react";
import "react-toastify";
import "axios";
import "react-icons/fa/index.js";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "react-tooltip";
/* empty css                             */import "react-dom";
import "./AuthenticatedLayout.b5843aff.mjs";
import "react-icons/fc/index.js";
import "./PrimaryButton.9fb48a50.mjs";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function BrowseVideos({
  userrequest,
  randomvideos,
  videos,
  category,
  categories,
  exploreImage,
  tags,
  models,
  blocks,
  headTitle
}) {
  const [sort, setSort] = useState(userrequest["sort"] ? userrequest["sort"] : "Latest");
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(userrequest["page"] ? userrequest["page"] : 1);
  debounce((e) => {
    console.log(`debounced term updated to: ${e.target.value}`);
    if (e.target.value.length > 2) {
      setLoading(true);
      Inertia.reload({
        data: {
          keyword: e.target.value,
          sortBy: sort
        },
        only: ["videos"],
        onFinish: () => setLoading(false)
      });
    } else {
      Inertia.reload({
        data: {
          sortBy: sort,
          keyword: ""
        },
        only: ["videos"],
        onFinish: () => setLoading(false)
      });
    }
  }, 500);
  const doRequest = () => {
    console.log(currentPage, page);
    if (currentPage != page) {
      setCurrentPage(page);
      Inertia.visit(route("videos.browse", {
        search,
        sort,
        selectedCategories,
        selectedTags,
        selectedModels,
        page
      }), {
        only: ["videos", "randomvideos"],
        preserveState: true,
        onBefore: () => setLoading(true),
        onFinish: () => setLoading(false)
      });
    }
  };
  useEffect(doRequest, [page]);
  const onChangePaginate = (pageNumber) => {
    console.log("Page: ", pageNumber);
    setPage(pageNumber);
    videos.path + "?page=" + pageNumber;
  };
  const filters = useRef();
  const [selectedCategories, setSelectedCategories] = useState(userrequest["selectedCategories"]);
  const [selectedTags, setSelectedTags] = useState(userrequest["selectedTags"]);
  const [selectedModels, setSelectedModels] = useState(userrequest["selectedModels"]);
  const submit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setPage(1);
    Inertia.visit(route("videos.browse", {
      search,
      sort,
      selectedCategories,
      selectedTags,
      selectedModels
    }), {
      only: ["videos", "randomvideos"],
      preserveState: true,
      onBefore: () => setLoading(true),
      onFinish: () => setLoading(false)
    });
    hideFilters();
  };
  const handleCategories = (event) => {
    const {
      value,
      checked
    } = event.target;
    if (checked) {
      setSelectedCategories((current) => [...current, value]);
    } else {
      setSelectedCategories((current) => current.filter((v) => v !== value));
    }
  };
  const handleTags = (event) => {
    const {
      value,
      checked
    } = event.target;
    if (checked) {
      setSelectedTags((current) => [...current, value]);
    } else {
      setSelectedTags((current) => current.filter((v) => v !== value));
    }
  };
  const handleModels = (event) => {
    const {
      value,
      checked
    } = event.target;
    if (checked) {
      console.log("event", checked);
      setSelectedModels((current) => [...current, value]);
    } else {
      setSelectedModels((current) => current.filter((v) => v !== value));
    }
  };
  const showFilters = (e) => {
    e.preventDefault();
    const shown = "fixed inset-0 z-[9999] pt-5 px-2 overflow-scroll h-screen bg-white dark:bg-black  block w-2/3 flex-shrink-0 mr-5";
    filters.current.className = shown;
  };
  const hideFilters = (e) => {
    e == null ? void 0 : e.preventDefault();
    const hidden = "hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5";
    console.log(`hiding filters ${hidden}`);
    filters.current.className = hidden;
  };
  return /* @__PURE__ */ jsxs(Front, {
    containerClass: "w-full",
    extraHeader: true,
    extraHeaderTitle: __("Browse Videos"),
    extraHeaderImage: exploreImage,
    extraHeaderText: "",
    extraImageHeight: "h-14",
    children: [/* @__PURE__ */ jsx(Head, {
      title: `${category !== null ? __(":categoryName Videos", {
        categoryName: category.category
      }) : headTitle}`
    }), /* @__PURE__ */ jsx(Modal, {
      show: modal,
      onClose: (e) => setModal(false),
      children: playVideo && /* @__PURE__ */ jsx(SingleVideo, {
        video: playVideo,
        inModal: true
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex w-full -mt-16",
      children: [/* @__PURE__ */ jsx("form", {
        onSubmit: submit,
        children: /* @__PURE__ */ jsxs("div", {
          ref: filters,
          className: "hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900 dark:text-white shadow rounded-t-lg",
            children: __("Search")
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3",
            children: /* @__PURE__ */ jsx(TextInput, {
              className: "w-full",
              name: "search",
              value: search,
              handleChange: (e) => setSearch(e.target.value),
              placeholder: __("Search Video")
            })
          }), /* @__PURE__ */ jsx("h3", {
            className: "mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900 dark:text-white shadow rounded-t-lg",
            children: __("Sort By")
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3",
            children: [/* @__PURE__ */ jsxs("label", {
              className: "flex items-center text-gray-600 dark:text-white cursor-pointer	",
              children: [/* @__PURE__ */ jsx("input", {
                type: "radio",
                name: "sort",
                value: "Most",
                checked: sort === "Most",
                className: "mr-2",
                onChange: (e) => setSort(e.target.value)
              }), __("Most Viewed")]
            }), /* @__PURE__ */ jsxs("label", {
              className: "flex items-center text-gray-600 dark:text-white cursor-pointer	",
              children: [/* @__PURE__ */ jsx("input", {
                type: "radio",
                name: "sort",
                value: "Recently",
                checked: sort === "Recently",
                className: "mr-2",
                onChange: (e) => setSort(e.target.value)
              }), __("Newest Uploaded")]
            }), /* @__PURE__ */ jsxs("label", {
              className: "flex items-center text-gray-600 dark:text-white cursor-pointer	",
              children: [/* @__PURE__ */ jsx("input", {
                type: "radio",
                name: "sort",
                checked: sort === "Older",
                value: "Older",
                className: "mr-2",
                onChange: (e) => setSort(e.target.value)
              }), __("Older Videos")]
            }), /* @__PURE__ */ jsxs("label", {
              className: "flex items-center text-gray-600 dark:text-white cursor-pointer	",
              children: [/* @__PURE__ */ jsx("input", {
                type: "radio",
                name: "sort",
                checked: sort === "Highest",
                value: "Highest",
                className: "mr-2",
                onChange: (e) => setSort(e.target.value)
              }), __("Highest Price")]
            }), /* @__PURE__ */ jsxs("label", {
              className: "flex items-center text-gray-600 dark:text-white cursor-pointer	",
              children: [/* @__PURE__ */ jsx("input", {
                type: "radio",
                name: "sort",
                checked: sort === "Lowest",
                value: "Lowest",
                className: "mr-2",
                onChange: (e) => setSort(e.target.value)
              }), __("Lowest Price")]
            })]
          }), /* @__PURE__ */ jsx("h3", {
            className: "mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900  dark:text-white shadow rounded-t-lg",
            children: __("Category")
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3 overflow-y-auto h-48",
            children: categories.map((cat) => {
              return /* @__PURE__ */ jsxs("label", {
                className: "flex items-center text-gray-600 dark:text-white cursor-pointer	",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "checkbox",
                  name: "categories[]",
                  className: "mr-2",
                  value: cat.id,
                  onChange: handleCategories,
                  checked: selectedCategories.includes(cat.id.toString())
                }), cat.category]
              }, `catFilter-${cat.id}`);
            })
          }), /* @__PURE__ */ jsx("h3", {
            className: "mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900  dark:text-white shadow rounded-t-lg",
            children: __("Tags")
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3 overflow-y-auto h-48",
            children: tags.map((tag) => {
              return /* @__PURE__ */ jsxs("label", {
                className: "flex items-center text-gray-600 dark:text-white cursor-pointer	",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "checkbox",
                  name: "tags[]",
                  className: "mr-2",
                  value: tag.name,
                  onChange: handleTags,
                  checked: selectedTags.includes(tag.name.toString())
                }), tag.name]
              }, `tagFilter-${tag.id}`);
            })
          }), /* @__PURE__ */ jsx("h3", {
            className: "mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900  dark:text-white shadow rounded-t-lg",
            children: __("Models")
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3 overflow-y-auto h-48",
            children: models.map((model) => {
              return /* @__PURE__ */ jsxs("label", {
                className: "flex items-center text-gray-600 dark:text-white cursor-pointer	",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "checkbox",
                  name: "models[]",
                  className: "mr-2",
                  value: model.id,
                  onChange: handleModels,
                  checked: selectedModels.includes(model.id.toString())
                }), model.name]
              }, `modelFilter-${model.id}`);
            })
          }), isLoading ? /* @__PURE__ */ jsx("div", {
            className: "my-3",
            children: /* @__PURE__ */ jsx(Spinner, {})
          }) : /* @__PURE__ */ jsx("button", {
            className: "mt-5 bg-indigo-500 dark:bg-zinc-800 font-semibold text-white rounded-lg px-2 py-1.5 block w-full",
            children: __("Apply Filters")
          }), /* @__PURE__ */ jsx(SecondaryButton, {
            className: "mt-2",
            onClick: (e) => Inertia.visit(route("videos.browse")),
            children: __("Reset")
          }), /* @__PURE__ */ jsx("div", {
            className: "lg:hidden text-center border-t border-t-gray-300 dark:border-gray-900 py-5",
            children: /* @__PURE__ */ jsx(SecondaryButton, {
              className: "",
              onClick: (e) => hideFilters(e),
              children: __("Close")
            })
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex-grow",
        children: [/* @__PURE__ */ jsxs("button", {
          onClick: (e) => showFilters(e),
          className: "mb-7 px-3 -mt-1 py-1.5 bg-indigo-500 text-white rounded-lg lg:hidden flex items-center justify-end",
          children: [/* @__PURE__ */ jsx(IoMdFunnel, {
            className: "mr-1"
          }), __("Show Filters")]
        }), videos.total === 0 && /* @__PURE__ */ jsxs("div", {
          className: "text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center",
          children: [/* @__PURE__ */ jsx(FcEmptyFilter, {
            className: "w-12 h-12 mr-2"
          }), __("No videos to show")]
        }), videos.current_page == 1 && randomvideos.total > 0 && /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h2", {
            class: "text-indigo-700 text-2xl font-bold dark:text-white",
            children: __("Random Videos")
          }), /* @__PURE__ */ jsx(VideosLoop, {
            videos: randomvideos.data,
            blocks
          }), /* @__PURE__ */ jsx("h2", {
            class: "text-indigo-700 text-2xl font-bold dark:text-white",
            children: __("Filtered Videos")
          })]
        }), /* @__PURE__ */ jsx(VideosLoop, {
          videos: videos.data,
          blocks
        }), videos.last_page > 1 && /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex text-gray-600 mt-10 mb-5 text-sm",
            children: __("Page: :pageNumber of :lastPage", {
              pageNumber: videos.current_page,
              lastPage: videos.last_page
            })
          }), /* @__PURE__ */ jsx(Pagination, {
            total: videos.last_page * 10,
            defaultCurrent: videos.current_page,
            onChange: onChangePaginate,
            showSizeChanger: false
          })]
        })]
      })]
    })]
  });
}
export {
  BrowseVideos as default
};
