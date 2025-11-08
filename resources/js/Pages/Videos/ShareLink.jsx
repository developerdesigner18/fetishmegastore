import React, { useEffect, useRef, useState } from "react";
import { FaWhatsapp, FaFacebook, FaLink } from "react-icons/fa/index.js";
import { FaTwitter } from "react-icons/fa/index.js";
import { BsTwitterX } from "react-icons/bs/index.js";
import { toast } from "react-toastify";
import { RiTwitterXFill } from "react-icons/ri/index.js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// const { getVideoDurationInSeconds } = require('get-video-duration');
import { Head, Link } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import { BsTagFill, BsFillTagsFill } from "react-icons/bs/index.js";
import { AiOutlineEye } from "react-icons/ai/index.js";
import { FcUnlock } from "react-icons/fc/index.js";
import PrimaryButton from "@/Components/PrimaryButton";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import axios from "axios";
import { FaGrinStars } from "react-icons/fa/index.js";
import { Inertia } from "@inertiajs/inertia";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaYoutube,
  FaTelegramPlane,
  FaEnvelope,
} from "react-icons/fa/index.js";

const LinkComponent = ({ link, inModal }) => {
  console.log(link, "link", inModal);

//   const handleCopyUrl = () => {
//     navigator.clipboard.writeText(link);
//     toast.success("Link copied successfully");
//   };

 const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied successfully!");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand("copy");
        if (successful) {
          toast.success("Link copied successfully!");
        } else {
          toast.error("Failed to copy link");
        }
      } catch (err) {
        toast.error("Clipboard not supported");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleWhatsAppShare = () => {
    let url = "https://api.whatsapp.com/send?text=" + link;

    // window.location.href = url;
    window.open(url, "_blank"); // Opens the URL in a new window or tab
  };

  const handleXShare = () => {
    let url = "https://twitter.com/intent/post?via=fetishmegastore&url=" + link;

    // window.location.href = url;
    window.open(url, "_blank"); // Opens the URL in a new window or tab
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      link
    )}`;
    window.open(url, "_blank");
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      link
    )}`;
    window.open(url, "_blank");
  };

  const handlePinterestShare = () => {
    const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      link
    )}`;
    window.open(url, "_blank");
  };

  const handleRedditShare = () => {
    const url = `https://www.reddit.com/submit?url=${encodeURIComponent(link)}`;
    window.open(url, "_blank");
  };

  const handleYouTubeShare = () => {
    toast.info("YouTube does not support direct link sharing. Share manually.");
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}`;
    window.open(url, "_blank");
  };

  const handleWeChatShare = () => {
    toast.info("WeChat sharing is not supported via browser. Use the app.");
  };

  const handleEmailShare = () => {
    const url = `mailto:?subject=Check this out&body=${encodeURIComponent(
      link
    )}`;
    window.open(url, "_self");
  };

  return (
    <>
      <div className={`justify-center w-full ${inModal ? "p-3" : "p-0"}`}>
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="mt-1 text-center">
            <p className="text-lg font-bold">Share this Video</p>
          </div>
          <div className="mt-3 flex space-x-3">
            {/*<div*/}
            {/*    className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full cursor-pointer">*/}
            {/*    <FaFacebook size={30} style={{color: "white"}} />*/}
            {/*</div>*/}
            <div
              className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full cursor-pointer"
              onClick={handleWhatsAppShare}
            >
              <FaWhatsapp size={22} style={{ color: "white" }} />
            </div>
            <div
              className="flex items-center justify-center w-10 h-10 bg-black-400 text-white rounded-full cursor-pointer"
              style={{ "background-color": "black" }}
              onClick={handleXShare}
            >
              <FaTwitter
                size={22}
                style={{ color: "white", "background-color": "black" }}
              />
            </div>
            <div
              className="flex items-center justify-center w-10 h-10 bg-zinc-300 text-dark rounded-full cursor-pointer"
              onClick={handleCopyUrl}
            >
              <FaLink size={22} />
            </div>

            <div className="mt-0 flex flex-wrap justify-center space-x-2">
              <div
                className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full cursor-pointer"
                onClick={handleFacebookShare}
              >
                <FaFacebookF size={20} />
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 bg-blue-800 text-white rounded-full cursor-pointer"
                onClick={handleLinkedInShare}
              >
                <FaLinkedinIn size={20} />
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full cursor-pointer"
                onClick={handlePinterestShare}
              >
                <FaPinterestP size={20} />
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full cursor-pointer"
                onClick={handleRedditShare}
              >
                <FaRedditAlien size={20} />
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 bg-red-700 text-white rounded-full cursor-pointer"
                onClick={handleYouTubeShare}
              >
                <FaYoutube size={20} />
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-full cursor-pointer"
                onClick={handleTelegramShare}
              >
                <FaTelegramPlane size={20} />
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full cursor-pointer"
                onClick={handleWeChatShare}
              >
                <span className="text-xs font-semibold">WeChat</span>
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 bg-gray-700 text-white rounded-full cursor-pointer"
                onClick={handleEmailShare}
              >
                <FaEnvelope size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ShareLink({ link, inModal = false }) {
  if (inModal) {
    return <LinkComponent link={link} inModal={true} />;
  } else {
    return (
      <AuthenticatedLayout>
        <Head title={video.title} />
        <LinkComponent video={video} inModal={false} />
      </AuthenticatedLayout>
    );
  }
}
