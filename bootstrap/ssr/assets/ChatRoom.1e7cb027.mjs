import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { BsChatText } from "react-icons/bs/index.js";
import { MdSettingsInputAntenna } from "react-icons/md/index.js";
import { FaHandSparkles, FaGrinStars, FaBan } from "react-icons/fa/index.js";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import TipPopup from "./TipPopup.97b22a85.mjs";
import { usePage } from "@inertiajs/inertia-react";
import { S as SecondaryButton } from "./SecondaryButton.09a51f74.mjs";
import { Inertia } from "@inertiajs/inertia";
import { Tooltip } from "react-tooltip";
/* empty css                             */import { M as Modal } from "./Modal.c4c8f017.mjs";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { j as jsxs, a as jsx, F as Fragment } from "../app.mjs";
import "./InputLabel.2f9ff89f.mjs";
import "./Textarea.d2e6a2e3.mjs";
import "./NumberInput.e1cdf2ea.mjs";
import "react-dom";
import "@headlessui/react";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function ChatRoom({
  streamer,
  forceScroll = false
}) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
  const [chatScrollHeight, setChatScrollHeight] = useState(0);
  const {
    auth,
    pusher
  } = usePage().props;
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [confirmBanUserId, setConfirmBanUserId] = useState(null);
  const {
    coins_sound
  } = usePage().props;
  const tipSound = new Audio(coins_sound);
  const chatScroll = useRef();
  const roomName = `room-${streamer.username}`;
  const userInfoModal = (userId) => {
    var _a;
    if (((_a = auth == null ? void 0 : auth.user) == null ? void 0 : _a.id) !== streamer.id) {
      return;
    }
    if (streamer.id === userId) {
      return;
    }
    setConfirmBanUserId(null);
    setUserInfo(null);
    setIsUserInfoModalOpen(!isUserInfoModalOpen);
    axios.post(route("profile.modalUserInfo", {
      user: userId
    })).then((response) => {
      setUserInfo(response.data);
    }).catch((Error) => toast.error(__("Error loading user infos for the modal")));
  };
  const banUser = (e, userId) => {
    e.preventDefault();
    axios.post(route("channel.banUserFromRoom", {
      user: userId
    })).then((response) => {
      toast.success(__("User has been banned!"));
      setUserInfo(null);
      setConfirmBanUserId(null);
      setIsUserInfoModalOpen(!isUserInfoModalOpen);
    }).catch((Error) => toast.error(__("Error banning user")));
  };
  const updateScrollPosition = (target) => {
    const totalScroll = target.scrollTop + target.clientHeight;
    if (totalScroll == target.scrollHeight) {
      setIsScrolling(false);
    } else {
      setIsScrolling(true);
    }
    setChatScrollHeight(totalScroll);
  };
  const scrollTheChat = () => {
    var _a;
    if (!isScrolling) {
      const {
        offsetHeight,
        scrollHeight,
        scrollTop
      } = chatScroll.current;
      (_a = chatScroll.current) == null ? void 0 : _a.scrollTo(0, scrollHeight);
    }
  };
  useEffect(() => {
    scrollTheChat();
  }, [messages]);
  useEffect(() => {
    axios.get(route("chat.latestMessages", {
      roomName
    })).then((response) => {
      setMessages(response.data);
    }).catch((Error) => toast.error(`Loading latest messages: ${Error.message}`));
    window.Echo.channel(roomName).listen(".livechat", (data) => {
      setMessages((messages2) => [...messages2, data.chat]);
      if (data.chat.tip > 0) {
        tipSound.play();
      }
    });
    if (forceScroll) {
      scrollTheChat();
    }
  }, []);
  const sendMessage = (e) => {
    e.preventDefault();
    axios.post(route("chat.sendMessage", {
      user: streamer.id
    }), {
      message: msg
    }).then(() => setMsg("")).catch((Error) => {
      var _a;
      toast.error((_a = Error.response.data) == null ? void 0 : _a.message);
    });
    scrollTheChat();
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col w-full lg:w-[400px] h-[270px] sm:h-[360px] lg:h-[536px] bg-white dark:bg-zinc-900 dark:border-zinc-900 ",
    children: [/* @__PURE__ */ jsxs(Modal, {
      show: isUserInfoModalOpen,
      onClose: (e) => setIsUserInfoModalOpen(false),
      children: [!userInfo && __("Loading user infos.."), userInfo && /* @__PURE__ */ jsx("div", {
        className: "p-5 text-gray-600 dark:text-gray-100 text-lg",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("img", {
              src: userInfo.profile_picture,
              alt: "",
              className: "rounded-full w-20 border-2 border-indigo-100"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "pl-3 flex-grow",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "text-lg font-semibold",
              children: userInfo.name
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm",
              children: ["@", userInfo.username]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm flex",
              children: userInfo.channel_follower ? /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(FaHandSparkles, {
                  className: "mt-0.5 mr-1"
                }), __("Follows your channel")]
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(FaHandSparkles, {
                  className: "mt-0.5 mr-1"
                }), __("Doesn't follow your channel")]
              })
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm flex",
              children: userInfo.channel_follower ? /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(FaGrinStars, {
                  className: "mt-0.5 mr-1"
                }), __("Subscribed on Tier: :tier", {
                  tier: userInfo.membership_tier
                })]
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(FaGrinStars, {
                  className: "mt-0.5 mr-1"
                }), __("Not subscribed to your channel")]
              })
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "justify-end",
            children: userInfo.is_user_banned ? /* @__PURE__ */ jsx("p", {
              children: __("Banned on :date", {
                date: userInfo.banned_date
              })
            }) : confirmBanUserId === null ? /* @__PURE__ */ jsxs(PrimaryButton, {
              onClick: (e) => setConfirmBanUserId(userInfo.id),
              children: [/* @__PURE__ */ jsx(FaBan, {
                className: "mr-1"
              }), __("Ban User")]
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [__("Are you sure?"), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("button", {
                onClick: (e) => banUser(e, userInfo.id),
                className: "text-red-600 hover:underline font-semibold",
                children: __("Yes, ban")
              }), /* @__PURE__ */ jsx("button", {
                onClick: (e) => setConfirmBanUserId(null),
                className: "ml-2 text-indigo-500 hover:underline font-semibold",
                children: __("Cancel")
              })]
            })
          })]
        })
      })]
    }), /* @__PURE__ */ jsxs("div", {
      ref: chatScroll,
      onScroll: (e) => updateScrollPosition(e.currentTarget),
      className: "flex-grow  text-gray-700 text-sm dark:text-white pl-2  relative overflow-scroll",
      children: [/* @__PURE__ */ jsxs("h3", {
        className: "font-semibold pt-5 text-lg flex items-center justify-center",
        children: [/* @__PURE__ */ jsx(BsChatText, {
          className: "mr-2"
        }), __("Live Chat")]
      }), messages.map((m) => /* @__PURE__ */ jsxs("p", {
        className: `py-2 ${m.tip > 0 && "bg-yellow-200 rounded-lg p-2 text-gray-900 my-2"}`,
        children: [m.user_id === streamer.id && /* @__PURE__ */ jsx("span", {
          children: /* @__PURE__ */ jsx(MdSettingsInputAntenna, {
            "data-tooltip-content": __("Channel Owner"),
            "data-tooltip-id": `chatmsg-follower-${m.id}`,
            className: "-mt-0.5 mr-1 inline text-pink-600"
          })
        }), m.isFollower && /* @__PURE__ */ jsx("span", {
          children: /* @__PURE__ */ jsx(FaHandSparkles, {
            "data-tooltip-content": __("Channel Follower"),
            "data-tooltip-id": `chatmsg-follower-${m.id}`,
            className: "mr-1 inline text-cyan-600"
          })
        }), m.isSubscriber && /* @__PURE__ */ jsx("span", {
          children: /* @__PURE__ */ jsx(FaGrinStars, {
            "data-tooltip-content": __("Channel Subscriber"),
            "data-tooltip-id": `chatmsg-subscriber-${m.id}`,
            className: "mr-1 inline text-fuchsia-500"
          })
        }), /* @__PURE__ */ jsx(Tooltip, {
          anchorSelect: "svg"
        }), /* @__PURE__ */ jsxs("span", {
          onClick: (e) => userInfoModal(m.user_id),
          className: `font-semibold cursor-pointer ${m.user_id === streamer.id ? "text-pink-600" : "text-indigo-500 dark:text-indigo-400"}`,
          children: [m.user.username, ": "]
        }), m.tip > 0 && __("Just tipped :tip tokens! ", {
          tip: m.tip
        }), /* @__PURE__ */ jsx("span", {
          className: "break-all",
          children: m.message
        })]
      }, `msg-${m.id}`))]
    }), /* @__PURE__ */ jsxs("div", {
      className: "py-5 px-2 flex items-center",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mr-2 flex-grow",
        children: [auth.user && /* @__PURE__ */ jsx("form", {
          onSubmit: sendMessage,
          children: /* @__PURE__ */ jsx(TextInput, {
            name: "chat_message",
            className: "w-full",
            placeholder: __("Enter message & press enter"),
            value: msg,
            handleChange: (e) => setMsg(e.target.value)
          })
        }), !auth.user && /* @__PURE__ */ jsx(SecondaryButton, {
          className: "w-full py-3",
          onClick: (e) => Inertia.visit(route("login")),
          children: __("Login to Chat")
        })]
      }), /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx(TipPopup, {
          streamer
        })
      })]
    })]
  });
}
export {
  ChatRoom as default
};
