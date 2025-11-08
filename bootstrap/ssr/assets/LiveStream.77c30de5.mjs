import { useState, useRef, useEffect } from "react";
import { F as Front } from "./Front.602cce17.mjs";
import { _ as __ } from "./Translate.346b89d9.mjs";
import { a as jsx, j as jsxs, F as Fragment } from "../app.mjs";
import ChatRoom from "./ChatRoom.1e7cb027.mjs";
import VideoJS from "./VideoJs.e36ba6fd.mjs";
import StreamInstructions from "./StreamInstructions.4ab5a414.mjs";
import { usePage } from "@inertiajs/inertia-react";
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
import "./TipPopup.97b22a85.mjs";
import "./PrimaryButton.9fb48a50.mjs";
import "./InputLabel.2f9ff89f.mjs";
import "./Textarea.d2e6a2e3.mjs";
import "./NumberInput.e1cdf2ea.mjs";
import "./SecondaryButton.09a51f74.mjs";
import "@inertiajs/inertia";
import "react-tooltip";
/* empty css                             */import "video.js";
/* empty css                    */function LiveStream({
  isChannelOwner,
  streamUser,
  roomName
}) {
  var _a;
  const [isRoomOffline, setIsRoomOffline] = useState(streamUser.live_status === "online" ? false : true);
  const [showMessage, setShowMessage] = useState(true);
  const {
    auth
  } = usePage().props;
  console.info(`${route("home")}/livestreams/${roomName}.m3u8`);
  const playerRef = useRef(null);
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fill: true,
    preload: "auto",
    fluid: true,
    sources: [{
      src: `${route("home")}/livestreams/${roomName}.m3u8`,
      type: "application/x-mpegURL"
    }]
  };
  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on("waiting", () => {
      console.log("player is waiting");
    });
    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };
  useEffect(() => {
    window.Echo.channel("LiveStreamRefresh").listen(".livestreams.refresh", (data) => {
      console.log(`refresh livestreams`);
      Inertia.reload();
    });
    window.Echo.channel(`room-${streamUser.username}`).listen(".livestream.started", (data) => {
      setIsRoomOffline(false);
    }).listen(".livestream.ban", (data) => {
      window.location.href = route("channel.bannedFromRoom", {
        user: streamUser.username
      });
    }).listen(".livestream.stopped", (data) => {
      setIsRoomOffline(true);
    });
  }, []);
  return /* @__PURE__ */ jsx(Front, {
    extraHeader: true,
    extraHeaderTitle: __("@:username's Live Stream", {
      username: streamUser.username
    }),
    extraHeaderImage: "/images/live-stream-icon.png",
    extraImageHeight: "h-10",
    children: /* @__PURE__ */ jsxs("div", {
      className: "sm:-mt-[70px] -mt-[110px] flex max-w-7xl flex-col lg:flex-row lg:justify-between items-start h-fit",
      children: [/* @__PURE__ */ jsx("div", {
        className: "w-full h-full",
        children: isRoomOffline ? /* @__PURE__ */ jsx(StreamInstructions, {
          streamKey: roomName,
          streamUser: streamUser.username
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [streamUser.username === ((_a = auth == null ? void 0 : auth.user) == null ? void 0 : _a.username) && /* @__PURE__ */ jsxs("div", {
            className: `${showMessage ? "flex" : "hidden"} mb-3 mt-5 lg:mt-0 p-3 bg-white dark:bg-zinc-800 dark:text-white text-indigo-700 font-medium`,
            children: [__("If you just started streaming in OBS, refresh this page after 30 seconds to see your stream."), /* @__PURE__ */ jsx("button", {
              className: "ml-2 border-b border-indigo-700 dark:border-white",
              onClick: (e) => setShowMessage(false),
              children: __("Close message")
            })]
          }), /* @__PURE__ */ jsx(VideoJS, {
            options: videoJsOptions,
            onReady: handlePlayerReady
          })]
        })
      }), /* @__PURE__ */ jsx(ChatRoom, {
        streamer: streamUser
      })]
    })
  });
}
export {
  LiveStream as default
};
