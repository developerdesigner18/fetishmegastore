import { AiFillTags, AiOutlineMenuUnfold } from "react-icons/ai";
import { RiLoginBoxLine } from "react-icons/ri/index.js";
import { BiUserPlus, BiUserCircle } from "react-icons/bi/index.js";
import { MdOutlineCategory, MdOutlineVideoLibrary, MdOutlineGirl, MdGeneratingTokens, MdDarkMode } from "react-icons/md/index.js";
import { BsSlashSquare, BsFillSunFill } from "react-icons/bs/index.js";
import { Link, usePage } from "@inertiajs/inertia-react";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { Select } from "antd";
import React, { useState, useContext, Fragment as Fragment$1, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { a as jsx, j as jsxs, F as Fragment } from "../app.mjs";
import { M as Modal } from "./Modal.c4c8f017.mjs";
import { toast, ToastContainer } from "react-toastify";
import debounce from "lodash.debounce";
import axios from "axios";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { FaChromecast, FaBlog } from "react-icons/fa/index.js";
import { RxCaretDown } from "react-icons/rx/index.js";
import CookieConsent from "react-cookie-consent";
const DropDownContext = React.createContext();
const Dropdown = ({
  children
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };
  return /* @__PURE__ */ jsx(DropDownContext.Provider, {
    value: {
      open,
      setOpen,
      toggleOpen
    },
    children: /* @__PURE__ */ jsx("div", {
      className: "relative",
      children
    })
  });
};
const Trigger = ({
  children
}) => {
  const {
    open,
    setOpen,
    toggleOpen
  } = useContext(DropDownContext);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("div", {
      onClick: toggleOpen,
      children
    }), open && /* @__PURE__ */ jsx("div", {
      className: "fixed inset-0 z-40",
      onClick: () => setOpen(false)
    })]
  });
};
const Content = ({
  align = "right",
  width = "48",
  contentClasses = "py-1 bg-white dark:bg-gray-700",
  children
}) => {
  const {
    open,
    setOpen
  } = useContext(DropDownContext);
  let alignmentClasses = "origin-top";
  if (align === "left") {
    alignmentClasses = "origin-top-left left-0";
  } else if (align === "right") {
    alignmentClasses = "origin-top-right right-0";
  }
  let widthClasses = "";
  if (width === "48") {
    widthClasses = "w-48";
  }
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(Transition, {
      as: Fragment$1,
      show: open,
      enter: "transition ease-out duration-200",
      enterFrom: "transform opacity-0 scale-95",
      enterTo: "transform opacity-100 scale-100",
      leave: "transition ease-in duration-75",
      leaveFrom: "transform opacity-100 scale-100",
      leaveTo: "transform opacity-0 scale-95",
      children: /* @__PURE__ */ jsx("div", {
        className: `absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`,
        onClick: () => setOpen(false),
        children: /* @__PURE__ */ jsx("div", {
          className: `rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses,
          children
        })
      })
    })
  });
};
const DropdownLink = ({
  href,
  method,
  as,
  children
}) => {
  return /* @__PURE__ */ jsx(Link, {
    href,
    method,
    as,
    className: "block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out",
    children
  });
};
Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
const Dropdown$1 = Dropdown;
const ReactToastify = "";
function TopNavi({
  children
}) {
  const {
    logo,
    logo_day,
    auth,
    pages,
    current_locale
  } = usePage().props;
  const [isDarkMode, setIsDarkMode] = useState("no");
  const [showSearch, setShowSearch] = useState(false);
  const [results, setResults] = useState([]);
  const {
    flash
  } = usePage().props;
  let selectedLang;
  switch (current_locale) {
    case "en":
      selectedLang = "English";
      break;
    case "de":
      selectedLang = "German";
      break;
    case "it":
      selectedLang = "Italian";
      break;
    case "fr":
      selectedLang = "French";
      break;
    case "es":
      selectedLang = "Spainish";
      break;
    default:
      selectedLang = "English";
      break;
  }
  useEffect(() => {
    if (flash == null ? void 0 : flash.message) {
      toast(flash.message);
    }
  }, [flash]);
  useEffect(() => {
    if (localStorage.getItem("is-dark-mode")) {
      setIsDarkMode(localStorage.getItem("is-dark-mode"));
    }
    if (isDarkMode == "yes") {
      document.body.classList.add("dark");
      document.body.classList.add("bg-black");
      document.body.classList.remove("bg-slate-50");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.remove("bg-black");
      document.body.classList.add("bg-slate-50");
    }
  }, [isDarkMode]);
  const switchDarkMode = () => {
    if (isDarkMode == "no") {
      document.body.classList.add("dark");
      localStorage.setItem("is-dark-mode", "yes");
      setIsDarkMode("yes");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.remove("bg-black");
      localStorage.setItem("is-dark-mode", "no");
      setIsDarkMode("no");
    }
  };
  const updateTerm = debounce((e) => {
    console.log(`debounced term updated to: ${e.target.value}`);
    if (e.target.value.length > 2) {
      axios.get(route("channel.search"), {
        params: {
          term: e.target.value
        }
      }).then((resp) => setResults(resp.data)).catch((Error) => {
        var _a, _b;
        return toast((_b = (_a = Error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message);
      });
    } else {
      setResults([]);
    }
  }, 500);
  const handleChangeLang = (value) => {
    axios.post(route("change.lang", {
      lang: value
    })).then(() => window.location.reload(true)).catch((Error) => {
      var _a;
      toast.error((_a = Error.response.data) == null ? void 0 : _a.message);
    });
    console.log(`selected lang ${value}`);
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "fixed inset-x-0 z-10 bg-violet-800 border-b-2 border-violet-800 dark:bg-zinc-900 dark:border-b-2 dark:border-zinc-800",
    children: [/* @__PURE__ */ jsx(Modal, {
      show: showSearch,
      closeable: true,
      onClose: (e) => setShowSearch(false),
      children: /* @__PURE__ */ jsxs("div", {
        className: "p-3",
        children: [/* @__PURE__ */ jsx(TextInput, {
          className: "w-full mb-5",
          handleChange: (e) => updateTerm(e),
          type: "text",
          placeholder: __("Search Channels"),
          isFocused: true
        }), results.length === 0 && /* @__PURE__ */ jsx("div", {
          className: "dark:text-white",
          children: __("No results")
        }), results.map((sr) => {
          return /* @__PURE__ */ jsxs("div", {
            className: "flex items-center mt-2 space-x-2",
            children: [/* @__PURE__ */ jsx("div", {
              children: /* @__PURE__ */ jsx(Link, {
                href: route("channel", {
                  user: sr.username
                }),
                children: /* @__PURE__ */ jsx("img", {
                  src: sr.profile_picture,
                  alt: "",
                  className: "rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                })
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "grow",
              children: [/* @__PURE__ */ jsx(Link, {
                className: "block text-gray-600 dark:text-gray-300 font-semibold mt-1 ml-1",
                href: route("channel", {
                  user: sr.username
                }),
                children: sr.name
              }), /* @__PURE__ */ jsxs(Link, {
                className: "block text-sky-500 hover:text-sky-600 font-semibold mt-1 ml-1",
                href: route("channel", {
                  user: sr.username
                }),
                children: ["@", sr.username]
              })]
            })]
          }, `sr-${sr.id}`);
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "h-[58px] flex justify-between items-center px-2 py-4 max-w-7xl mx-auto",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex items-center",
        children: /* @__PURE__ */ jsx(Link, {
          href: route("home"),
          children: /* @__PURE__ */ jsx("img", {
            src: logo,
            alt: "logo",
            className: "h-8 mr-1 mt-1"
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center",
        children: [/* @__PURE__ */ jsxs(Link, {
          href: route("home"),
          className: "hidden md:inline-flex items-center text-white text-lg hover:text-indigo-200 font-semibold",
          children: [/* @__PURE__ */ jsx(BsSlashSquare, {
            className: "mr-1"
          }), __("Home")]
        }), /* @__PURE__ */ jsxs(Link, {
          href: route("categories.browse"),
          className: "ml-5 hidden md:inline-flex items-center text-white text-lg hover:text-indigo-200 font-semibold",
          children: [/* @__PURE__ */ jsx("span", {
            children: /* @__PURE__ */ jsx(MdOutlineCategory, {
              className: "mr-1"
            })
          }), /* @__PURE__ */ jsx("span", {
            children: __("Categories")
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          href: route("videos.browse"),
          className: "ml-5 hidden md:inline-flex items-center text-white text-lg hover:text-indigo-200 font-semibold",
          children: [/* @__PURE__ */ jsx("span", {
            children: /* @__PURE__ */ jsx(MdOutlineVideoLibrary, {
              className: "mr-1"
            })
          }), /* @__PURE__ */ jsx("span", {
            children: __("Videos")
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          href: route("model.browse"),
          className: "ml-5 hidden md:inline-flex items-center text-white text-lg hover:text-indigo-200 font-semibold",
          children: [/* @__PURE__ */ jsx("span", {
            children: /* @__PURE__ */ jsx(MdOutlineGirl, {
              className: "mr-1"
            })
          }), /* @__PURE__ */ jsx("span", {
            children: __("Models")
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          href: route("channels.browse"),
          className: "ml-5 hidden md:inline-flex items-center text-white text-lg hover:text-indigo-200 font-semibold",
          children: [/* @__PURE__ */ jsx("span", {
            children: /* @__PURE__ */ jsx(FaChromecast, {
              className: "mr-1"
            })
          }), /* @__PURE__ */ jsx("span", {
            children: __("Channels")
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          href: route("tag.browse"),
          className: "ml-5 hidden md:inline-flex items-center text-white text-lg hover:text-indigo-200 font-semibold",
          children: [/* @__PURE__ */ jsx("span", {
            children: /* @__PURE__ */ jsx(AiFillTags, {
              className: "mr-1"
            })
          }), /* @__PURE__ */ jsx("span", {
            children: __("Tags")
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          href: route("web.blogs.index"),
          className: "ml-5 hidden md:inline-flex items-center text-white text-lg hover:text-indigo-200 font-semibold",
          children: [/* @__PURE__ */ jsx("span", {
            children: /* @__PURE__ */ jsx(FaBlog, {
              className: "mr-1"
            })
          }), /* @__PURE__ */ jsx("span", {
            children: __("Blogs")
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          href: route("token.packages"),
          className: "ml-5 hidden md:inline-flex items-center text-white text-lg hover:text-indigo-200 font-semibold",
          children: [/* @__PURE__ */ jsx("span", {
            children: /* @__PURE__ */ jsx(MdGeneratingTokens, {
              className: "h-6 w-6 mr-1"
            })
          }), /* @__PURE__ */ jsx("span", {
            children: __("Token Packs")
          })]
        }), /* @__PURE__ */ jsx(Select, {
          defaultValue: selectedLang,
          style: {
            width: 100
          },
          className: "ml-5 hidden md:inline-flex items-center text-white text-lg hover:text-indigo-200 font-semibold",
          onChange: handleChangeLang,
          options: [{
            value: "en",
            label: __("English")
          }, {
            value: "de",
            label: __("German")
          }, {
            value: "it",
            label: __("Italian")
          }, {
            value: "fr",
            label: __("French")
          }, {
            value: "es",
            label: __("Spainish")
          }]
        }), /* @__PURE__ */ jsx(Select, {
          defaultValue: selectedLang,
          style: {
            width: 80
          },
          className: "md:hidden mr-1 w-6 h-6  text-white cursor-pointer hover:bg-indigo-900 hover:text-white hover:rounded ",
          onChange: handleChangeLang,
          options: [{
            value: "en",
            label: __("English")
          }, {
            value: "de",
            label: __("German")
          }, {
            value: "it",
            label: __("Italian")
          }, {
            value: "fr",
            label: __("French")
          }, {
            value: "es",
            label: __("Spainish")
          }]
        }), !auth.user ? /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx(Link, {
            className: "ml-4 hidden md:block text-white hover:text-indigo-200 border border-white hover:border-indigo-200 p-1 rounded-lg px-4 font-semibold",
            href: route("login"),
            children: __("Login")
          }), /* @__PURE__ */ jsx(Link, {
            href: route("signup"),
            className: "hidden md:block bg-violet-600 p-1.5 rounded-lg border-violet-600 font-semibold px-4 text-zinc-200 ml-2 hover:bg-violet-500",
            children: __("Signup")
          }), /* @__PURE__ */ jsx(Link, {
            href: route("login"),
            className: "md:hidden",
            children: /* @__PURE__ */ jsx(RiLoginBoxLine, {
              className: "md:hidden mr-1 w-6 h-6  text-white cursor-pointer hover:bg-indigo-900 hover:text-white hover:rounded"
            })
          }), /* @__PURE__ */ jsx(Link, {
            href: route("signup"),
            children: /* @__PURE__ */ jsx(BiUserPlus, {
              className: "md:hidden mr-1 w-6 h-6  text-white cursor-pointer hover:bg-indigo-900 hover:text-white hover:rounded "
            })
          })]
        }) : /* @__PURE__ */ jsx(Fragment, {
          children: /* @__PURE__ */ jsxs(Dropdown$1, {
            children: [/* @__PURE__ */ jsx(Dropdown$1.Trigger, {
              children: /* @__PURE__ */ jsxs("div", {
                className: "relative inline-flex mt-1 ml-2",
                children: [/* @__PURE__ */ jsx(BiUserCircle, {
                  className: "mr-1 w-6 h-6 text-white cursor-pointer hover:text-indigo-400"
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -left-1",
                  children: auth.unreadNotifications
                }), /* @__PURE__ */ jsxs("div", {
                  className: "hidden md:inline-flex items-center cursor-pointer text-white font-semibold hover:text-indigo-400 pt-0.5",
                  children: [__(auth.user.firstName), /* @__PURE__ */ jsx(RxCaretDown, {})]
                })]
              })
            }), /* @__PURE__ */ jsxs(Dropdown$1.Content, {
              children: [/* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: `${auth.user.is_streamer === "yes" ? route("payout.withdraw") : route("profile.myTokens")}`,
                children: /* @__PURE__ */ jsxs("span", {
                  className: "flex items-center bg-green-100 text-green-700 text-xs font-bold justify-center py-1 rounded-lg",
                  children: [/* @__PURE__ */ jsx(MdGeneratingTokens, {
                    className: "h-5 w-5"
                  }), auth.user.tokens]
                })
              }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("channel", {
                  user: auth.user.username
                }),
                children: __("My Channel")
              }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("channel.settings"),
                children: __("Channel Settings")
              }), /* @__PURE__ */ jsxs(Dropdown$1.Link, {
                href: route("notifications.inbox"),
                children: [__("Notifications"), /* @__PURE__ */ jsx("span", {
                  className: "bg-red-100 text-red-500 text-xs font-medium ml-2 px-1.5 py-0.5 rounded-full dark:bg-red-500 dark:text-red-100",
                  children: __(":unreadNotificationsCount new", {
                    unreadNotificationsCount: auth.unreadNotifications
                  })
                })]
              }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("payout.withdraw"),
                children: __("Withdraw")
              }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("membership.set-tiers"),
                children: __("Membership Tiers")
              }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("videos.list"),
                children: __("Upload Videos")
              }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("videos.ordered"),
                children: __("My Videos")
              }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("channel.followers", {
                  user: auth.user.username
                }),
                children: __("My Followers")
              }), auth.user.is_streamer === "yes" && /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("mySubscribers"),
                children: __("My Subscribers")
              }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("profile.followings"),
                children: __("My Followings")
              }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("mySubscriptions"),
                children: __("My Subscriptions")
              }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("myFavorites"),
                children: __("My Favorites")
              }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("profile.edit"),
                children: __("My Account")
              }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
                href: route("logout"),
                method: "post",
                as: "button",
                children: __("Logout")
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs(Dropdown$1, {
          children: [/* @__PURE__ */ jsx(Dropdown$1.Trigger, {
            children: /* @__PURE__ */ jsx(AiOutlineMenuUnfold, {
              className: `ml-2 w-6 h-6 text-white cursor-pointer hover:text-indigo-200 md:hidden`
            })
          }), /* @__PURE__ */ jsxs(Dropdown$1.Content, {
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex pl-4 pt-2 text-gray-500 dark:text-white font-bold",
              children: __("Menu")
            }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("home"),
              children: __("Home")
            }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("categories.browse"),
              children: __("Categories")
            }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("token.packages"),
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between",
                children: [/* @__PURE__ */ jsx("div", {
                  children: __("Get Tokens")
                }), /* @__PURE__ */ jsx("div", {
                  children: /* @__PURE__ */ jsx(MdGeneratingTokens, {
                    className: "h-6 w-6"
                  })
                })]
              })
            }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("videos.browse"),
              children: __("Browse Videos")
            }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("channels.browse"),
              children: __("Discover Channels")
            }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("model.browse"),
              children: __("Browse Model")
            }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("tag.browse"),
              children: __("Tags")
            }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("web.blogs.index"),
              children: __("Blogs")
            }), /* @__PURE__ */ jsx("div", {
              className: "flex pl-4 pt-2 text-gray-500 dark:text-white font-bold",
              children: __("General")
            }), /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("contact.form"),
              children: __("Get In Touch")
            }), pages.map((p) => /* @__PURE__ */ jsx(Dropdown$1.Link, {
              href: route("page", {
                page: p.page_slug
              }),
              children: p.page_title
            }, `page-${p.id}`))]
          })]
        }), isDarkMode == "no" ? /* @__PURE__ */ jsx(MdDarkMode, {
          className: "ml-2 w-6 h-6  text-white hover:text-indigo-200 cursor-pointer",
          onClick: switchDarkMode
        }) : /* @__PURE__ */ jsx(BsFillSunFill, {
          className: "ml-2 w-6 h-6  text-white cursor-pointer hover:text-orange-400 hover:rounded ",
          onClick: switchDarkMode
        })]
      })]
    })]
  });
}
function HomepageHeader() {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("div", {
      className: "homepage-header-bg dark:bg-none",
      children: /* @__PURE__ */ jsxs("div", {
        className: "max-w-7xl mx-auto pt-10 lg:flex items-center justify-between",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "w-full homepage-text-container px-4 lg:w-96",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "font-extrabold text-5xl lg:text-6xl heading-gradient px-4",
            children: __("Live Streaming at your fingertips")
          }), /* @__PURE__ */ jsx("h2", {
            className: "text-3xl mt-10  dark:text-zinc-200 px-4",
            children: __("Stream & watch live video streams directly from your browser")
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "max-w-3xl",
          children: /* @__PURE__ */ jsx("img", {
            src: "/images/homepage-icon.png",
            alt: ""
          })
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "bg-slate-50 dark:bg-black",
      children: [/* @__PURE__ */ jsx("div", {
        className: "w-full bg-slate-100 dark:bg-black py-10",
        children: /* @__PURE__ */ jsx("div", {
          className: "max-w-7xl mx-auto px-4",
          children: /* @__PURE__ */ jsx("h2", {
            className: "text-indigo-900  dark:text-zinc-200 text-4xl text-center font-bold",
            children: __("Learn why Creators love our platform")
          })
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto",
        children: /* @__PURE__ */ jsxs("div", {
          className: "md:flex md:flex-wrap",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "lg:flex md:w-1/2 items-center py-10 px-5",
            children: [/* @__PURE__ */ jsx("div", {
              className: "mr-5 w-48 flex-shrink-0",
              children: /* @__PURE__ */ jsx("img", {
                src: "/images/streaming-service.png",
                alt: "live streaming",
                className: "w-full"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-indigo-900 dark:text-zinc-200 text-4xl font-semibold mt-5 lg:mt-0",
                children: __("Live Streaming")
              }), /* @__PURE__ */ jsx("h4", {
                className: "text-indigo-900 dark:text-zinc-100 text-xl mt-5",
                children: __("Stream directly from your browser. No additional complicated software to install. All you need is your computer & a camera.")
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "lg:flex md:w-1/2 items-center py-10 px-5",
            children: [/* @__PURE__ */ jsx("div", {
              className: "mr-5 w-48 flex-shrink-0",
              children: /* @__PURE__ */ jsx("img", {
                src: "/images/chat-service.png",
                alt: "chat",
                className: "w-full"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-indigo-900 dark:text-zinc-200 text-4xl font-semibold mt-5 lg:mt-0",
                children: __("Live Chat")
              }), /* @__PURE__ */ jsx("h4", {
                className: "text-indigo-900 dark:text-zinc-100 text-xl mt-5",
                children: __("What would be a live stream without interaction? Your audience can interact with you and each other.")
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "lg:flex md:w-1/2 items-center py-10 px-5",
            children: [/* @__PURE__ */ jsx("div", {
              className: "mr-5 md:w-48 flex-shrink-0 w-40",
              children: /* @__PURE__ */ jsx("img", {
                src: "/images/sub-service.png",
                alt: "goals",
                className: "w-full"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-indigo-900 dark:text-zinc-200 text-4xl font-semibold mt-5 lg:mt-0",
                children: __("Subscription Tiers")
              }), /* @__PURE__ */ jsx("h4", {
                className: "text-indigo-900 dark:text-zinc-100 text-xl mt-5",
                children: __("Get recurring revenue from your fan base via membership tiers. You can offer 1, 6 and 12 months with discounts option.")
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "lg:flex md:w-1/2 items-center py-10 px-5",
            children: [/* @__PURE__ */ jsx("div", {
              className: "mr-5 w-48 flex-shrink-0",
              children: /* @__PURE__ */ jsx("img", {
                src: "/images/tips-service.png",
                alt: "tips",
                className: "w-full"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-indigo-900 dark:text-zinc-200 text-4xl font-semibold",
                children: __("Tips")
              }), /* @__PURE__ */ jsx("h4", {
                className: "text-indigo-900 dark:text-zinc-100 text-xl mt-5",
                children: __("Every creator has it's fans - the moment you get your first rewarding is an incredible appreciation sign for your hard work")
              })]
            })]
          })]
        })
      })]
    })]
  });
}
function Front({
  children,
  containerClass = "",
  headerShow = false,
  extraHeader = false,
  extraHeaderTitle = "",
  extraHeaderText = "",
  extraHeaderImage = "",
  extraImageHeight = ""
}) {
  const {
    seo_title,
    pages
  } = usePage().props;
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col min-h-screen",
    children: [/* @__PURE__ */ jsx(ToastContainer, {
      theme: "dark"
    }), /* @__PURE__ */ jsx(TopNavi, {}), headerShow && /* @__PURE__ */ jsx(HomepageHeader, {}), extraHeader && /* @__PURE__ */ jsx("div", {
      className: "w-full mt-[60px] dark:bg-black bg-light-violet border-2 dark:border-zinc-900 pl-3 lg:pl-5",
      children: /* @__PURE__ */ jsx("div", {
        className: "bg-light-violet dark:bg-black  pt-2",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex max-w-7xl mx-auto items-center flex-wrap",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("img", {
              src: extraHeaderImage,
              alt: "",
              className: extraImageHeight
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "ml-3",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "text-indigo-700 text-2xl font-bold dark:text-white",
              children: extraHeaderTitle
            }), /* @__PURE__ */ jsx("div", {
              className: "hidden lg:flex lg:items-center lg:space-x-3",
              children: extraHeaderText
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto flex-grow min-h-full px-3 w-full",
      children: /* @__PURE__ */ jsx("div", {
        className: "mt-[100px]",
        children
      })
    }), /* @__PURE__ */ jsx(CookieConsent, {
      children: __("This website uses cookies to enhance the user experience.")
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-10 w-full border-t dark:border-zinc-800 dark:bg-zinc-900 py-3 bg-slate-100",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center",
        children: [/* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsxs(Link, {
            className: "font-semibold text-sm dark:text-zinc-300",
            href: route("home"),
            children: ["\xA9 ", seo_title]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "text-right",
          children: /* @__PURE__ */ jsx("div", {
            className: "flex flex-col md:flex-row",
            children: pages.map((p) => /* @__PURE__ */ jsx(Link, {
              className: "mr-5 text-sm text-gray-600 dark:text-zinc-300",
              href: route("page", {
                page: p.page_slug
              }),
              children: p.page_title
            }, `page-${p.id}`))
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-5 container mx-auto text-center",
        children: /* @__PURE__ */ jsx("p", {
          children: __("At Fetish Mega Store, we are committed to curating an expansive collection of fetish and BDSM content to cater to diverse tastes and preferences. Our platform features a wide array of high-quality videos and photo albums, available for streaming or download, ensuring you can enjoy your favorite content hassle-free. As a leading provider in the adult entertainment industry, we continuously update our offerings to enhance your experience. Join our vibrant community and explore a variety of features designed to keep your passion for erotica thriving. Your feedback is invaluable to us; feel free to reach out with any questions, comments and suggestions.")
        })
      })]
    })]
  });
}
export {
  Front as F
};
