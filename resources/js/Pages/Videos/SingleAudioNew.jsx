import React, { useEffect, useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AudioLoop from "./Partials/AudioLoop";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import { BsTagFill, BsFillTagsFill, BsShare, BsHeart, BsEyeFill, BsHeartFill } from "react-icons/bs/index.js";
import { AiOutlineEye } from "react-icons/ai/index.js";
import { FcUnlock, FcEmptyFilter } from "react-icons/fc/index.js";
import Spinner from "@/Components/Spinner";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from 'react-toastify';
import { MdGeneratingTokens, MdVideoLibrary, MdOutlinePeople } from "react-icons/md/index.js";
import axios from "axios";
import { FaGrinStars } from "react-icons/fa/index.js";
import SecondaryButton from "@/Components/SecondaryButton";
import debounce from "lodash.debounce";
import Modal from "@/Components/Modal";
import ShareLink from "./ShareLink";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SubscribePopup from "../Channel/Partials/SubscribePopup";
import InputError from "@/Components/InputError";
import Textarea from "@/Components/Textarea";
import { Inertia } from "@inertiajs/inertia";
import Plyr from "plyr-react"
import "plyr-react/plyr.css"

const AudioComponent = ({ audio, relatedaudio, url, inModal }) => {

    const [duration, setDuration] = useState()
    const [link, setLink] = useState(false);
    const [modal, setModal] = useState(false);
    const [freeShow, setFreeShow] = useState(false);
    const [favourite, setFavourite] = useState(audio.isUserFavorite)
    const [downloadError, setDownloadError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [downloadMessage, setDownloadMessage] = useState("");

    const openSharigModal = (e, link) => {
        e.preventDefault();
        setLink(link);
        setModal(true);
    };

    const addToFav = () => {
        setFavourite(true)
        axios.post(route("audio.addToFavorite", { id: audio.id }));
    };

    const removeFromFav = () => {
        setFavourite(false)
        axios.post(route("audio.removeFromFavorite", { id: audio.id }));
    };

    const increaseViews = () => {
        axios.post(route("audio.increaseViews", { audio: audio.id }));
    };

    const videoRef = useRef(null);
    const audioSrc = {
        type: "audio",
        autoplay: false,
        sources: [
            {
                src: audio.audio_file,
                type: 'audio/mp3',
                size: 720,
            },
            {
                src: audio.videoUrl360p ?? audio.audio_file,
                type: 'audio/mp3',
                size: 360,
            }
        ]
    };

    useEffect(() => {
        handleIncreaseViews();
    }, [])

    const handleIncreaseViews = () => {
        axios.post(route("audio.increaseAudioViews", { audio: audio.id }))
            .then(() => {
                setViewIncreased(true);
            })
            .catch(error => {
                console.error("Error increasing views:", error);
            });
    };

    const handleDownload = () => {
        setLoading(true);
        setDownloadMessage("Download shuru ho raha hai... કૃપયા પ્રતીક્ષા કરે.");
        setDownloadError(null);

        const downloadUrl = route("audio.download", { audio: audio.id });

        try {
            const link = document.createElement('a');
            link.href = downloadUrl;

            link.setAttribute('download', `${audio.slug}.mp3`);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
                setDownloadMessage("");
                setLoading(false);
            }, 4000);

        } catch (error) {
            console.error("Download shuru karne mein error:", error);
            setDownloadError("Download shuru nahi ho saka. Kripya dobara koshish karein.");
            setLoading(false);
        }
    };

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

            <Modal show={modal} onClose={(e) => setModal(false)}>
                {link && <ShareLink link={link} inModal={true} />}
            </Modal>

            <div className={`justify-center w-full ${inModal ? "p-3" : "p-0"}`}>
                <div className="flex items-start">
                    <div className="mr-5 flex flex-col items-center flex-shrink-0">
                        <Link
                            href={route("channel", {
                                user: audio.streamer.username,
                            })}
                        >
                            <img
                                src={audio.streamer.profile_picture}
                                className="w-14 h-14 rounded-full"
                            />
                        </Link>
                    </div>
                    <div>
                        <h3 className="text-lg md:text-2xl font-light dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">{audio.title}</h3>

                        <div className="flex items-center flex-wrap md:space-x-2 mt-1">
                            <Link
                                href={route("channel", {
                                    user: audio.streamer.username,
                                })}
                                className="text-sm text-gray-600 mr-2  dark:text-white"
                            >
                                @{audio.streamer.username}
                            </Link>

                            {audio.selectedCategory?.map((category, index) => (
                                <Link
                                    href={route("audio.browse", {
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
                                {audio?.tags?.map((tag, index) => (
                                    <Link
                                        href={route("tag", {
                                            id: tag.id
                                            ,
                                        })}
                                        className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                                    > <span>{tag.name} {index !== audio.tags.length - 1 && ', '}</span>
                                    </Link>
                                ))}
                            </span>

                            {audio.free_for_subs === "yes" && audio.price !== 0 && (
                                <div
                                    className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                    <FaGrinStars className="w-4 h-4 mr-1" />
                                    {__("Free For Subscribers")}
                                </div>
                            )}

                            <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <span> {__("Duration ")} : {audio.duration.minute}</span>
                            </div>

                            <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <span> {__("Resolution ")} : {audio.duration.resolution}</span>
                            </div>

                            <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                                // onClick={handleCopyUrl}
                                onClick={(e) => openSharigModal(e, document.URL)}
                            >
                                <BsShare className="w-4 h-4 mr-1" />
                                {__("Share ")}
                            </div>

                            <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <SubscribePopup
                                    user={audio.streamer}
                                    userIsSubscribed={audio.isCurrentSubscriber}
                                />
                            </div>

                            {
                                favourite ? (
                                    <>
                                        <div
                                            className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer"
                                            onClick={(e) => removeFromFav()}
                                        >
                                            <BsHeartFill style={{ "color": "red" }} className="w-4 h-4 mr-1" />
                                        </div>

                                        <div className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer" >
                                            <BsEyeFill style={{ color: "red" }} className="w-4 h-4 mr-1" />
                                            <span>{audio?.views}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer"
                                            onClick={(e) => addToFav()}
                                        >
                                            <BsHeart style={{ "color": "red" }} className="w-4 h-4 mr-1" />
                                        </div>
                                        <div className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer" >
                                            <BsEyeFill style={{ color: "red" }} className="w-4 h-4 mr-1" />
                                            <span>{audio?.views}</span>
                                        </div>
                                    </>
                                )
                            }

                            {(audio.audio_file && audio.audio) &&
                                <>
                                    {!audio.canBePlayed && (
                                        <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-yellow-300 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                                            onClick={(e) =>
                                                Inertia.visit(
                                                    route("audio.unlock", {
                                                        audio: audio.id,
                                                    })
                                                )
                                            }
                                        >
                                            <MdGeneratingTokens className="w-4 h-4 mr-1" />
                                            {__("Unlock with :tokens tokens", {
                                                tokens: audio.price,
                                            })}
                                        </div>
                                    )}
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div>
                    {
                        (!audio.audio_file && !audio.audio) ? (
                            // agar dono null hai to ye message show karega
                            <div className="flex flex-col items-center justify-center py-10">
                                <p className="text-red-500 text-lg font-semibold">
                                    Something is wrong, audio was not found.
                                </p>
                            </div>
                        ) : (
                            // agar audio file mil gayi to normal logic chlega
                            <>
                                {
                                    audio.canBePlayed ? (
                                        <>
                                            <div className="flex justify-center items-center mt-3">
                                                <div style={{ width: "95%", margin: "auto" }}>
                                                    <Plyr source={audioSrc} />
                                                </div>

                                                {audio.canDownload && (
                                                    <button
                                                        onClick={handleDownload}
                                                        disabled={loading}
                                                        className="flex justify-center items-center bg-gray-100 rounded px-3 py-2 ml-3"
                                                        style={{
                                                            width: "5%",
                                                            margin: "auto",
                                                            textAlign: "center",
                                                            border: "1px solid #ccc",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        {loading ? (
                                                            <span className="loader"></span>
                                                        ) : (
                                                            <i className="fa fa-download text-xl" aria-hidden="true"></i>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            {downloadMessage && (
                                                <p className="text-gray-600 mt-2 text-sm">{downloadMessage}</p>
                                            )}

                                            {downloadError && <p className="text-red-500">{downloadError}</p>}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center" style={{ "justifyContent": "center" }}>
                                            <div className="relative">
                                                <img
                                                    src={audio.videoGIF ? audio.videoGIF : audio.thumbnail} alt="" className="rounded-lg w-full"
                                                />

                                                <div>
                                                    <PrimaryButton
                                                        className="h-12 mt-5 inline-flex"
                                                        onClick={(e) =>
                                                            Inertia.visit(
                                                                route("audio.unlock", {
                                                                    audio: audio.id,
                                                                })
                                                            )
                                                        }
                                                    >
                                                        <FcUnlock />
                                                        <MdGeneratingTokens className="mr-2 w-6 h-6 md:w-8 md:h-8" />
                                                        {__("Unlock with :tokens tokens", {
                                                            tokens: audio.price,
                                                        })}
                                                    </PrimaryButton>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </>
                        )
                    }
                </div>

                <div className="mt-5 dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                    {audio.description ? audio.description : ''}
                </div>

            </div>
        </>
    );
};

const RelatedAudioComponent = ({ relatedaudio }) => {
    const [nextUrl, setNextUrl] = useState("")
    const [spinner, setSpinner] = useState(false);
    const [audio, setAudio] = useState("")

    useEffect(() => {
        setAudio(relatedaudio.data)
        setNextUrl(relatedaudio.next_page_url)
    }, [])

    const handleLoadNewAudio = async (next_page_url) => {
        setSpinner(true);

        try {
            const res = await axios.get(next_page_url)
            setAudio([...audio, ...res.data.data])
            setNextUrl(res.data.next_page_url)
            setSpinner(false);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className={`flex justify-start items-center mt-20 mb-8`}>
                <MdVideoLibrary className="text-pink-600 text-4xl mr-1" />
                <h2 className="text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold">
                    {__("Related Audio")}
                </h2>
            </div>

            <div className="mt-5 mb-5">
                {relatedaudio.total === 0 && (
                    <div
                        className="text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center">
                        <FcEmptyFilter className="w-12 h-12 mr-2" />
                        {__("No audio to show")}
                    </div>
                )}
                {audio.length > 0 && <AudioLoop audio={audio} />}

                {relatedaudio.last_page > 1 && (
                    <>
                        {spinner ? (
                            <div className="my-3">
                                <Spinner />
                            </div>
                        ) :
                            <SecondaryButton className="mt-2"
                                processing={relatedaudio.next_page_url ? false : true}
                                onClick={() => handleLoadNewAudio(nextUrl)}
                            >

                                {__("Load More")}
                            </SecondaryButton>
                        }
                    </>
                )}
            </div>
        </div>
    );
};

const RequestAudioComponent = ({ audio }) => {
    const [spinner, setSpinner] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        description: "",
        audio_id: audio.id
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
                url: route('request.audio'),
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    toast.success(response.data.message)

                })

                .catch(function (response) {
                    toast.error(response)
                });

            setSpinner(false);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <div className="mt-5 mb5">
                <h3 className="text-indigo-900 text-center dark:text-zinc-200 text-4xl font-semibold">
                    {__("Request Audio")}
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

                        <InputError
                            message={errors.title}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        {spinner ? (
                            <div className="my-3">
                                <Spinner />
                            </div>
                        ) :
                            <PrimaryButton
                                className="ml-4"
                                processing={processing}
                            >
                                {__("Request Audio")}
                            </PrimaryButton>
                        }
                    </div>
                </form>
            </div>
        </>
    )
};

export default function SingleAudio({ audio, relatedaudio, url, inModal = false, }) {
    if (inModal) {
        return <AudioComponent audio={audio} relatedaudio={relatedaudio} url={url} inModal={true} />;
    } else {
        return (
            <AuthenticatedLayout>
                <Head title={audio?.title?.trim() || 'Default Title'} />
                <AudioComponent audio={audio} relatedaudio={relatedaudio} url={url} inModal={false} />
                <RelatedAudioComponent relatedaudio={relatedaudio} />
                <RequestAudioComponent audio={audio} />
            </AuthenticatedLayout>
        );
    }
}