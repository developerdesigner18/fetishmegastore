import videojs from "video.js";
/* empty css                    */import { useRef, useEffect } from "react";
import { a as jsx } from "../app.mjs";
import "lodash";
import "axios";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/inertia-react";
import "@inertiajs/progress";
import "react/jsx-runtime";
const VideoJS = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const {
    options,
    onReady
  } = props;
  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoRef.current.appendChild(videoElement);
      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      });
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);
  return /* @__PURE__ */ jsx("div", {
    "data-vjs-player": true,
    className: "vjs-fill mt-10 lg:mt-0 w-full h-full min-w-[360px] min-h-[320px]",
    children: /* @__PURE__ */ jsx("div", {
      ref: videoRef
    })
  });
};
export {
  VideoJS,
  VideoJS as default
};
