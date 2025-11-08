import { useState, useRef, useEffect } from "react";
import { A as Authenticated } from "./AuthenticatedLayout.b5843aff.mjs";
import VideosLoop from "./VideosLoop.3f1be340.mjs";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { BsTagFill, BsFillTagsFill, BsShare, BsHeartFill, BsHeart } from "react-icons/bs/index.js";
import { FcUnlock, FcEmptyFilter } from "react-icons/fc/index.js";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { toast } from "react-toastify";
import { MdGeneratingTokens, MdVideoLibrary } from "react-icons/md/index.js";
import axios from "axios";
import { FaGrinStars } from "react-icons/fa/index.js";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import "lodash.debounce";
import { M as Modal } from "./Modal.c4c8f017.mjs";
import ShareLink from "./ShareLink.542efa58.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import "./TextInput.7d39776a.mjs";
import SubscribePopup from "./SubscribePopup.6080bc24.mjs";
import { I as InputError } from "./InputError.45933222.mjs";
import { T as Textarea } from "./Textarea.d2e6a2e3.mjs";
import { Inertia } from "@inertiajs/inertia";
import Plyr from "plyr-react";
import { a as jsx, j as jsxs, F as Fragment } from "../app.mjs";
import "./Front.602cce17.mjs";
import "react-icons/ai";
import "react-icons/ri/index.js";
import "react-icons/bi/index.js";
import "antd";
import "@headlessui/react";
import "react-icons/rx/index.js";
import "react-cookie-consent";
import "react-tooltip";
/* empty css                             */import "./SingleVideo.d5015c6c.mjs";
import "react-dom";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
import "react-nl2br";
import "react-icons/ai/index.js";
const plyr = "";
const VideoComponent = ({
  video,
  relatedvideos,
  url,
  inModal
}) => {
  var _a, _b, _c;
  useState();
  const [link, setLink] = useState(false);
  const [modal, setModal] = useState(false);
  useState(false);
  const [favourite, setFavourite] = useState(video.isUserFavorite);
  const openSharigModal = (e, link2) => {
    e.preventDefault();
    setLink(link2);
    setModal(true);
  };
  const addToFav = () => {
    setFavourite(true);
    axios.post(route("video.addToFavorite", {
      id: video.id
    }));
  };
  const removeFromFav = () => {
    setFavourite(false);
    axios.post(route("video.removeFromFavorite", {
      id: video.id
    }));
  };
  useRef(null);
  const videoSrc = {
    type: "video",
    autoplay: true,
    sources: [{
      src: video.videoUrl,
      type: "video/mp4",
      size: 720
    }, {
      src: (_a = video.videoUrl360p) != null ? _a : video.videoUrl,
      type: "video/mp4",
      size: 360
    }]
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Modal, {
      show: modal,
      onClose: (e) => setModal(false),
      children: link && /* @__PURE__ */ jsx(ShareLink, {
        link,
        inModal: true
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: `justify-center w-full ${inModal ? "p-3" : "p-0"}`,
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-start",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mr-5 flex flex-col items-center flex-shrink-0",
          children: /* @__PURE__ */ jsx(Link, {
            href: route("channel", {
              user: video.streamer.username
            }),
            children: /* @__PURE__ */ jsx("img", {
              src: video.streamer.profile_picture,
              className: "w-14 h-14 rounded-full"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h3", {
            className: "text-lg md:text-2xl font-light text-gray-600 dark:text-white",
            children: video.title
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center flex-wrap md:space-x-2 mt-1",
            children: [/* @__PURE__ */ jsxs(Link, {
              href: route("channel", {
                user: video.streamer.username
              }),
              className: "text-sm text-gray-600 mr-2  dark:text-white",
              children: ["@", video.streamer.username]
            }), (_b = video.selectedCategory) == null ? void 0 : _b.map((category, index) => /* @__PURE__ */ jsxs(Link, {
              href: route("videos.browse", {
                videocategory: category.value,
                slug: `-${category.label}`
              }),
              className: "text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm",
              children: [/* @__PURE__ */ jsx(BsTagFill, {
                className: "w-3"
              }), /* @__PURE__ */ jsx("span", {
                children: category.label
              })]
            })), /* @__PURE__ */ jsx(BsFillTagsFill, {
              className: "w-3"
            }), /* @__PURE__ */ jsx("span", {
              children: (_c = video == null ? void 0 : video.tags) == null ? void 0 : _c.map((tag, index) => /* @__PURE__ */ jsxs(Link, {
                href: route("tag", {
                  id: tag.id
                }),
                className: "text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm",
                children: [" ", /* @__PURE__ */ jsxs("span", {
                  children: [tag.name, " ", index !== video.tags.length - 1 && ", "]
                })]
              }))
            }), video.free_for_subs === "yes" && video.price !== 0 && /* @__PURE__ */ jsxs("div", {
              className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600",
              children: [/* @__PURE__ */ jsx(FaGrinStars, {
                className: "w-4 h-4 mr-1"
              }), __("Free For Subscribers")]
            }), video.canBePlayed && /* @__PURE__ */ jsx("div", {
              className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600",
              children: /* @__PURE__ */ jsx("a", {
                href: video.videoUrl,
                download: true,
                children: __("Download")
              })
            }), /* @__PURE__ */ jsx("div", {
              className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600",
              children: /* @__PURE__ */ jsxs("span", {
                children: [" ", __("Duration "), " : ", video.duration.minute]
              })
            }), /* @__PURE__ */ jsx("div", {
              className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600",
              children: /* @__PURE__ */ jsxs("span", {
                children: [" ", __("Resolution "), " : ", video.duration.resolution]
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer",
              onClick: (e) => openSharigModal(e, document.URL),
              children: [/* @__PURE__ */ jsx(BsShare, {
                className: "w-4 h-4 mr-1"
              }), __("Share ")]
            }), /* @__PURE__ */ jsx("div", {
              className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600",
              children: /* @__PURE__ */ jsx(SubscribePopup, {
                user: video.streamer,
                userIsSubscribed: video.isCurrentSubscriber
              })
            }), favourite ? /* @__PURE__ */ jsx("div", {
              className: "mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer",
              onClick: (e) => removeFromFav(),
              children: /* @__PURE__ */ jsx(BsHeartFill, {
                style: {
                  "color": "red"
                },
                className: "w-4 h-4 mr-1"
              })
            }) : /* @__PURE__ */ jsx("div", {
              className: "mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer",
              onClick: (e) => addToFav(),
              children: /* @__PURE__ */ jsx(BsHeart, {
                style: {
                  "color": "red"
                },
                className: "w-4 h-4 mr-1"
              })
            }), !video.canBePlayed && /* @__PURE__ */ jsxs("div", {
              className: "mt-1 md:mt-0 inline-flex items-center text-sm bg-yellow-300 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer",
              onClick: (e) => Inertia.visit(route("video.unlock", {
                video: video.id
              })),
              children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
                className: "w-4 h-4 mr-1"
              }), __("Unlock with :tokens tokens", {
                tokens: video.price
              })]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-5",
        children: video.canBePlayed ? /* @__PURE__ */ jsx(Plyr, {
          source: videoSrc
        }) : /* @__PURE__ */ jsx("div", {
          className: "flex flex-col items-center  md:flex-row space-y-5 md:space-y-0 md:space-x-5 ",
          style: {
            "justify-content": "center"
          },
          children: /* @__PURE__ */ jsxs("div", {
            className: "relative",
            children: [/* @__PURE__ */ jsx("img", {
              src: video.videoGIF ? video.videoGIF : video.thumbnail,
              alt: "",
              className: "rounded-lg w-full"
            }), /* @__PURE__ */ jsx("div", {
              className: "absolute top-0 left-0 text-center bg-gray-700 w-full h-full bg-opacity-25 rounded-lg ",
              children: /* @__PURE__ */ jsxs("div", {
                className: "relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "w-full",
                  children: /* @__PURE__ */ jsx("div", {
                    className: "bg-white inline-flex bg-opacity-25 rounded-full p-2",
                    children: /* @__PURE__ */ jsx(FcUnlock, {
                      className: "w-12 h-12"
                    })
                  })
                }), /* @__PURE__ */ jsx("div", {
                  children: /* @__PURE__ */ jsxs(PrimaryButton, {
                    className: "h-12 mt-5 inline-flex",
                    onClick: (e) => Inertia.visit(route("video.unlock", {
                      video: video.id
                    })),
                    children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
                      className: "mr-2 w-6 h-6 md:w-8 md:h-8"
                    }), __("Unlock with :tokens tokens", {
                      tokens: video.price
                    })]
                  })
                })]
              })
            })]
          })
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-5",
        children: video.description ? video.description : ""
      })]
    })]
  });
};
const RelatedVideoComponent = ({
  relatedvideos
}) => {
  const [nextUrl, setNextUrl] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [videos, setVideos] = useState("");
  useEffect(() => {
    setVideos(relatedvideos.data);
    setNextUrl(relatedvideos.next_page_url);
  }, []);
  const handleLoadNewVideos = async (next_page_url) => {
    setSpinner(true);
    try {
      const res = await axios.get(next_page_url);
      setVideos([...videos, ...res.data.data]);
      setNextUrl(res.data.next_page_url);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsxs("div", {
      className: `flex justify-start items-center mt-20 mb-8`,
      children: [/* @__PURE__ */ jsx(MdVideoLibrary, {
        className: "text-pink-600 text-4xl mr-1"
      }), /* @__PURE__ */ jsx("h2", {
        className: "text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold",
        children: __("Related Videos")
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-5 mb-5",
      children: [relatedvideos.total === 0 && /* @__PURE__ */ jsxs("div", {
        className: "text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center",
        children: [/* @__PURE__ */ jsx(FcEmptyFilter, {
          className: "w-12 h-12 mr-2"
        }), __("No videos to show")]
      }), videos.length > 0 && /* @__PURE__ */ jsx(VideosLoop, {
        videos
      }), relatedvideos.last_page > 1 && /* @__PURE__ */ jsx(Fragment, {
        children: spinner ? /* @__PURE__ */ jsx("div", {
          className: "my-3",
          children: /* @__PURE__ */ jsx(Spinner, {})
        }) : /* @__PURE__ */ jsx(SecondaryButton, {
          className: "mt-2",
          processing: relatedvideos.next_page_url ? false : true,
          onClick: () => handleLoadNewVideos(nextUrl),
          children: __("Load More")
        })
      })]
    })]
  });
};
const RequestVideoComponent = ({
  video
}) => {
  const [spinner, setSpinner] = useState(false);
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset
  } = useForm({
    description: "",
    video_id: video.id
  });
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
  };
  const submit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    try {
      await axios({
        method: "post",
        url: route("request.video"),
        data,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(function(response) {
        toast.success(response.data.message);
      }).catch(function(response) {
        toast.error(response);
      });
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "mt-5 mb5",
      children: [/* @__PURE__ */ jsx("h3", {
        className: "text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold",
        children: __("Request Video")
      }), /* @__PURE__ */ jsxs("form", {
        onSubmit: submit,
        children: [/* @__PURE__ */ jsxs("div", {
          className: "mb-5",
          children: [/* @__PURE__ */ jsx(InputLabel, {
            for: "description",
            value: __("Description")
          }), /* @__PURE__ */ jsx(Textarea, {
            name: "description",
            value: data.description,
            handleChange: onHandleChange,
            required: true,
            className: "mt-1 block w-full"
          }), /* @__PURE__ */ jsx(InputError, {
            message: errors.title,
            className: "mt-2"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex items-center justify-end mt-4",
          children: spinner ? /* @__PURE__ */ jsx("div", {
            className: "my-3",
            children: /* @__PURE__ */ jsx(Spinner, {})
          }) : /* @__PURE__ */ jsx(PrimaryButton, {
            className: "ml-4",
            processing,
            children: __("Request Video")
          })
        })]
      })]
    })
  });
};
function SingleVideo({
  video,
  relatedvideos,
  url,
  inModal = false
}) {
  if (inModal) {
    return /* @__PURE__ */ jsx(VideoComponent, {
      video,
      relatedvideos,
      url,
      inModal: true
    });
  } else {
    return /* @__PURE__ */ jsxs(Authenticated, {
      children: [/* @__PURE__ */ jsx(Head, {
        title: video.title
      }), /* @__PURE__ */ jsx(VideoComponent, {
        video,
        relatedvideos,
        url,
        inModal: false
      }), /* @__PURE__ */ jsx(RelatedVideoComponent, {
        relatedvideos
      }), /* @__PURE__ */ jsx(RequestVideoComponent, {
        video
      })]
    });
  }
}
export {
  SingleVideo as default
};
