import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EbookLoop from "./Partials/EbookLoop";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import { BsTagFill, BsFillTagsFill, BsShare, BsHeart, BsEyeFill, BsHeartFill } from "react-icons/bs/index.js";
import { AiOutlineEye } from "react-icons/ai/index.js";
import { FcUnlock, FcEmptyFilter } from "react-icons/fc/index.js";
import Spinner from "@/Components/Spinner";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from 'react-toastify';
import { MdGeneratingTokens, MdVideoLibrary, MdDownload } from "react-icons/md/index.js";
import axios from "axios";
import { FaGrinStars } from "react-icons/fa/index.js";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import ShareLink from "./ShareLink";
import InputLabel from "@/Components/InputLabel";
import SubscribePopup from "../Channel/Partials/SubscribePopup";
import InputError from "@/Components/InputError";
import Textarea from "@/Components/Textarea";
import { Inertia } from "@inertiajs/inertia";
import "plyr-react/plyr.css";
import { MdOutlinePictureAsPdf } from "react-icons/md";

const EbookComponent = ({ ebook, relatedebook, url, inModal, authUser }) => {
    console.log("ebook:", ebook);

    const [duration, setDuration] = useState()
    const [link, setLink] = useState(false);
    const [modal, setModal] = useState(false);
    const [freeShow, setFreeShow] = useState(false);
    const [favourite, setFavourite] = useState(ebook.isUserFavorite)
    const [downloadError, setDownloadError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [viewIncreased, setViewIncreased] = useState(false);

    const [downloadMessage, setDownloadMessage] = useState("");

    const openSharigModal = (e, link) => {
        e.preventDefault();
        setLink(link);
        setModal(true);
    };

    const addToFav = () => {
        setFavourite(true)
        axios.post(route("ebook.addToFavorite", { id: ebook.id }));
    };

    const removeFromFav = () => {
        setFavourite(false)
        axios.post(route("ebook.removeFromFavorite", { id: ebook.id }));
    };

    useEffect(() => {
        if (ebook?.id && !inModal) {
            handleIncreaseViews();
        }
    }, [ebook.id, inModal]);

    const handleIncreaseViews = () => {
        axios.post(route("ebook.increaseEbookViews", { ebook: ebook.id }))
            .then(() => {
                setViewIncreased(true);
            })
            .catch(error => {
                console.error("Error increasing views:", error);
            });
    };

    const handleDownload = async () => {
        setLoading(true);
        setDownloadError(null);
        try {
            window.location.href = route("ebook.download", { ebook: ebook.id });
        } catch (error) {
            console.error("Download error:", error);
            setDownloadError(__("An error occurred while initiating download."));
        } finally {
            setLoading(false);
        }
    };

    const handleStreamEbook = () => {
        window.open(route("ebook.stream", { ebook: ebook.id }), '_blank');
    };

    return (
        <>
            <Modal show={modal} onClose={(e) => setModal(false)}>
                {link && <ShareLink link={link} inModal={true} />}
            </Modal>

            <div className={`justify-center w-full ${inModal ? "p-3" : "p-0"}`}>
                <div className="flex items-start">
                    <div className="mr-5 flex flex-col items-center flex-shrink-0">
                        <Link
                            href={route("channel", {
                                user: ebook.streamer.username,
                            })}
                        >
                            <img
                                src={ebook.streamer.profile_picture}
                                className="w-14 h-14 rounded-full"
                            />
                        </Link>
                    </div>
                    <div>
                        <h3 className="text-lg md:text-2xl font-light dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                            {ebook.title}
                        </h3>

                        <div className="flex items-center flex-wrap md:space-x-2 mt-1">
                            <Link
                                href={route("channel", {
                                    user: ebook.streamer.username,
                                })}
                                className="text-sm text-gray-600 mr-2  dark:text-white"
                            >
                                @{ebook.streamer.username}
                            </Link>

                            {ebook.selectedCategory?.map((category, index) => (
                                <Link
                                    href={route("ebook.browse", {
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
                                {ebook?.tags?.map((tag, index) => (
                                    <Link
                                        href={route("tag", {
                                            id: tag.id,
                                        })}
                                        className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                                    > <span>{tag.name} {index !== ebook.tags.length - 1 && ', '}</span>
                                    </Link>
                                ))}
                            </span>

                            {ebook.free_for_subs === "yes" && ebook.price !== 0 && (
                                <div
                                    className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                    <FaGrinStars className="w-4 h-4 mr-1" />
                                    {__("Free For Subscribers")}
                                </div>
                            )}

                            {ebook.canDownload && (
                                <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                    <button
                                        onClick={handleDownload}
                                        className="relative flex items-center justify-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="loader"></span>
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

                            <div
                                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <span> {__("Duration ")} : {ebook.duration.minute}</span>
                            </div>

                            <div
                                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <span> {__("Resolution ")} : {ebook.duration.resolution}</span>
                            </div>

                            <div
                                className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                                onClick={(e) => openSharigModal(e, document.URL)}
                            >
                                <BsShare className="w-4 h-4 mr-1" />
                                {__("Share ")}
                            </div>

                            <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <SubscribePopup
                                    user={ebook.streamer}
                                    userIsSubscribed={ebook.isCurrentSubscriber}
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
                                            <span>{ebook?.views}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer"
                                            onClick={(e) => addToFav()}
                                        >
                                            <BsHeart style={{ "color": "red" }} className="w-4 h-4 mr-1" />
                                        </div>
                                        <div className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer" >
                                            <BsEyeFill style={{ color: "red" }} className="w-4 h-4 mr-1" />
                                            <span>{ebook?.views}</span>
                                        </div>
                                    </>
                                )
                            }

                            {(ebook.ebook_file && ebook.ebook) &&
                                <>
                                    {!ebook.canBePlayed && (
                                        <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-yellow-300 rounded px-2 py-1 text-gray-500 dark:text-gray-600 cursor-pointer"
                                            onClick={(e) =>
                                                Inertia.visit(
                                                    route("ebook.unlock", {
                                                        ebook: ebook.id,
                                                    })
                                                )
                                            }
                                        >
                                            <MdGeneratingTokens className="w-4 h-4 mr-1" />
                                            {__("Unlock with :tokens tokens", {
                                                tokens: ebook.price,
                                            })}
                                        </div>
                                    )}
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div className="mt-5 text-center">
                    {
                        (!ebook.ebook_file && !ebook.ebook) ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <p className="text-red-500 text-lg font-semibold">
                                    Something is wrong, Ebook was not found.
                                </p>
                            </div>
                        ) : (
                            <>
                                {ebook.canBePlayed ? (
                                    <div className="max-w-xl mx-auto">
                                        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-md">
                                            {ebook.thumbnail ? (
                                                <img src={`/${ebook.thumbnail}`} alt={ebook.title_en} className="w-full h-auto object-cover" />
                                            ) : (
                                                <MdOutlinePictureAsPdf className="text-gray-400 text-9xl mx-auto my-10" />
                                            )}
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
                                                {/* <h3 className="text-xl font-bold mb-3">{__("You have access to this Ebook!")}</h3> */}
                                                <div className="flex space-x-3">
                                                    <PrimaryButton onClick={handleStreamEbook} className="inline-flex items-center">
                                                        <AiOutlineEye className="w-5 h-5 mr-2" />{__("View Ebook")}
                                                    </PrimaryButton>
                                                    <SecondaryButton onClick={handleDownload} className="inline-flex items-center">
                                                        <MdDownload className="w-5 h-5 mr-2" />{__("Download Ebook")}
                                                    </SecondaryButton>
                                                </div>
                                                {downloadMessage && <p className="text-green-300 mt-2 text-sm">{downloadMessage}</p>}
                                                {downloadError && <p className="text-red-300 mt-2 text-sm">{downloadError}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
                                        <img src={ebook.thumbnail || "/default-thumbnail.jpg"} alt="Ebook Preview" className="rounded-lg w-full h-auto object-cover" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white p-4 text-center rounded-lg">
                                            <div className="bg-white inline-flex bg-opacity-25 rounded-full p-2"><FcUnlock className="w-12 h-12" /></div>
                                            {ebook.price > 0 && (
                                                <PrimaryButton className="h-12 mt-5 inline-flex"
                                                    onClick={() => Inertia.visit(route("ebook.unlock", { ebook: ebook.id }))}>
                                                    <MdGeneratingTokens className="mr-2 w-6 h-6 md:w-8 md:h-8" />
                                                    {__("Unlock with :tokens tokens", { tokens: ebook.price })}
                                                </PrimaryButton>
                                            )}
                                            {ebook.price <= 0 && (<p className="text-lg font-semibold mt-3">{__("You need to unlock to read this ebook.")}</p>)}
                                        </div>
                                    </div>
                                )}
                            </>
                        )
                    }
                </div>

                <div className="mt-5 dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400">
                    {ebook.description ? ebook.description : ''}
                </div>
            </div>
        </>
    );
};

const RelatedEbookComponent = ({ relatedebook }) => {
    const [nextUrl, setNextUrl] = useState("")
    const [spinner, setSpinner] = useState(false);
    const [ebook, setEbook] = useState("")

    useEffect(() => {
        setEbook(relatedebook.data)
        setNextUrl(relatedebook.next_page_url)
    }, [])

    const handleLoadNewEbook = async (next_page_url) => {
        setSpinner(true);
        try {
            const res = await axios.get(next_page_url)
            setEbook([...ebook, ...res.data.data])
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
                    {__("Related ebook")}
                </h2>
            </div>

            <div className="mt-5 mb-5">
                {relatedebook.total === 0 && (
                    <div
                        className="text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center">
                        <FcEmptyFilter className="w-12 h-12 mr-2" />
                        {__("No ebook to show")}
                    </div>
                )}
                {ebook.length > 0 && <EbookLoop ebook={ebook} />}

                {relatedebook.last_page > 1 && (
                    <>
                        {spinner ? (
                            <div className="my-3">
                                <Spinner />
                            </div>
                        ) :
                            <SecondaryButton className="mt-2" processing={relatedebook.next_page_url ? false : true} onClick={() => handleLoadNewEbook(nextUrl)}
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

const RequestEbookComponent = ({ ebook }) => {
    const [spinner, setSpinner] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        description: "",
        ebook_id: ebook.id
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
                url: route('request.ebook'),
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
                    {__("Request ebook")}
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
                        <InputError message={errors.title} className="mt-2" />
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
                                {__("Request ebook")}
                            </PrimaryButton>
                        }
                    </div>
                </form>
            </div>
        </>
    )
};

export default function SingleEbook({ ebook, relatedebook, url, inModal = false, authUser }) {
    const loggedInUser = authUser;

    return (
        <AuthenticatedLayout>
            <Head title={ebook?.title_en || 'Ebook Details'} />
            <EbookComponent ebook={ebook} relatedebook={relatedebook} url={url} inModal={inModal} authUser={loggedInUser} />
            {!inModal && <RelatedEbookComponent relatedebook={relatedebook} />}
            {!inModal && <RequestEbookComponent ebook={ebook} />}
        </AuthenticatedLayout>
    );
}