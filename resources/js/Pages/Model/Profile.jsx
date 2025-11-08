import React, { useState } from "react";
import { Head } from "@inertiajs/inertia-react";
import Front from "@/Layouts/Front";
import __ from "@/Functions/Translate";
import axios from "axios";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-toastify";
import { FaHandSparkles } from "react-icons/fa/index.js";
import ProfileTabs from "./Partials/ProfileTabs";
import { Inertia } from "@inertiajs/inertia";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaEnvelope,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaGlobe,
} from "react-icons/fa/index.js";

export default function StartStream({
  category,
  isLoggedIn, // Add isLoggedIn prop from the backend
  userLoginID,
  seo,
  preview,
  galleries,
}) {
  const [hovered, setHovered] = useState(false); // Track hover state
  const [hoveredField, setHoveredField] = useState(""); // Track which field is being hovered
  const [activeTab, setActiveTab] = useState("Videos");

  console.log("inside the profile");
  const coverBg = {
    backgroundImage: `url(${category.imageUrl})`,
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Function to handle blur effect and redirect to login page
  const handleBlurClick = (field) => {
    if (!isLoggedIn) {
      // Redirect to login page if the user clicks on a blurred field
      Inertia.visit("/login"); // Replace with your login URL
    }
  };

  <Head title={seo.title}>
    <meta name="keywords" content={seo?.meta_keyword || ""} />
    <meta name="description" content={seo?.desc || ""} />
    <meta name="robots" content={seo?.meta_robot || "index,follow"} />

    <meta property="og:title" content={seo?.og_title || seo.title} />
    <meta property="og:description" content={seo?.og_desc || ""} />
    <meta property="og:image" content={seo?.og_image_url || ""} />
    <meta property="og:url" content={seo?.cust_url || ""} />

    {seo?.json_id && (
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoObject",
          identifier: seo?.json_id,
          name: seo?.og_title || seo.title,
          description: seo?.desc || "",
          thumbnailUrl: seo?.og_image_url || "",
          uploadDate: seo.uploadDate || "", // optional if you have
          contentUrl: window.location.href,
        })}
      </script>
    )}
  </Head>;

  return (
    <Front>
      {/* STREAMING CENTER CONTENTS */}
      <div className="-mt-[60px] max-w-5xl mx-auto">
        <Head
          title={__(":channelName's channel (:handle)", {
            channelName: category.name,
            handle: `@${category.name}`,
          })}
        >
          <meta property="og:title" content="The Rock" />
          <meta
            property="og:url"
            content="https://www.imdb.com/title/tt0117500/"
          />
          <meta
            property="og:image"
            content="https://ia.media-imdb.com/images/rock.jpg"
          />
        </Head>

        {/* Gallery Slider */}
        <div>
          <Slider {...settings}>
            {category.galleryUrl?.map((v, index) => (
              <div key={index}>
                <img
                  src={v.link}
                  alt=""
                  style={{ width: "auto", height: "500px", margin: "0 auto" }}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Main Content - Profile Details */}
        <div className="flex items-center flex-wrap justify-between bg-white dark:bg-zinc-900 text-gray-700 -mt-2 rounded-b-lg px-3 pt-5 pb-4 shadow">
          <div className="flex items-center">
            <div className="relative">
              <div className="border-4 border-white shadow z-10 ml-2">
                <img
                  src={category.imageUrl}
                  alt=""
                  className="cursor-pointer w-24 h-34 dark:border-red-100"
                />
              </div>
            </div>
            <div className="ml-3 pb-2">
              <h3 className="dark:text-white text-xl lg:text-2xl text-indigo-700 font-bold">
                {category.name}
              </h3>
              {category?.age && (
                <p className="text-indigo-800 dark:text-white">
                  Age : {category.age}
                </p>
              )}
              {category?.country && (
                <p className="text-indigo-800 dark:text-white">
                  Country : {category.country}
                </p>
              )}
              {category?.size && (
                <p className="text-indigo-800 dark:text-white">
                  Size : {category.size}
                </p>
              )}
              {category?.shoe_size && (
                <p className="text-indigo-800 dark:text-white">
                  Shoe Size : {category.shoe_size}
                </p>
              )}
              {category?.weight && (
                <p className="text-indigo-800 dark:text-white">
                  Weight : {category.weight}
                </p>
              )}
              {!isLoggedIn && hovered && hoveredField && (
                <h4 className="text-xl font-bold text-center mt-4 text-red-500">
                  Model's social media account can be viewed after logging into
                  your account
                </h4>
              )}
              <div className="space-y-2 mt-4" style={{ display: "flex" }}>
                {/* Conditionally render fields with blur effect if user is not logged in */}
                {category?.email && (
                  <p
                    style={{ marginTop: "8px" }}
                    className={`text-indigo-800 dark:text-white ${
                      !isLoggedIn ? "blur-sm cursor-pointer" : ""
                    }`}
                    onClick={() => handleBlurClick("email")}
                    onMouseEnter={() => {
                      setHovered(true);
                      setHoveredField("email");
                    }}
                    onMouseLeave={() => {
                      setHovered(false);
                      setHoveredField("");
                    }}
                  >
                    <a
                      href={isLoggedIn ? `mailto:${category.email}` : "/login"}
                      className="flex items-center"
                      style={{ fontSize: "20px" }}
                    >
                      <FaEnvelope className="mr-2" />
                    </a>
                  </p>
                )}

                {category?.insta_url && (
                  <p
                    className={`text-indigo-800 dark:text-white ${
                      !isLoggedIn ? "blur-sm cursor-pointer" : ""
                    }`}
                    onClick={() => handleBlurClick("insta_url")}
                    onMouseEnter={() => {
                      setHovered(true);
                      setHoveredField("insta_url");
                    }}
                    onMouseLeave={() => {
                      setHovered(false);
                      setHoveredField("");
                    }}
                  >
                    <a
                      href={isLoggedIn ? category.insta_url : "/login"}
                      target={isLoggedIn ? "_blank" : ""}
                      rel="noopener noreferrer"
                      className="flex items-center"
                      style={{ fontSize: "20px" }}
                    >
                      <FaInstagram className="mr-2" />
                    </a>
                  </p>
                )}

                {category?.twitter_url && (
                  <p
                    className={`text-indigo-800 dark:text-white ${
                      !isLoggedIn ? "blur-sm cursor-pointer" : ""
                    }`}
                    onClick={() => handleBlurClick("twitter_url")}
                    onMouseEnter={() => {
                      setHovered(true);
                      setHoveredField("twitter_url");
                    }}
                    onMouseLeave={() => {
                      setHovered(false);
                      setHoveredField("");
                    }}
                  >
                    <a
                      href={isLoggedIn ? category.twitter_url : "/login"}
                      target={isLoggedIn ? "_blank" : ""}
                      rel="noopener noreferrer"
                      className="flex items-center"
                      style={{ fontSize: "20px" }}
                    >
                      <FaTwitter className="mr-2" />
                    </a>
                  </p>
                )}

                {category?.facebook_url && (
                  <p
                    className={`text-indigo-800 dark:text-white ${
                      !isLoggedIn ? "blur-sm cursor-pointer" : ""
                    }`}
                    onClick={() => handleBlurClick("facebook_url")}
                    onMouseEnter={() => {
                      setHovered(true);
                      setHoveredField("facebook_url");
                    }}
                    onMouseLeave={() => {
                      setHovered(false);
                      setHoveredField("");
                    }}
                  >
                    <a
                      href={isLoggedIn ? category.facebook_url : "/login"}
                      target={isLoggedIn ? "_blank" : ""}
                      rel="noopener noreferrer"
                      className="flex items-center"
                      style={{ fontSize: "20px" }}
                    >
                      <FaFacebook className="mr-2" />
                    </a>
                  </p>
                )}

                {category?.website && (
                  <p
                    className={`text-indigo-800 dark:text-white ${
                      !isLoggedIn ? "blur-sm cursor-pointer" : ""
                    }`}
                    onClick={() => handleBlurClick("website")}
                    onMouseEnter={() => {
                      setHovered(true);
                      setHoveredField("website");
                    }}
                    onMouseLeave={() => {
                      setHovered(false);
                      setHoveredField("");
                    }}
                  >
                    <a
                      href={isLoggedIn ? category.website : "/login"}
                      target={isLoggedIn ? "_blank" : ""}
                      rel="noopener noreferrer"
                      className="flex items-center"
                      style={{ fontSize: "20px" }}
                    >
                      <FaGlobe className="mr-2" />
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Conditionally Blur These Fields Only */}
        {/* Tooltip to inform the user to log in */}
        {!isLoggedIn && hovered && (
          <div className="absolute top-0 left-0 p-2 bg-gray-700 text-white rounded-md shadow-lg z-50">
            <h2>Please log in first</h2>
          </div>
        )}

        {/* Additional Message for Hovered Field */}

        {/* Description */}
        <p className="font-semibold dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
          {category?.description}
        </p>

        {/* Profile Tabs */}
        <ProfileTabs
          category={category}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userLoginID={userLoginID}
          preview={preview}
          galleries={galleries}
        />
      </div>
    </Front>
  );
}
