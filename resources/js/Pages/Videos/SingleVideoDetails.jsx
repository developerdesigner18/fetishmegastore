import React, { useEffect, useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import {
  BsTagFill,
  BsFillTagsFill,
  BsShare,
  BsHeart,
  BsHeartFill,
  BsEyeFill,
} from "react-icons/bs/index.js";
import { AiOutlineEye } from "react-icons/ai/index.js";
import { FcUnlock, FcEmptyFilter } from "react-icons/fc/index.js";
import Spinner from "@/Components/Spinner";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-toastify";
import {CgGirl} from "react-icons/cg"; 
import {
  MdGeneratingTokens,
  MdVideoLibrary,
  MdOutlinePeople,
} from "react-icons/md/index.js";
import axios from "axios";
import { FaGrinStars } from "react-icons/fa/index.js";
import SecondaryButton from "@/Components/SecondaryButton";
import debounce from "lodash.debounce";
import Modal from "@/Components/Modal";
import ShareLink from "./ShareLink";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TokenPurchasePopup from "@/Components/TokenPurchasePopup";
import SubscribePopup from "../Channel/Partials/SubscribePopup";
import InputError from "@/Components/InputError";
import Textarea from "@/Components/Textarea";
import { Inertia } from "@inertiajs/inertia";
import VideosLoop from "./Partials/VideosLoop";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import AdBar from "@/Components/AdBar";

const VideoComponent = ({
  video,
  relatedvideos,
  url,
  inModal,
  seo,
  authUser,
}) => {
  console.log("🚀 SingleVideoDetails props", { video, relatedvideos, url, authUser });

  const [viewIncreased, setViewIncreased] = useState(false);

  const [duration, setDuration] = useState();
  const [link, setLink] = useState(false);
  const [modal, setModal] = useState(false);
  const [freeShow, setFreeShow] = useState(false);
  const [favourite, setFavourite] = useState(video.isUserFavorite);
  const [downloadError, setDownloadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleMouseLeave = (id) => {
    setHovered((prev) => ({ ...prev, [id]: false }));
  };

  const { props } = usePage(); // inertia.js
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const isAuthenticated = props.auth?.user !== null;
  const canBePlayed = video.canBePlayed;

  const [showTooltip, setShowTooltip] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyAffiliateLink = () => {
    if (!authUser || !authUser.affiliate_code) {
      return;
    }

    const baseUrl = window.location.origin + '/single-video/' + video.slug;
    const shareUrl = `${baseUrl}?ref=${authUser.affiliate_code}`;

    const showCopied = () => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 5000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(showCopied)
        .catch(() => {
          fallbackCopyTextToClipboard(shareUrl);
          showCopied();
        });
    } else {
      fallbackCopyTextToClipboard(shareUrl);
      showCopied();
    }
  };

  // ✅ Fallback for clipboard
  const fallbackCopyTextToClipboard = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
          const successful = document.execCommand('copy');
          alert(successful ? 'Link copied!' : 'Copy failed. Try manually.');
      } catch (err) {
          alert('Copy failed. Try manually.');
      }

      document.body.removeChild(textArea);
  };

  useEffect(() => {
    handleIncreaseViews();
    if (props.popupMessage) {
      setPopupMessage(props.popupMessage);
      setShowPopup(true);
    }
  }, [props.popupMessage]);

  <Head title={video.title}>
    <meta name="keywords" content={seo?.meta_keyword || ""} />
    <meta name="description" content={seo?.desc || ""} />
    <meta name="robots" content={seo?.meta_robot || "index,follow"} />

    <meta property="og:title" content={seo?.og_title || video.title} />
    <meta property="og:description" content={seo?.og_desc || ""} />
    <meta property="og:image" content={seo?.og_image_url || ""} />
    <meta property="og:url" content={seo?.cust_url || ""} />

    {seo?.json_id && (
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoObject",
          identifier: seo?.json_id,
          name: seo?.og_title || video.title,
          description: seo?.desc || "",
          thumbnailUrl: seo?.og_image_url || "",
          uploadDate: video.uploadDate || "", // optional if you have
          contentUrl: window.location.href,
        })}
      </script>
    )}
  </Head>;

  const [downloadMessage, setDownloadMessage] = useState("");
  const handleDownload = async () => {
    setLoading(true);
    setDownloadError(null);
    try {
      console.log("Download request started...");
      const response = await axios.post(route("video.download"), {
        slug: video.slug,
      });
      if (response.data.status === 1) {
        setDownloadMessage("Download will start in sometime...please wait.");
        const downloadLink = response.data.link;
        console.log("Download URL:", downloadLink);
        const res = await fetch(downloadLink);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${video.slug}.mp4`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setDownloadError(response.data.message);
      }
    } catch (error) {
      console.error("Download error:", error);
      setDownloadError("An error occurred while downloading the video.");
    } finally {
      setLoading(false);
    }
  };

  const openSharigModal = (e, link) => {
    e.preventDefault();
    setLink(link);
    setModal(true);
  };

  const addToFav = () => {
    setFavourite(true);
    axios.post(route("video.addToFavorite", { id: video.id }));
  };

  const removeFromFav = () => {
    setFavourite(false);
    axios.post(route("video.removeFromFavorite", { id: video.id }));
  };

  const increaseViews = () => {
    axios.post(route("video.increaseViews", { video: video.id }));
  };

  const handleIncreaseViews = () => {
    axios.post(route("video.increaseViews", { video: video.id }))
      .then(() => {
        setViewIncreased(true);
      })
      .catch(error => {
        console.error("Error increasing views:", error);
      });
  };

  const videoRef = useRef(null);

  const videoSrc = {
    type: "video",
    autoplay: true,
    sources: [
      {
        src: video.videoUrl,
        type: "video/mp4",
        size: 720,
      },
      {
        src: video.videoUrl360p ?? video.videoUrl,
        type: "video/mp4",
        size: 360,
      },
    ],
  };

  return (
    <>
      <Modal show={modal} onClose={(e) => setModal(false)}>
        {link && <ShareLink link={link} inModal={true} />}
      </Modal>
      {popupMessage && showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white px-8 pt-12 pb-12 rounded-lg shadow-lg max-w-xl w-full text-center min-h-[400px] min-w-[800px] flex flex-col justify-center relative">
            <button
              onClick={() => {
                setShowPopup(false);
                window.location.href = "/";
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6">Notice</h2>
            <p className="mb-8 text-lg">{popupMessage}</p>

            <Link
              href={route("token.packages")}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold text-lg mx-auto"
            >
              Purchase Token Packs
            </Link>
          </div>
        </div>
      )}

      <div className={`justify-center w-full ${inModal ? "p-3" : "p-0"}`}>
        <div className="flex items-start">
          <div className="mr-5 flex flex-col items-center flex-shrink-0">
            <Link
              href={route("channel", {
                user: video.streamer.username,
              })}
            >
              <img
                src={video.streamer.profile_picture}
                className="w-14 h-14 rounded-full"
              />
            </Link>
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-light dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
              {video.title}
            </h1>
            <div className="flex items-center flex-wrap md:space-x-2 mt-1">
              <Link
                href={route("channel", {
                  user: video.streamer.username,
                })}
                className="text-sm text-gray-600 mr-2  dark:text-white"
              >
                @{video.streamer.username}
              </Link>
              {video.selectedCategory?.map((category, index) => (
                <Link
                  href={route("videos.browse", {
                    videocategory: category.value,
                    slug: `-${category.label}`,
                  })}
                  className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                >
                  <BsTagFill className="w-3" />
                  <span>{category.label}</span>
                </Link>
              ))}
              <BsFillTagsFill className="w-3" />
              <span>
                {video?.tags?.map((tag, index) => (
                  <Link
                    href={route("tag", {
                      id: tag.id,
                    })}
                    className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                  >
                    {" "}
                    <span>
                      {tag.name} {index !== video.tags.length - 1 && ", "}
                    </span>
                  </Link>
                ))}
              </span>
              <div className="text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                <CgGirl className="w-3" />
                {video?.modelDetails?.map((model, index) => (
                  <Link
                    key={model.slug}
                    href={route("model", { id: model.slug })}
                    className="text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                  >
                    <span>
                      {model.name} {index !== video.modelDetails.length - 1 && ", "}
                    </span>
                  </Link>
                ))}
              </div>


              {video.free_for_subs === "yes" && video.price !== 0 && (
                <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                  <FaGrinStars className="w-4 h-4 mr-1" />
                  {__("Free For Subscribers")}
                </div>
              )}
              {video.canDownload && (
                <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                  <button
                    onClick={handleDownload}
                    className="relative flex items-center justify-center"
                    disabled={loading} // Disable the button while loading
                  >
                    {loading ? (
                      // Show loader when loading is true
                      <span className="loader"></span> // You can replace this with your actual loader component
                    ) : (
                      __("Download")
                    )}
                  </button>
                </div>
              )}
              {downloadMessage && (
                <p className="text-gray-600 mt-2 text-sm">{downloadMessage}</p>
              )}
              {downloadError && <p className="text-red-500">{downloadError}</p>}
              <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                <span>
                  {" "}
                  {__("Duration ")} : {video.duration.minute}
                </span>
              </div>
              <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                <span>
                  {" "}
                  {__("Resolution ")} : {video.duration.resolution}
                </span>
              </div>
              <div
                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                // onClick={handleCopyUrl}
                onClick={(e) => openSharigModal(e, document.URL)}
              >
                <BsShare className="w-4 h-4 mr-1" />
                {__("Share ")}
              </div>

              {/* {authUser?.is_affiliate_vendor === 1 &&
                authUser?.affiliate_vendor_verifiy === 1 && (
                  <div
                    className="inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-600 cursor-pointer relative"
                    onClick={copyAffiliateLink}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <BsCopy className="w-4 h-4 mr-1" />
                    Copy
                    {showTooltip && (
                      <span className="absolute bottom-full left-0 mb-2 w-max bg-gray-700 text-white text-xs rounded px-2 py-1 z-10">
                        You're inviting someone to purchase this video via your
                        affiliate link. If they purchase, you earn 50% tokens.
                      </span>
                    )}
                    {copySuccess && (
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-green-600 text-white text-xs rounded px-2 py-1 shadow z-10">
                            Affiliate link copied!
                        </span>
                    )}
                  </div>
                )} */}

              <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                <SubscribePopup
                  user={video.streamer}
                  userIsSubscribed={video.isCurrentSubscriber}
                />
              </div>
              {favourite ? (
                <div
                  className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer"
                  // onClick={handleCopyUrl}
                  onClick={(e) => removeFromFav()}
                >
                  <BsHeartFill
                    style={{ color: "red" }}
                    className="w-4 h-4 mr-1"
                  />
                </div>
              ) : (
                <>
                <div
                  className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer"
                  // onClick={handleCopyUrl}
                  onClick={(e) => addToFav()}
                >
                  <BsHeart style={{ color: "red" }} className="w-4 h-4 mr-1" />
                </div>

                <div className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer" >
                  <BsEyeFill style={{ color: "red" }} className="w-4 h-4 mr-1" />
                  <span>{ video?.views }</span>
                </div>
                </>
              )}
              {!video.canBePlayed && (
                <div
                  className="mt-1 md:mt-0 inline-flex items-center text-sm bg-yellow-300 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                  onClick={(e) =>
                    Inertia.visit(
                      route("video.unlock", {
                        video: video.id,
                      })
                    )
                  }
                >
                  <MdGeneratingTokens className="w-4 h-4 mr-1" />
                  {__("Unlock with :tokens tokens", {
                    tokens: video.price,
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          {isAuthenticated ? (
            canBePlayed ? (
              <Plyr source={videoSrc} />
            ) : (
              // Locked: show GIF
              <div className="flex flex-col items-center justify-center">
                <img
                  src={video.videoGIF}
                  className="hovered-gif rounded-tl-lg rounded-tr-lg mb-3"
                  alt="GIF Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-thumbnail.jpg";
                  }}
                />
                <div className="mt-5 text-center">
                  {video.price > 0 && (
                    <PrimaryButton
                      className="mt-3"
                      onClick={() =>
                        Inertia.visit(
                          route("video.unlock", { video: video.id })
                        )
                      }
                    >
                      Unlock with {video.price} Tokens
                    </PrimaryButton>
                  )}
                </div>
              </div>
            )
          ) : (
            // Not logged in: always show GIF
            <div className="flex flex-col items-center justify-center">
              <img
                src={video.videoGIF}
                className="hovered-gif rounded-tl-lg rounded-tr-lg mb-3"
                alt="GIF Preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-thumbnail.jpg";
                }}
              />
              <div className="mt-5 text-center">
                <Link
                  href={route("login")}
                  className="bg-violet-600 p-1.5 rounded-lg border-violet-600 font-semibold px-4 text-zinc-200 hover:bg-violet-500"
                >
                  Login For Watch Full Video
                </Link>
              </div>
            </div>
          )}
        </div>

        <h2 className="mt-5 dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
          {video.description ? video.description : ""}
        </h2>

        <div className="mt-3 flex justify-center items-center">
          <AdBar />
        </div>
      </div>
    </>
  );
};
const RelatedVideoComponent = ({ relatedvideos, userLoginID }) => {
  const [nextUrl, setNextUrl] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [videos, setVideos] = useState("");

  useEffect(() => {
    setVideos(relatedvideos.data);
    setNextUrl(relatedvideos.next_page_url);
  }, []);

  const handleLoadNewVideos = async (next_page_url) => {
    setSpinner(true);
    // console.log(next_page_url,'next_page_url')
    try {
      const res = await axios.get(next_page_url);
      setVideos([...videos, ...res.data.data]);
      setNextUrl(res.data.next_page_url);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className={`flex justify-start items-center mt-20 mb-8`}>
        <MdVideoLibrary className="text-pink-600 text-4xl mr-1" />
        <h2 className="text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold">
          {__("Related Videos")}
        </h2>
      </div>
      <div className="mt-5 mb-5">
        {relatedvideos.total === 0 && (
          <div className="text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center">
            <FcEmptyFilter className="w-12 h-12 mr-2" />
            {__("No videos to show")}
          </div>
        )}
        {videos.length > 0 && (
          <VideosLoop videos={videos} userLoginID={userLoginID} />
        )}
        {relatedvideos.last_page > 1 && (
          <>
            {spinner ? (
              <div className="my-3">
                <Spinner />
              </div>
            ) : (
              <SecondaryButton
                className="mt-2"
                processing={relatedvideos.next_page_url ? false : true}
                onClick={() => handleLoadNewVideos(nextUrl)}
              >
                {__("Load More")}
              </SecondaryButton>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const RequestVideoComponent = ({ video }) => {
  const [spinner, setSpinner] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    description: "",
    video_id: video.id,
  });
  const onHandleChange = (event) => {
    setData(
      event.target.name,
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value
    );
  };
  const submit = async (e) => {
    e.preventDefault();

    setSpinner(true);
    try {
      await axios({
        method: "post",
        url: route("request.video"),
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          //handle success
          toast.success(response.data.message);
        })
        .catch(function (response) {
          //handle error
          toast.error(response);
        });

      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mt-5 mb5">
        <h3 className="text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold">
          {__("Request Video")}
        </h3>
        <form onSubmit={submit}>
          <div className="mb-5">
            <InputLabel for="description" value={__("Description")} />
            <Textarea
              name="description"
              value={data.description}
              handleChange={onHandleChange}
              required
              className="mt-1 block w-full"
            />
            <InputError message={errors.description} className="mt-2" />
          </div>
          <div className="flex items-center justify-end mt-4">
            {spinner ? (
              <div className="my-3">
                <Spinner />
              </div>
            ) : (
              <PrimaryButton className="ml-4" processing={processing}>
                {__("Request Video")}
              </PrimaryButton>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default function SingleVideo({
  video,
  relatedvideos,
  url,
  userLoginID,
  inModal = false,
  authUser,
}) {
  const { props } = usePage();
  const loggedInUser = props.auth.user; // Logged in user ka object
  // console.log('relatedvideos', relatedvideos)
  console.log("SingleVideo rendered with inModal:", inModal);
  if (inModal) {
    return (
      <VideoComponent
        video={video}
        relatedvideos={relatedvideos}
        url={url}
        inModal={true}
        authUser={authUser}
      />
    );
  } else {
    const { props } = usePage();
    const loggedInUser = props.auth?.user;

    const seo = video.seoDetails;
    return (
      <AuthenticatedLayout>
        <Head title={video.title} />
        <VideoComponent
          video={video}
          relatedvideos={relatedvideos}
          url={url}
          inModal={false}
          authUser={authUser}
        />
        <RelatedVideoComponent
          relatedvideos={relatedvideos}
          userLoginID={userLoginID}
        />
        {/*<RequestVideoComponent video={video}/>*/}
        {/* <TokenPurchasePopup /> */}
        {loggedInUser && loggedInUser?.tokens <= 20 && <TokenPurchasePopup />}
        <Head title={video.title}>
          <meta name="description" content={video.description?.slice(0, 160)} />
        </Head>
      </AuthenticatedLayout>
    );
  }
}
